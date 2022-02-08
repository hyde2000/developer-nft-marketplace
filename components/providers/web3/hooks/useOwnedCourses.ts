import useSWR from "swr";
import Web3 from "web3";

import { CourseType } from "types/content";
import { normalizeOwnedCourse } from "@utils/normalizeOwnedCourse";
import { NormalizedOwnedCourseType, OwnedCourseType } from "types/common";

export const ownedCoursesHandler =
  (web3: Web3 | null, contract: any) =>
  (courses: CourseType[], account?: string) => {
    const { data, isValidating, mutate } = useSWR(
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
            const courseHash = web3?.utils.soliditySha3(
              {
                type: "bytes32",
                value: hexCourseID,
              },
              {
                type: "address",
                value: account,
              }
            );

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

    return {
      ownedCourses: {
        data,
        mutate,
        isValidating,
      },
    };
  };