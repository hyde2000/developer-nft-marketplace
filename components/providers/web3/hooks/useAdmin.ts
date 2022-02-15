import { useEffect } from "react";
import { useRouter } from "next/router";

import { useAccount } from "@components/hooks/useAccount";
import { useWeb3 } from "..";

export const useAdminHandler = (redirectTo: string) => {
  const { account } = useAccount();
  const { requireInstall } = useWeb3();

  const router = useRouter();

  useEffect(() => {
    if (
      requireInstall ||
      (account.hasInitialResponse && !account.isAdmin) ||
      account.isEmpty
    ) {
      router.push(redirectTo);
    }
  }, [account, redirectTo, requireInstall, router]);

  return { account };
};
