import fs from "node:fs";
import path from "node:path";

const packagePath = path.resolve(import.meta.dirname, '../')
const stylesheetsPath = path.resolve(packagePath, 'stylesheets')

const stylesheets = fs.readdirSync(
  stylesheetsPath,
  {
    recursive: true,
    withFileTypes: true,
  },
);

console.log(stylesheets);

const map = {};

for (const stylesheet of stylesheets) {
  if (stylesheet.isFile() && stylesheet.name.endsWith('.css')) {
    const stylesheetPath = path.resolve(stylesheet.parentPath, stylesheet.name);
    map[path.relative(packagePath, stylesheetPath)] = fs.readFileSync(
      stylesheetPath,
      { encoding: "utf8" }
    )
  }
}

fs.writeFileSync(
  `${import.meta.dirname}/../src/gen/stylesheets.ts`,
  `const stylesheets = ${JSON.stringify(map)}; export default stylesheets;`
);
