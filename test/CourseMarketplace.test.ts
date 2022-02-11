const CourseMarketplace = artifacts.require("CourseMarketplace");

contract("CourseMarketplace", (accounts) => {
  const courseID = "0x00000000000000000000000000003130";
  const proof =
    "0x0000000000000000000000000000313000000000000000000000000000003130";
  const value = "900000000";
  const buyer = accounts[1];

  describe("Purchase the new course", () => {
    it("can get the purchased course hash by index", async () => {
      const _contract = await CourseMarketplace.deployed();

      await _contract.purchaseCourse(courseID, proof, { from: buyer, value });

      const index = 0;
      const courseHash = await _contract.getCourseHashAtIndex(index);
      const expectedHash = web3.utils.soliditySha3(
        {
          type: "bytes32",
          value: courseID,
        },
        {
          type: "address",
          value: buyer,
        }
      );

      assert.equal(courseHash, expectedHash, "Course hash ins not");
    });

    it("should match the data of the course purchased by buyer", async () => {
      const index = 0;
      const _contract = await CourseMarketplace.deployed();
      const courseHash = await _contract.getCourseHashAtIndex(index);

      const expectedIndex = 0;
      const expectedState = 0;

      const course = await _contract.getCourseByHash(courseHash);

      assert.equal(
        Number(course.id),
        expectedIndex,
        "Course index should be 0!"
      );
      assert.equal(
        String(course.price),
        value,
        `Course price should be ${value}!`
      );
      assert.equal(course.proof, proof, `Course proof should be ${proof}!`);
      assert.equal(course.owner, buyer, `Course buyer should be ${buyer}!`);
      assert.equal(
        Number(course.state),
        expectedState,
        `Course state should be ${expectedState}!`
      );
    });
  });
});
