import { OutputType } from "../types";
import { toPascalCase } from "./to-pascal-case";

function getRustType(input: string) {
  switch (input) {
    case "boolean":
      return "bool";

    case "string":
      return "String";

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
      throw `invalid rust type: ${input}`;
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
      throw `invalid typescript type: ${input}`;
  }
}

export function collectFunctionInterfaces(name: string, type: OutputType, items: string[]) {
  const prefix = toPascalCase(name);

  // console.log("#", fileName, "->", name);

  const interfaceMap: Map<string, string> = new Map();
  const interfaceFields: Map<string, string[][]> = new Map();

  for (const item of items) {
    const arr = item.replace(/\s+/g, " ").split(" ");
    const interfaceName = prefix + arr[1];

    interfaceMap.set(arr[1], interfaceName);

    // console.log(interfaceName);

    const fields: string[][] = [];

    for (let i = 3; i < arr.length - 1; i += 2) {
      const fieldName = arr[i].slice(0, -1).trim();
      let fieldType = arr[i + 1].slice(0, -1).trim();

      if (interfaceMap.get(fieldType)) {
        // console.log("aaa", fieldType);
        fieldType = interfaceMap.get(fieldType)!;
      }

      else if (type === OutputType.RS_MACRO || type === OutputType.RS_STRING) {
        fieldType = getRustType(fieldType);
      }

      else {
        fieldType = getTypescriptType(fieldType);
      }

      fields.push([fieldName, fieldType]);

      // console.log(fieldName, fieldType);
    }

    interfaceFields.set(interfaceName, fields);
  }

  return {
    fields: interfaceFields,
    map: interfaceMap,
  };
}