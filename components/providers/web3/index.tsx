import detectEthereumProvider from "@metamask/detect-provider";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Web3 from "web3";
import { provider } from "web3-core/types";

import { GetHooksType } from "types/hooks";
import { setupHooks } from "./hooks/setupHooks";
import { loadContract } from "@utils/loadContract";

interface Web3ContextType {
  provider: any;
  web3: Web3 | null;
  contract: any;
  isLoading: boolean;
  requireInstall?: boolean;
  hooks?: GetHooksType;
  connect?: () => void;
}

const Web3Context = createContext<Web3ContextType>({
  provider: null,
  web3: null,
  contract: null,
  isLoading: true,
});

const setListeners = (provider: any) => {
  provider.on("chainChanged", () => window.location.reload());
};

const Web3Provider = ({ children }: { children: ReactNode | ReactNode[] }) => {
  const [web3Api, setWeb3Api] = useState<Web3ContextType>({
    provider: Web3.givenProvider,
    web3: null,
    contract: null,
    isLoading: true,
  });

  useEffect(() => {
    const loadProvider = async () => {
      const provider = (await detectEthereumProvider({
        mustBeMetaMask: true,
      })) as provider;

      if (provider && window.ethereum?.isMetaMask) {
        const web3 = new Web3(provider);
        const contract = await loadContract("CourseMarketplace", web3);

        setListeners(provider);
        setWeb3Api({
          provider,
          web3,
          contract,
          isLoading: false,
        });
      } else {
        setWeb3Api((api) => ({ ...api, isLoading: false }));
        console.error("Please, install Metamask");
      }
    };

    loadProvider();
  }, []);

  const _web3Api = useMemo(() => {
    const { web3, provider, isLoading, contract } = web3Api;

    return {
      ...web3Api,
      requireInstall: !isLoading && !web3,
      hooks: setupHooks(web3, provider, contract),
      connect: provider
        ? async () => {
            try {
              await web3Api.provider.request({
                method: "eth_requestAccounts",
              });
            } catch (err: any) {
              location.reload();
            }
          }
        : () =>
            console.error(
              "Cannot connect to Metamask, try to reload your browser."
            ),
    };
  }, [web3Api]);

  return (
    <Web3Context.Provider value={_web3Api}>{children}</Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  return useContext(Web3Context);
};

export default Web3Provider;
