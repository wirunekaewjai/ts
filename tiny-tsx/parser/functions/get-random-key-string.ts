import { getRandomKey } from "./get-random-key";

export function getRandomKeyString(input: string) {
  return "v_" + getRandomKey(input);
}