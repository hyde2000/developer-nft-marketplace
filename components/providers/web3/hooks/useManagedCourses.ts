import Web3 from "web3";
import useSWR from "swr";

import { normalizeOwnedCourse } from "@utils/normalizeOwnedCourse";
import { NormalizedManagedCourseType } from "types/common";
import { UseAccountColumns } from "types/hooks";

export const managedCoursesHandler =
  (web3: Web3 | null, contract: any) => (account?: UseAccountColumns) => {
    const { data, mutate, isValidating } = useSWR(
      () =>
        web3 && contract && account?.data && account.isAdmin
          ? `web3/managedCourses/${account.data}`
          : null,
      async () => {
        const courses = [];
        const courseCount = await contract.methods.getCourseCount().call();

        for (let i = Number(courseCount) - 1; i >= 0; i--) {
          const courseHash = await contract.methods
            .getCourseHashAtIndex(i)
            .call();
          const course = await contract.methods
            .getCourseByHash(courseHash)
            .call();

          if (course) {
            const normalizedCourse: NormalizedManagedCourseType =
              normalizeOwnedCourse(web3)({ hash: courseHash }, course);
            courses.push(normalizedCourse);
          }
        }

        return courses;
      }
    );

    return {
      managedCourses: {
        data,
        mutate,
        isValidating,
      },
    };
  };
