export function skipCommentInline(input: string, startAt: number) {
  let cursor = startAt;
  let buffer = "";

  for (; cursor < input.length;) {
    const ch = input[cursor++];

    buffer += ch;

    if (buffer.endsWith("\n")) {
      return {
        cursor,
        output: "\n",
      };
    }
  }

  return {
    cursor,
    output: "",
  };
}