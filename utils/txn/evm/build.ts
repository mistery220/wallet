import { erc20Abi } from "@/default-objects/artifacts/erc20Abi";
import { Erc20Methods } from "@/enums/txn/evm";
import { HexString } from "@/types/address/evm";
import { Token } from "@/types/token";
import { trimUnits } from "@/utils/general/formatter";
import { isNativeCurrency, isToAndFromSame } from "@/utils/tokens/address";
import { encodeFunctionData, parseUnits } from "viem";

export const buildEvmTxnData = ({
  from,
  to,
  recipient,
  receiveAmount,
  sendAmount,
}: {
  from: Token;
  to: Token;
  recipient: string;
  sendAmount: string;
  receiveAmount: string;
}) => {
  if (isToAndFromSame(from, to)) {
    const sendVal = parseUnits(
      trimUnits(sendAmount, from.decimals),
      from.decimals
    );
    if (!isNativeCurrency(from.address)) {
      const encodedData = encodeFunctionData({
        abi: erc20Abi,
        functionName: Erc20Methods.Transfer,
        args: [recipient as HexString, sendVal],
      });
      return encodedData;
    }
  }
  return "";
};
