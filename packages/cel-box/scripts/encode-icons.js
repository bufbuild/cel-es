import fs from "node:fs";
import url from "node:url";

const icons = [
  "check-circle-solid",
  "warning-circle",
  "xmark-circle",
];

const iconDataURLs = {};

for (const icon of icons) {
  const iconURL = import.meta.resolve(`iconoir/icons/${icon}.svg`);
  const iconPath = url.fileURLToPath(iconURL);
  const iconData = fs.readFileSync(iconPath);
  const iconDataString = iconData.toString('base64');

  iconDataURLs[icon] = `data:image/svg+xml;base64,${iconDataString}`;
}

fs.writeFileSync(
  `${import.meta.dirname}/../src/gen/icons.ts`,
  `const icons = ${JSON.stringify(iconDataURLs)}; export default icons;`
);
