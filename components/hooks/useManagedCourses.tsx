import { useWeb3 } from "@components/providers";

export const useManagedCourses = (account?: string) => {
  const { hooks } = useWeb3();
  return hooks!.useManagedCourses(account);
};
