import { useAccount } from "./useAccount";
import { useNetwork } from "./useNetwork";

export const useWalletInfo = () => {
  const { account } = useAccount();
  const { network } = useNetwork();

  const isConnecting =
    !account.hasInitialResponse && !network.hasInitialResponse;

  return {
    account,
    network,
    isConnecting,
    hasConnectedWallet: !!(account.data && network.isSupported),
  };
};
