import { NormalizedOwnedCourseType, OwnedCourseType } from "types/common";
import { CourseType } from "types/content";
import Web3 from "web3";

export const COURSE_STATES = {
  0: "purchased",
  1: "activated",
  2: "deactivated",
};

export const normalizeOwnedCourse =
  (web3: Web3 | null) =>
  (
    course: CourseType,
    ownedCourse: OwnedCourseType
  ): NormalizedOwnedCourseType => {
    return {
      ...course,
      ownedCourseID: ownedCourse.id,
      proof: ownedCourse.proof,
      price: web3?.utils.fromWei(ownedCourse.price),
      state: COURSE_STATES[ownedCourse.state],
    };
  };
