import { JoinDelimiter } from "@/constants/string/delimiter";

export function joinStrings(...inputs: (string | number)[]): string {
  return inputs.join(JoinDelimiter);
}
