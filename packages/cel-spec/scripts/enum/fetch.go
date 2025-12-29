// Copyright 2024-2025 Buf Technologies, Inc.
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
	"regexp"
	"strconv"
	"strings"

	goast "go/ast"
	goparser "go/parser"
	gotoken "go/token"
)

const celGoModule = "github.com/google/cel-go"

type StringConstant struct {
	Name  string `json:"name"`
	Value string `json:"value"`
}

// Examples:
// go run ./main.go -output=parser.json parser/parser_test.go
// go run ./main.go -output=comprehensions.ts ext/comprehensions_test.go
func main() {
	goModPath := flag.String("gomod", "go.mod", "path to the go mod file for resolving from the go module cache")
	outputPath := flag.String("output", "output.json", "write result to file")
	flag.Parse()
	if len(flag.Args()) != 2 {
		log.Fatalf("must provide enum name and path to a cel-go source file")
	}
	enumName := flag.Args()[0]
	sourcePath := flag.Args()[1]
	var sourceId = sourcePath

	file, sourceId, err := parseCelGoSourceFile(*goModPath, sourcePath)

	if err != nil {
		log.Fatalf("failed to parse source: %v", err)
	}

	constants := findConstants(file)

	err = write(enumName, constants, sourceId, *outputPath)
	if err != nil {
		log.Fatalf("failed to write output: %v", err)
	}
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

func upperSnakeCase(str string) string {
	upperSnakeRegexp := regexp.MustCompile(`(.)([A-Z])`)

	return strings.ToUpper(
		upperSnakeRegexp.ReplaceAllStringFunc(
			str,
			func(pair string) string {
				return string([]byte{pair[0], '_', pair[1]})
			},
		),
	)
}

func findConstants(file *goast.File) []*StringConstant {
	constants := []*StringConstant{}

	for _, decl := range file.Decls {
		constDecl, ok := decl.(*goast.GenDecl)
		if !ok || constDecl.Tok != gotoken.CONST {
			continue
		}

		for _, spec := range constDecl.Specs {
			valueSpec, ok := spec.(*goast.ValueSpec)
			if !ok || len(valueSpec.Names) != len(valueSpec.Values) {
				continue
			}

			for i := range len(valueSpec.Names) {
				name, value := valueSpec.Names[i].Name, valueSpec.Values[i]
				literal, ok := value.(*goast.BasicLit)
				if !ok {
					continue
				}

				upperSnakeName := upperSnakeCase(name)
				unquotedValue, _ := strconv.Unquote(literal.Value)
				constants = append(constants, &StringConstant{
					Name:  upperSnakeName,
					Value: unquotedValue,
				})
			}
		}
	}

	return constants
}

func write(enumName string, constants []*StringConstant, sourceId string, outputPath string) error {
	var output []byte
	if strings.HasSuffix(outputPath, ".ts") {
		buf := strings.Builder{}
		buf.WriteString("// Generated from cel-go " + sourceId + "\n")
		buf.WriteString("export enum " + enumName + " {\n")
		for _, c := range constants {
			jv, _ := json.Marshal(c.Value)
			buf.WriteString("  " + c.Name + " = ")
			buf.Write(jv)
			buf.WriteString(",\n")
		}
		buf.WriteString("}\n")
		output = []byte(buf.String())
	} else {
		output, _ = json.Marshal(constants)
	}
	return os.WriteFile(outputPath, output, 0644)
}

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
