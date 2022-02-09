import { isEmpty } from "@components/hooks/isEmpty";
import { normalizeOwnedCourse } from "@utils/normalizeOwnedCourse";
import useSWR from "swr";
import { OwnedCourseType } from "types/common";
import { CourseType } from "types/content";
import Web3 from "web3";

export const ownedCourseHandler =
  (web3: Web3 | null, contract: any) =>
  (course: CourseType, account?: string) => {
    const { data, mutate, isValidating } = useSWR(
      () =>
        web3 && contract && account ? `web3/ownedCourse/${account}` : null,
      async () => {
        const hexCourseID = web3?.utils.utf8ToHex(course.id);
        console.log(account && hexCourseID);
        if (account && hexCourseID) {
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
            return normalizeOwnedCourse(web3)(course, ownedCourse);
          }
        }
      }
    );

    return {
      ownedCourse: {
        data,
        mutate,
        isValidating,
      },
    };
  };
