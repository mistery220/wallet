import { Token } from ".";

export type UserTokenMap = Record<string, UserToken>;

export type UserToken = Token & {
  bal: string;
};
