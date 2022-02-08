import { KeyedMutator } from "swr";
import { NormalizedOwnedCourseType, OwnedCourseType } from "types/common";
import { CourseType } from "types/content";

export type UseAccountColumns = {
  data?: string;
  isAdmin?: boolean | "";
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
  mutate?: KeyedMutator<string>;
};

export type useOwnedCoursesColumns = {
  data?: NormalizedOwnedCourseType[];
  isValidating: boolean;
  mutate?: KeyedMutator<NormalizedOwnedCourseType[]>;
};

export type GetHooksType = {
  useAccount: () => { account: UseAccountColumns };
  useNetwork: () => { network: UseNetworkColumns };
  useOwnedCourses: (
    courses: CourseType[],
    account?: string
  ) => { ownedCourses: useOwnedCoursesColumns };
};
