import { useWeb3 } from "@components/providers";

export const useNetwork = () => {
  const { hooks } = useWeb3();
  return hooks!.useNetwork();
};
