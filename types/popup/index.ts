export type TokenAmount = {
  symbol: string;
  amount: string;
  usdValue: string;
};

export type FeeInfo = {
  amount: string;
  usdValue: string;
};

export type SiteInfo = {
  name: string;
  url: string;
  icon?: string;
};
export type PopupDetails = {
  site: SiteInfo;
  type: string;
  from: TokenAmount;
  to: TokenAmount;
  gasEstimate: FeeInfo;
  totalFee: FeeInfo;
};

export type PopupContextType = {
  showPopup: (transaction: PopupDetails, onConfirm: () => void) => void;
  hidePopup: () => void;
};
