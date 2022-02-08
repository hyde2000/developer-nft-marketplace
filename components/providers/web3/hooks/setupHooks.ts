import Web3 from "web3";
import { accountHandler } from "./useAccount";
import { networkHandler } from "./useNetwork";

export const setupHooks = (web3: Web3 | null, provider: any) => {
  return {
    useAccount: accountHandler(web3, provider),
    useNetwork: networkHandler(web3, provider),
  };
};
