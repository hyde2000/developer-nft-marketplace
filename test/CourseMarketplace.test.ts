const CourseMarketplace = artifacts.require("CourseMarketplace");

contract("CourseMarketplace", (accounts) => {
  const courseID = "0x00000000000000000000000000003130";
  const proof =
    "0x0000000000000000000000000000313000000000000000000000000000003130";
  const value = "900000000";
  const owner = accounts[0];
  const buyer = accounts[1];
  let index = 0;

  describe("Purchase the new course", () => {
    it("Success: can get the purchased course hash by index", async () => {
      const _contract = await CourseMarketplace.deployed();

      await _contract.purchaseCourse(courseID, proof, { from: buyer, value });

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

    it("Fail: not allowed to purchase already owned course", async () => {
      const _contract = await CourseMarketplace.deployed();
      try {
        await _contract.purchaseCourse(courseID, proof, { from: buyer, value });
        expect.fail("repurchase should have declined");
      } catch (err) {}
    });

    it("Success: should match the data of the course purchased by buyer", async () => {
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

  describe("Activate the purchased course", () => {
    it("Success: should have 'actived' state", async () => {
      const _contract = await CourseMarketplace.deployed();
      const courseHash = await _contract.getCourseHashAtIndex(index);

      await _contract.activateCourse(courseHash, { from: owner });

      const course = await _contract.getCourseByHash(courseHash);
      const expectedState = 1;

      assert.equal(
        Number(course.state),
        expectedState,
        "Course state sould be 'activated'"
      );
    });

    it("Fail: should onlyOwner modifier works", async () => {
      const _contract = await CourseMarketplace.deployed();
      const courseHash = await _contract.getCourseHashAtIndex(index);

      try {
        await _contract.activateCourse(courseHash, { from: buyer });
        expect.fail("onlyOwner should have worked");
      } catch (err) {}
    });
  });

  describe("Transfer ownership", () => {
    it("Success: should return deployer address", async () => {
      const _contract = await CourseMarketplace.deployed();
      const currentOwner = await _contract.getContractOwner();

      assert.equal(owner, currentOwner, "Contract owner is not matching");
    });

    it("Fail: contract owner is wrong", async () => {
      const _contract = await CourseMarketplace.deployed();

      try {
        await _contract.transferOwnership(accounts[3], { from: accounts[4] });
        expect.fail("onlyOwner should have worked");
      } catch (err) {}
    });

    it("Success: should transfer ownership to 2nd address", async () => {
      const _contract = await CourseMarketplace.deployed();
      const currentOwner = await _contract.getContractOwner();

      await _contract.transferOwnership(accounts[2], { from: currentOwner });

      const owner = await _contract.getContractOwner();
      assert.equal(
        owner,
        accounts[2],
        "Contract owner is not the second account"
      );
    });
  });
});
