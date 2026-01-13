// Copyright 2024-2026 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"os"
	"os/exec"
	"path"
	"reflect"
	"strconv"
	"strings"

	goast "go/ast"
	goparser "go/parser"
	gotoken "go/token"

	// "cel.dev/expr"
	test2pb "cel.dev/expr/conformance/proto2"
	test3pb "cel.dev/expr/conformance/proto3"
	testpb "cel.dev/expr/conformance/test"

	"github.com/google/cel-go/cel"
	"github.com/google/cel-go/common"
	"github.com/google/cel-go/common/ast"
	"github.com/google/cel-go/common/debug"
	"github.com/google/cel-go/common/types"
	"github.com/google/cel-go/ext"
	"github.com/google/cel-go/parser"

	"google.golang.org/protobuf/encoding/protojson"
)

var (
	parserInstance *parser.Parser
	envWithMacros  *cel.Env
	envNoMacros    *cel.Env
)

type OriginalTest struct {
	Test *testpb.SimpleTest
}

type IncrementalSuite struct {
	Name   string              `json:"name"`
	Suites []*IncrementalSuite `json:"suites,omitempty"`
	Tests  []*IncrementalTest  `json:"tests,omitempty"`
}

type IncrementalTest struct {
	Original OriginalTest `json:"original"`
	Section  string       `json:"section,omitempty"`
	Ast      string       `json:"ast,omitempty"`
	Type     string       `json:"type,omitempty"`
	Error    string       `json:"error,omitempty"`
}

func wrapTest(test *testpb.SimpleTest) *IncrementalTest {
	t := &IncrementalTest{
		Original: OriginalTest{Test: test},
	}

	supplementTest(t)

	return t
}

func wrapString(expr string) *IncrementalTest {
	return wrapTest(&testpb.SimpleTest{Expr: expr})
}

func (t *IncrementalTest) unwrap() *testpb.SimpleTest {
	return t.Original.Test
}

func (o *OriginalTest) MarshalJSON() ([]byte, error) {
	return protojson.Marshal(o.Test)
}

const celGoModule = "github.com/google/cel-go"

func init() {
	var err error

	parserOpts := []parser.Option{
		parser.Macros(parser.AllMacros...),
		parser.MaxRecursionDepth(32),
		parser.ErrorRecoveryLimit(4),
		parser.ErrorRecoveryLookaheadTokenLimit(4),
		parser.PopulateMacroCalls(true),
		parser.EnableVariadicOperatorASTs(false),
	}

	parserInstance, err = parser.NewParser(parserOpts...)
	if err != nil {
		log.Fatalf("parser.NewParser() = %v", err)
	}

	stdOpts := []cel.EnvOption{
		cel.StdLib(),
		cel.ClearMacros(),
		cel.OptionalTypes(),
		cel.EagerlyValidateDeclarations(true),
		cel.EnableErrorOnBadPresenceTest(true),
		cel.Types(&test2pb.TestAllTypes{}, &test2pb.Proto2ExtensionScopedMessage{}, &test3pb.TestAllTypes{}),
		ext.Bindings(),
		ext.Encoders(),
		ext.Math(),
		ext.Protos(),
		ext.Strings(),
		cel.Lib(celBlockLib{}),
		cel.EnableIdentifierEscapeSyntax(),
	}

	envNoMacros, err = cel.NewCustomEnv(stdOpts...)
	if err != nil {
		log.Fatalf("cel.NewCustomEnv() = %v", err)
	}
	envWithMacros, err = envNoMacros.Extend(cel.Macros(cel.StandardMacros...))
	if err != nil {
		log.Fatalf("cel.NewCustomEnv() = %v", err)
	}
}

// Examples:
// go run ./main.go -output=parser.json parser/parser_test.go
// go run ./main.go -output=comprehensions.ts ext/comprehensions_test.go
func main() {
	goModPath := flag.String("gomod", "go.mod", "path to the go mod file for resolving from the go module cache")
	outputPath := flag.String("output", "output.json", "write result to file")
	flag.Parse()
	if len(flag.Args()) != 1 {
		log.Fatalf("must provide path to a cel-go source file or testdata JSON directory")
	}
	sourcePath := flag.Args()[0]
	suite := &IncrementalSuite{}
	var sourceId = sourcePath

	simpleTestFilePaths, err := os.ReadDir(sourcePath)
	if err == nil {
		suite.Name = "conformance"

		for _, path := range simpleTestFilePaths {
			name := path.Name()

			if strings.HasSuffix(name, ".json") {
				simpleTestFile, err := os.ReadFile(sourcePath + "/" + name)
				if err != nil {
					log.Fatalf("failed to read file: %v", err)
				}

				var file testpb.SimpleTestFile
				err = protojson.Unmarshal(simpleTestFile, &file)
				if err != nil {
					log.Fatalf("failed to unmarshal file: %v", err)
				}

				fileSuite := &IncrementalSuite{Name: file.GetName()}

				for _, section := range file.Section {
					sectionSuite := &IncrementalSuite{Name: section.GetName()}

					for _, test := range section.Test {
						sectionSuite.Tests = append(sectionSuite.Tests, wrapTest(test))
					}

					fileSuite.Suites = append(fileSuite.Suites, sectionSuite)
				}

				suite.Suites = append(suite.Suites, fileSuite)
			}
		}
	} else {
		var file *goast.File
		file, sourceId, err = parseCelGoSourceFile(*goModPath, sourcePath)

		if err != nil {
			log.Fatalf("failed to parse source: %v", err)
		}

		var filter func(file *goast.File) ([]*IncrementalTest, error)
		if strings.HasSuffix(sourcePath, "parser_test.go") {
			filter = findParserTests
			suite.Name = "parsing"
		} else if strings.HasSuffix(sourcePath, "comprehensions_test.go") {
			filter = findComprehensionTests
			suite.Name = "comprehension"
		} else {
			log.Fatalf("do not know what to extract from %s", sourcePath)
		}

		suite.Tests, err = filter(file)

		if err != nil {
			log.Fatalf("failed to extract expressions: %v", err)
		}
	}

	err = write(suite, sourceId, *outputPath)
	if err != nil {
		log.Fatalf("failed to write output: %v", err)
	}
}

func supplementTest(test *IncrementalTest) {
	var env *cel.Env
	if test.unwrap().GetDisableMacros() {
		env = envNoMacros
	} else {
		env = envWithMacros
	}

	src := common.NewStringSource(test.unwrap().GetExpr(), test.unwrap().GetName())
	ast, errors := parserInstance.Parse(src)
	if len(errors.GetErrors()) > 0 {
		test.Error = errors.ToDisplayString()
		return
	}

	test.Ast = debug.ToAdornedDebugString(
		ast.Expr(),
		&kindAdorner{},
	)

	var opts []cel.EnvOption
	if test.unwrap().GetContainer() != "" {
		opts = append(opts, cel.Container(test.unwrap().GetContainer()))
	}

	for _, d := range test.unwrap().GetTypeEnv() {
		opt, err := cel.ProtoAsDeclaration(d)
		if err != nil {
			test.Error = err.Error()
			return
		}
		opts = append(opts, opt)
	}

	var err error
	env, err = env.Extend(opts...)
	if err != nil {
		test.Error = err.Error()
		return
	}

	checked, iss := env.Compile(test.unwrap().GetExpr())
	if err := iss.Err(); err != nil {
		test.Error = err.Error()
		return
	}

	test.Type = cel.FormatCELType(checked.OutputType())
}

type kindAdorner struct {
	sourceInfo *ast.SourceInfo
}

func (k *kindAdorner) GetMetadata(elem any) string {
	switch e := elem.(type) {
	case ast.Expr:
		if macroCall, found := k.sourceInfo.GetMacroCall(e.ID()); found {
			return fmt.Sprintf("^#%s#", macroCall.AsCall().FunctionName())
		}
		var valType string
		switch e.Kind() {
		case ast.CallKind:
			valType = "*expr.Expr_CallExpr"
		case ast.ComprehensionKind:
			valType = "*expr.Expr_ComprehensionExpr"
		case ast.IdentKind:
			valType = "*expr.Expr_IdentExpr"
		case ast.LiteralKind:
			lit := e.AsLiteral()
			switch lit.(type) {
			case types.Bool:
				valType = "*expr.Constant_BoolValue"
			case types.Bytes:
				valType = "*expr.Constant_BytesValue"
			case types.Double:
				valType = "*expr.Constant_DoubleValue"
			case types.Int:
				valType = "*expr.Constant_Int64Value"
			case types.Null:
				valType = "*expr.Constant_NullValue"
			case types.String:
				valType = "*expr.Constant_StringValue"
			case types.Uint:
				valType = "*expr.Constant_Uint64Value"
			default:
				valType = reflect.TypeOf(lit).String()
			}
		case ast.ListKind:
			valType = "*expr.Expr_ListExpr"
		case ast.MapKind, ast.StructKind:
			valType = "*expr.Expr_StructExpr"
		case ast.SelectKind:
			valType = "*expr.Expr_SelectExpr"
		}
		return fmt.Sprintf("^#%s#", valType)
	case ast.EntryExpr:
		return fmt.Sprintf("^#%s#", "*expr.Expr_CreateStruct_Entry")
	}
	return ""
}

// Parse a GO file from the cel-go module in the module cache, honoring the version
// pinned in go-mod.
// For example, readCelGoSourceFile("go.mod", "parser/parser_test.go") parses the
// file $GOMODCACHE/github.com/google/cel-go@v0.22.2-0.20241217215216-98789f34a481/parser/parser_test.go
func parseCelGoSourceFile(goModPath string, filePath string) (*goast.File, string, error) {
	goMod, err := os.ReadFile(goModPath)
	if err != nil {
		return nil, "", fmt.Errorf("failed to read go.mod: %w", err)
	}
	ver := string(goMod)
	i := strings.Index(ver, celGoModule)
	if i < 0 {
		return nil, "", fmt.Errorf("%s not in go.mod", celGoModule)
	}
	ver = ver[i+len(celGoModule)+1:]
	i = strings.Index(ver, "\n")
	if i < 0 {
		return nil, "", fmt.Errorf("unexpected go.mod structure")
	}
	ver = ver[:i]
	goModCache := getGoModCache()
	if goModCache == "" {
		return nil, "", fmt.Errorf("cannot resolve go module cache, GOPATH and GOMODCACHE empty")
	}
	celGoModulePath := path.Join(goModCache, celGoModule+"@"+ver)
	_, err = os.Stat(celGoModulePath)
	if err != nil {
		return nil, "", fmt.Errorf("cannot resolve %s in go module cache: %w", celGoModulePath, err)
	}
	celGoFilePath := path.Join(celGoModulePath, filePath)
	fileData, err := os.ReadFile(celGoFilePath)
	if err != nil {
		return nil, "", fmt.Errorf("cannot read %s in %s: %w", filePath, celGoModulePath, err)
	}
	fset := gotoken.NewFileSet()
	file, err := goparser.ParseFile(fset, filePath, fileData, goparser.SkipObjectResolution)
	if err != nil {
		return nil, "", err
	}
	return file, celGoModule + "@" + ver + "/" + filePath, nil
}

// Find CEL expressions from cel-go's comprehensions_test.go
// Returns the unquoted string values from each `expr` defined in a `Test` func.
// See https://github.com/google/cel-go/blob/98789f34a481044a0ad4b8a77f298d2ec3623bdb/ext/comprehensions_test.go
func findComprehensionTests(file *goast.File) ([]*IncrementalTest, error) {
	var tests []*IncrementalTest
	for _, decl := range file.Decls {
		funcDecl, ok := decl.(*goast.FuncDecl)
		if !ok {
			continue
		}
		if !strings.HasPrefix(funcDecl.Name.Name, "Test") {
			continue
		}
		if len(funcDecl.Body.List) < 1 {
			continue
		}
		assign, ok := funcDecl.Body.List[0].(*goast.AssignStmt)
		if !ok {
			continue
		}
		for _, rhs := range assign.Rhs {
			compLit, ok := rhs.(*goast.CompositeLit)
			if !ok {
				continue
			}
			for _, expr := range compLit.Elts {
				compLit, ok := expr.(*goast.CompositeLit)
				if !ok {
					continue
				}
				for _, expr := range compLit.Elts {
					keyValueExpr, ok := expr.(*goast.KeyValueExpr)
					if !ok {
						continue
					}
					keyIdent, ok := keyValueExpr.Key.(*goast.Ident)
					if !ok {
						continue
					}
					if keyIdent.Name != "expr" {
						continue
					}
					valLit, ok := keyValueExpr.Value.(*goast.BasicLit)
					if !ok {
						continue
					}
					unquotedInput, err := strconv.Unquote(valLit.Value)
					if err != nil {
						return nil, fmt.Errorf("cannot unquote %s: %w", valLit.Value, err)
					}
					tests = append(tests, wrapString(unquotedInput))
				}
			}
		}
	}
	return tests, nil
}

// Find CEL expressions from cel-go's parser_test.go
// Returns the unquoted string values from each `testInfo.I` of the `testCases`
// slice.
// See https://github.com/google/cel-go/blob/98789f34a481044a0ad4b8a77f298d2ec3623bdb/parser/parser_test.go
func findParserTests(file *goast.File) ([]*IncrementalTest, error) {
	var tests []*IncrementalTest
	for _, decl := range file.Decls {
		genDecl, ok := decl.(*goast.GenDecl)
		if !ok {
			continue
		}
		for _, spec := range genDecl.Specs {
			valueSpec, ok := spec.(*goast.ValueSpec)
			if !ok {
				continue
			}
			for _, name := range valueSpec.Names {
				if name.Name != "testCases" {
					continue
				}
				for _, value := range valueSpec.Values {
					valueCompositeLit, ok := value.(*goast.CompositeLit)
					if !ok {
						continue
					}
					for _, expr := range valueCompositeLit.Elts {
						exprCompositeLit, ok := expr.(*goast.CompositeLit)
						if !ok {
							continue
						}
						for _, expr := range exprCompositeLit.Elts {
							keyValueExpr, ok := expr.(*goast.KeyValueExpr)
							if !ok {
								continue
							}
							keyIdent, ok := keyValueExpr.Key.(*goast.Ident)
							if !ok {
								continue
							}
							if keyIdent.Name != "I" {
								continue
							}
							valLit, ok := keyValueExpr.Value.(*goast.BasicLit)
							if !ok {
								continue
							}
							unquotedInput, err := strconv.Unquote(valLit.Value)
							if err != nil {
								return nil, fmt.Errorf("cannot unquote %s: %w", valLit.Value, err)
							}
							tests = append(tests, wrapString(unquotedInput))
						}
					}
				}
			}
		}
	}
	return tests, nil
}

func write(suite *IncrementalSuite, sourceId string, outputPath string) error {
	var output []byte
	if strings.HasSuffix(outputPath, ".ts") {
		buf := strings.Builder{}
		buf.WriteString("// Generated from cel-go " + sourceId + "\n")
		buf.WriteString("import type { SerializedIncrementalTestSuite } from './tests.js';")
		buf.WriteString("export const tests: SerializedIncrementalTestSuite = ")
		j, err := json.Marshal(suite)
		if err != nil {
			log.Fatal(err)
		}
		buf.Write(j)
		buf.WriteString(" as const;\n")
		output = []byte(buf.String())
	} else {
		output, _ = json.Marshal(suite)
	}
	return os.WriteFile(outputPath, output, 0644)
}

// The code below was adapted from: https://github.com/google/cel-go/blob/8890f56dd657d3f4746ad1c53f55b65574457d29/conformance/conformance_test.go
// This code is also licensed under the Apache License, Version 2.0.
// However, the copyright is as follows: Copyright 2024-2025 Google, LLC.

func getGoModCache() string {
	goModCache := os.Getenv("GOMODCACHE")
	if goModCache != "" {
		return goModCache
	}
	goPath := os.Getenv("GOPATH")
	if goPath != "" {
		return path.Join(goPath, "pkg/mod")
	}
	cmd := exec.Command("go", "env", "GOMODCACHE")
	var sb strings.Builder
	cmd.Stdout = &sb
	if err := cmd.Run(); err != nil {
		return ""
	}
	return strings.TrimSpace(sb.String())
}

type celBlockLib struct{}

func (celBlockLib) LibraryName() string {
	return "cel.lib.ext.cel.block.conformance"
}

func (celBlockLib) CompileOptions() []cel.EnvOption {
	maxIndices := 30
	indexOpts := make([]cel.EnvOption, maxIndices)
	for i := 0; i < maxIndices; i++ {
		indexOpts[i] = cel.Variable(fmt.Sprintf("@index%d", i), cel.DynType)
	}
	return append([]cel.EnvOption{
		cel.Macros(
			cel.ReceiverMacro("block", 2, celBlock),
			cel.ReceiverMacro("index", 1, celIndex),
			cel.ReceiverMacro("iterVar", 2, celCompreVar("cel.iterVar", "@it")),
			cel.ReceiverMacro("accuVar", 2, celCompreVar("cel.accuVar", "@ac")),
		),
	}, indexOpts...)
}

func (celBlockLib) ProgramOptions() []cel.ProgramOption {
	return []cel.ProgramOption{}
}

func celBlock(mef cel.MacroExprFactory, target ast.Expr, args []ast.Expr) (ast.Expr, *cel.Error) {
	if !isCELNamespace(target) {
		return nil, nil
	}
	bindings := args[0]
	if bindings.Kind() != ast.ListKind {
		return bindings, mef.NewError(bindings.ID(), "cel.block requires the first arg to be a list literal")
	}
	return mef.NewCall("cel.@block", args...), nil
}

func celIndex(mef cel.MacroExprFactory, target ast.Expr, args []ast.Expr) (ast.Expr, *cel.Error) {
	if !isCELNamespace(target) {
		return nil, nil
	}
	index := args[0]
	if !isNonNegativeInt(index) {
		return index, mef.NewError(index.ID(), "cel.index requires a single non-negative int constant arg")
	}
	indexVal := index.AsLiteral().(types.Int)
	return mef.NewIdent(fmt.Sprintf("@index%d", indexVal)), nil
}

func celCompreVar(funcName, varPrefix string) cel.MacroFactory {
	return func(mef cel.MacroExprFactory, target ast.Expr, args []ast.Expr) (ast.Expr, *cel.Error) {
		if !isCELNamespace(target) {
			return nil, nil
		}
		depth := args[0]
		if !isNonNegativeInt(depth) {
			return depth, mef.NewError(depth.ID(), fmt.Sprintf("%s requires two non-negative int constant args", funcName))
		}
		unique := args[1]
		if !isNonNegativeInt(unique) {
			return unique, mef.NewError(unique.ID(), fmt.Sprintf("%s requires two non-negative int constant args", funcName))
		}
		depthVal := depth.AsLiteral().(types.Int)
		uniqueVal := unique.AsLiteral().(types.Int)
		return mef.NewIdent(fmt.Sprintf("%s:%d:%d", varPrefix, depthVal, uniqueVal)), nil
	}
}

func isCELNamespace(target ast.Expr) bool {
	return target.Kind() == ast.IdentKind && target.AsIdent() == "cel"
}

func isNonNegativeInt(expr ast.Expr) bool {
	if expr.Kind() != ast.LiteralKind {
		return false
	}
	val := expr.AsLiteral()
	return val.Type() == cel.IntType && val.(types.Int) >= 0
}
