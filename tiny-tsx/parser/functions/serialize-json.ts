// const QUOTE = "&quot;";

function isVar(input: string) {
  try {
    JSON.parse(input);
    return false;
  } catch {
    return true;
  }
}

function isString(input: string) {
  const a = input.trim();
  return a.startsWith('"');
}

function serializeArray(input: string, startAt: number, replacer?: (value: string) => string) {
  let cursor = startAt;
  let output: string[] = [];
  let buffer = "";

  const processValue = () => {
    buffer = buffer.trim();

    if (!buffer) {
      return;
    }

    if (isVar(buffer)) {
      output.push(replacer ? replacer(buffer) : buffer);
    } else {
      output.push(buffer);//.replace(/"/g, QUOTE));
    }

    buffer = "";
  };

  for (; cursor < input.length;) {
    const ch = input[cursor++];

    if (ch === "{") {
      buffer = "";

      const result = serializeJsonObject(input, cursor);

      cursor = result.cursor;
      output.push(result.output);

      continue;
    }

    if (ch === "[") {
      buffer = "";

      const result = serializeArray(input, cursor);

      cursor = result.cursor;
      output.push(result.output);

      continue;
    }

    if (ch === "]") {
      processValue();
      break;
    }

    if (ch === ",") {
      if (!isString(buffer)) {
        processValue();
        continue;
      }
    }

    if (ch === '"') {
      if (isString(buffer)) {
        buffer += ch;

        processValue();
        continue;
      }
    }

    buffer += ch;
  }

  if (buffer.length > 0) {
    processValue();
  }

  return {
    cursor,
    output: `[${output.join(",")}]`,
  };
}

export function serializeJsonObject(input: string, startAt: number, replacer?: (value: string) => string) {
  let cursor = startAt;
  let output = "{";
  let buffer = "";

  const processKey = () => {
    buffer = buffer.trim();

    if (!buffer) {
      return;
    }

    if (isVar(buffer)) {
      // output += `${QUOTE}${buffer}${QUOTE}:`;
      output += `"${buffer}"`;
    } else {
      output += buffer;//`${buffer.replace(/"/g, QUOTE)}:`;
      buffer = "";
    }
  };

  const processValue = () => {
    buffer = buffer.trim();

    if (!buffer) {
      return;
    }

    if (isVar(buffer)) {
      output += replacer ? replacer(buffer) : buffer;
    } else {
      output += buffer;//.replace(/"/g, QUOTE);
    }

    buffer = "";
  };

  for (; cursor < input.length;) {
    const ch = input[cursor++];

    if (ch === "{") {
      const result = serializeJsonObject(input, cursor);

      cursor = result.cursor;
      output += result.output;

      continue;
    }

    if (ch === "[") {
      const result = serializeArray(input, cursor);

      cursor = result.cursor;
      output += result.output;

      continue;
    }

    if (ch === "}") {
      if (output.endsWith(":")) {
        processValue();
      } else {
        processKey();
        processValue();
      }

      break;
    }

    if (ch === ",") {
      if (output.endsWith(":")) {
        processValue();
      } else {
        processKey();
        processValue();
      }

      continue;
    }

    if (ch === ":") {
      processKey();
      continue;
    }

    buffer += ch;
  }

  if (buffer.length > 0) {
    if (output.endsWith(":")) {
      processValue();
    } else {
      processKey();
      processValue();
    }
  }

  output += "}";

  return {
    cursor,
    output,
  };
}