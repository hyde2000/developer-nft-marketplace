import { useEffect } from "react";
import useSWR from "swr";
import Web3 from "web3";

const NETWORKS: { [key: number]: string } = {
  1: "Ethereum Main Network",
  3: "Ropsten Test Network",
  4: "Rinkeby Test Network",
  5: "Goerli Test Network",
  42: "Kovan Test Network",
  56: "Binance Smart Chain",
  1337: "Ganache",
};

const TARGET_CHAIN_ID = Number(process.env.NEXT_PUBLIC_TARGET_CHAIN_ID);
let targetNetwork: string;
if (TARGET_CHAIN_ID) {
  targetNetwork = NETWORKS[TARGET_CHAIN_ID];
}

export const networkHandler = (web3: Web3 | null, provider: any) => () => {
  const { data, error, mutate, ...rest } = useSWR(
    () => (web3 ? "web3/network" : null),
    async () => {
      const chainID = await web3!.eth.getChainId();
      if (!chainID) {
        throw new Error("Cannot retreive network, Please refresh the browser.");
      }

      return NETWORKS[chainID];
    }
  );

  useEffect(() => {
    const mutator = (chainID: string) =>
      mutate(NETWORKS[parseInt(chainID, 16)]);
    provider.on("chainChanged", mutator);

    return () => {
      provider.removeListener("chainChanged", mutator);
    };
  }, [provider]);

  return {
    network: {
      data,
      hasInitialResponse: data || error,
      mutate,
      target: targetNetwork,
      isSupported: data === targetNetwork,
      ...rest,
    },
  };
};
