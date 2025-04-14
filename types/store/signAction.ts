export type SignatureActionStore = {
  signData: any[];
  addSignData: (newSignData: any) => void;
  removeSignDataFromFront: () => void;
};
