export const DEFAULT_SVM_NAMESPACE = {
  methods: [
    "solana_signMessage",
    "solana_signTransaction",
    "solana_requestAccounts",
    "solana_getAccounts",
    "solana_signAllTransactions",
    "solana_signAndSendTransaction",
  ],
  events: ["accountsChanged", "chainChanged"],
};
