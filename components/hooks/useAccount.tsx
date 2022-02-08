import { useWeb3 } from "@components/providers";

export const useAccount = () => {
  const { hooks } = useWeb3();
  return hooks!.useAccount();
};
