import useEvmClient from "./ecosystem/useEvmClient";

export default function usePublicClient() {
  const { getEvmPublicClient } = useEvmClient();
  return { getEvmPublicClient };
}
