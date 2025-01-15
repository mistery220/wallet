export type UnmarshalBalanceResponse = {
  balance: string;
  coin: number; // chainId
  coin_gecko_id: string;
  contract_address: string;
  contract_decimals: string;
  contract_name: string;
  contract_ticker_symbol: string;
  logo_url: string;
  quote: string;
  quote_pct_change_24h: string;
  quote_rate: string; // price
  quote_rate_24h: string; // probably price change
  type: string;
  verified: boolean;
}[];
