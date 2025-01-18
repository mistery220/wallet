import { Token } from ".";

export type FormToken = { assets?: Token; amount: string };

export type CompleteFormToken = Required<FormToken>;
