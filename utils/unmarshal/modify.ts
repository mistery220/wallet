import { Networks } from "@/enums/network/ecosystem";
import { Token } from "@/types/token";
import { UnmarshalBalanceResponse } from "@/types/unmarshal/balance";

export const formatUnmarshalResponse = (
  network: Networks,
  data: UnmarshalBalanceResponse
): Token[] => {
  return data.map((item) => ({
    name: item.contract_name,
    symbol: item.contract_ticker_symbol,
    decimals: parseInt(item.contract_decimals, 10),
    chainId: item.coin, // chainId
    network,
    address: item.contract_address,
    logo: item.logo_url,
    usd: item.quote_rate, // price in USD
    bal: item.balance, // token balance
    usd_change_24h: item.quote_pct_change_24h,
    verified: item.verified,
  }));
};
