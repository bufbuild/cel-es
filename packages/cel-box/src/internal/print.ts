import * as CEL from "@bufbuild/cel";

function indent(text: string) {
  return `${text.split("\n").map(l => `  ${l}`).join("\n")}`;
}

export function print(value: CEL.CelValue): string {
  if (typeof value === "bigint")
    return value.toString();

  if (typeof value === "boolean")
    return value.toString();

  if (typeof value === "number") {
    const number = value.toString();
    return /^[0-9]+$/.test(number) ? `${number}.0` : number;
  }

  if (typeof value === "string")
    return JSON.stringify(value);

  if (value instanceof Uint8Array)
    return `b"${[...value].map(b => `\\x` + b.toString(0x10).toUpperCase().padStart(2, "0")).join('')}"`;

  if (CEL.isCelUint(value))
    return `${value.value}u`;

  if (CEL.isCelType(value))
    return value.name;

  if (CEL.isCelList(value))
    return "[\n" + indent([...value].map(print).join(",\n")) + "\n]";

  if (CEL.isCelMap(value))
    return (
      "{\n" +
      indent(
        [...value.keys()]
          .sort()
          .map(
            k => `${print(k)}: ${print(value.get(k) as CEL.CelValue)}`
          )
          .join(",\n"),
      ) +
      "\n}"
    );

  throw new Error("Cannot print value of this type.")
}
