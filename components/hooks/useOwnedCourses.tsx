import { useWeb3 } from "@components/providers";
import { CourseType } from "types/content";

export const useOwnedCourses = (courses: CourseType[], account?: string) => {
  const { hooks } = useWeb3();

  return hooks!.useOwnedCourses(courses, account);
};
