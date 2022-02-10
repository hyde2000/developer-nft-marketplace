import { useWeb3 } from "@components/providers";
import { UseAccountColumns } from "types/hooks";

export const useManagedCourses = (account?: UseAccountColumns) => {
  const { hooks } = useWeb3();
  return hooks!.useManagedCourses(account);
};
