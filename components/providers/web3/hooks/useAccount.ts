import { useEffect } from "react";
import useSWR from "swr";
import Web3 from "web3";

const adminAddress = process.env.ADMIN_HASHED_ADDRESS;

export const accountHandler = (web3: Web3 | null, provider: any) => () => {
  const { data, mutate, ...rest } = useSWR(
    () => (web3 ? "web3/accounts" : null),
    async () => {
      const accounts = await web3!.eth.getAccounts();
      return accounts[0];
    }
  );

  useEffect(() => {
    provider &&
      provider.on("accountsChanged", (accounts: string[]) =>
        mutate(accounts[0])
      );
  }, [provider]);
  return {
    account: {
      data,
      isAdmin: data && web3!.utils.keccak256(data) === adminAddress,
      mutate,
      ...rest,
    },
  };
};
