export const getUnmarshalBalanceUrl = ({
  chainName,
  address,
  verified,
  includeLowVolume,
  offset,
}: {
  chainName: string;
  address: string;
  verified?: boolean;
  includeLowVolume: boolean;
  offset: number;
}) => {
  let query = `includeLowVolume=${includeLowVolume.toString()}&offset=${offset}&auth_key=${
    process.env.EXPO_PUBLIC_UNMARSHAL_ACCESS_KEY
  }`;
  if (verified !== undefined) {
    query += `&verified=${verified.toString()}`;
  }
  return `https://api.unmarshal.com/v2/${chainName}/address/${address}/assets?${query}`;
};
