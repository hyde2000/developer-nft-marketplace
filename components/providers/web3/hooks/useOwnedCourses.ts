import useSWR from "swr";
import Web3 from "web3";

import { CourseType } from "types/content";
import { normalizeOwnedCourse } from "@utils/normalizeOwnedCourse";
import { OwnedCourseType } from "types/common";
import { isEmpty } from "@components/hooks/isEmpty";
import { createCourseHash } from "@utils/createCourseHash";

export const ownedCoursesHandler =
  (web3: Web3 | null, contract: any) =>
  (courses: CourseType[], account?: string) => {
    const { data, isValidating, mutate, error } = useSWR(
      () =>
        web3 && contract && account ? `web3/ownedCourses/${account}` : null,
      async () => {
        const ownedCourses = [];

        for (let course of courses) {
          if (!course.id) {
            continue;
          }

          const hexCourseID = web3?.utils.utf8ToHex(course.id);
          if (hexCourseID && account) {
            const courseHash = createCourseHash(web3)(course.id, account);

            const ownedCourse: OwnedCourseType = await contract.methods
              .getCourseByHash(courseHash)
              .call();

            if (
              ownedCourse.owner !== "0x0000000000000000000000000000000000000000"
            ) {
              const normalizedOwnedCourse = normalizeOwnedCourse(web3)(
                course,
                ownedCourse
              );
              ownedCourses.push(normalizedOwnedCourse);
            }
          }
        }

        return ownedCourses;
      }
    );

    const empty = isEmpty(data);
    const lookup =
      data?.reduce((a, c) => {
        a[c.id] = c;
        return a;
      }, {}) ?? {};

    return {
      ownedCourses: {
        data,
        mutate,
        hasInitialResponse: data || error,
        isValidating,
        isEmpty: empty,
        lookup: lookup,
      },
    };
  };
