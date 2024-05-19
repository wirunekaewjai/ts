import { OutputType } from "../types";

function getRustType(input: string) {
  switch (input) {
    case "boolean":
      return "bool";

    case "string":
      return "&str";

    case "i8":
    case "i16":
    case "i32":
    case "i64":
    case "u8":
    case "u16":
    case "u32":
    case "u64":
      return input;

    default:
      throw `invalid rust inline type: ${input}`;
  }
}

function getTypescriptType(input: string) {
  switch (input) {
    case "i8":
    case "i16":
    case "i32":
    case "i64":
    case "u8":
    case "u16":
    case "u32":
    case "u64":
      return "number";

    case "boolean":
    case "string":
      return input;

    default:
      throw `invalid typescript inline type: ${input}`;
  }
}

export function collectFunctionArgs(type: OutputType, input: string, map: Map<string, string>) {
  const arr = input.trim().slice(1, -1).split(",").filter((e) => !!e);
  const fields: string[][] = [];

  for (const text of arr) {
    const parts = text.split(":");
    const argName = parts[0].trim();

    let argType = parts[1].trim();

    if (map.get(argType)) {
      argType = map.get(argType)!;
    }

    else if (type === OutputType.RS_MACRO || type === OutputType.RS_STRING) {
      argType = getRustType(argType);
    }

    else {
      argType = getTypescriptType(argType);
    }

    fields.push([argName, argType]);
  }

  return fields.map((arg) => `${arg[0]}: ${arg[1]}`).join(", ");
}