import { useWeb3 } from "@components/providers";
import { CourseType } from "types/content";

export const useOwnedCourse = (course: CourseType, account?: string) => {
  const { hooks } = useWeb3();

  return hooks!.useOwnedCourse(course, account);
};
