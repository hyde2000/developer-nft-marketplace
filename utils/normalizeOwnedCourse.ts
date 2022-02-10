import Web3 from "web3";

import { OwnedCourseType } from "types/common";
import { CourseType } from "types/content";

export const COURSE_STATES: { [key: number]: string } = {
  0: "purchased",
  1: "activated",
  2: "deactivated",
};

export const normalizeOwnedCourse =
  (web3: Web3 | null) =>
  (params: any, ownedCourse: OwnedCourseType) => {
    return {
      ...params,
      ownedCourseID: ownedCourse.id,
      proof: ownedCourse.proof,
      price: web3?.utils.fromWei(ownedCourse.price),
      state: COURSE_STATES[ownedCourse.state],
    };
  };
