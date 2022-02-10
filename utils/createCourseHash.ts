import Web3 from "web3";

export const createCourseHash =
  (web3: Web3 | null) => (courseID: string, account?: string) => {
    const hexCourseID = web3?.utils.utf8ToHex(courseID);
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

      return courseHash;
    }
  };
