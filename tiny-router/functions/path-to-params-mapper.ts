export function pathToParamsMapper(path: string) {
  const mapper: Map<string, number> = new Map();
  const match = path.match(/(:[^\/]+\+)|(:[^\/]+)/g);

  if (match) {
    const getKey = (input: string) => {
      if (input.endsWith("+")) {
        return input.slice(1, -1);
      }

      return input.slice(1);
    };

    match.forEach((value, index) => {
      const key = getKey(value);
      mapper.set(key, index + 1);
    });
  }

  return mapper;
}