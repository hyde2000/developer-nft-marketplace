import { KeyedMutator } from "swr";
import {
  NormalizedManagedCourseType,
  NormalizedOwnedCourseType,
} from "types/common";
import { CourseType } from "types/content";

export type UseAccountColumns = {
  data?: string;
  isAdmin?: boolean | "";
  isEmpty: boolean;
  error?: any;
  isValidating: boolean;
  mutate: KeyedMutator<string>;
};

export type UseNetworkColumns = {
  data?: string;
  hasInitialResponse: boolean;
  target: string;
  isSupported: boolean;
  error?: any;
  isValidating: boolean;
  mutate: KeyedMutator<string>;
};

export type UseOwnedCoursesColumns = {
  data?: NormalizedOwnedCourseType[];
  isValidating: boolean;
  mutate: KeyedMutator<NormalizedOwnedCourseType[]>;
  isEmpty: boolean;
};

export type UseOwnedCourseColumns = {
  data?: NormalizedOwnedCourseType;
  isValidating: boolean;
  mutate: KeyedMutator<NormalizedOwnedCourseType | undefined>;
};

export type UseManagedCoursesColumns = {
  data?: NormalizedManagedCourseType[];
  isValidating: boolean;
  mutate: KeyedMutator<NormalizedManagedCourseType[]>;
};

export type GetHooksType = {
  useAccount: () => { account: UseAccountColumns };
  useNetwork: () => { network: UseNetworkColumns };
  useOwnedCourses: (
    courses: CourseType[],
    account?: string
  ) => { ownedCourses: UseOwnedCoursesColumns };
  useOwnedCourse: (
    course: CourseType,
    account?: string
  ) => { ownedCourse: UseOwnedCourseColumns };
  useManagedCourses: (account?: string) => {
    managedCourses: UseManagedCoursesColumns;
  };
};
