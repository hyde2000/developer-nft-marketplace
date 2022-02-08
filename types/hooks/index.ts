import { KeyedMutator } from "swr";

export type UseAccountColumns = {
  data?: string;
  isAdmin?: boolean | "";
  error?: any;
  isValidating: boolean;
  mutate: KeyedMutator<string>;
};

export type UseNetworkColumns = {
  data: string | undefined;
  hasInitialResponse: boolean;
  target: string;
  isSupported: boolean;
  error?: any;
  isValidating?: boolean;
  mutate?: KeyedMutator<string>;
};

export type GetHooksType = {
  useAccount: () => { account: UseAccountColumns };
  useNetwork: () => { network: UseNetworkColumns };
};
