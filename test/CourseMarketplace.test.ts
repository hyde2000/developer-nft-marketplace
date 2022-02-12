const CourseMarketplace = artifacts.require("CourseMarketplace");

contract("CourseMarketplace", (accounts) => {
  const courseID = "0x00000000000000000000000000003130";
  const courseID2 = "0x00000000000000000000000000002130";
  const proof =
    "0x0000000000000000000000000000313000000000000000000000000000003130";
  const proof2 =
    "0x0000000000000000000000000000213000000000000000000000000000002130";
  const value = "900000000";
  const owner = accounts[0];
  const buyer = accounts[1];
  let index = 0;
  let index2 = 1;

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

    it("Success: should transfer ownership back to initial owner", async () => {
      const _contract = await CourseMarketplace.deployed();
      const currentOwner = await _contract.getContractOwner();

      await _contract.transferOwnership(accounts[0], { from: currentOwner });
      const owner = await _contract.getContractOwner();

      assert.equal(owner, accounts[0], "Contract owner is not set");
    });
  });

  describe("Deactivate course", () => {
    it("Success: deactivate course and set price = 0", async () => {
      const _contract = await CourseMarketplace.deployed();
      await _contract.purchaseCourse(courseID2, proof2, { from: buyer, value });
      const courseHash2 = await _contract.getCourseHashAtIndex(index2);

      await _contract.deactivateCourse(courseHash2, { from: owner });

      const course = await _contract.getCourseByHash(courseHash2);
      const expectedState = 2;
      const expectedPrice = 0;

      assert.equal(
        Number(course.state),
        expectedState,
        "Couse is not deactivated!"
      );
      assert.equal(
        Number(course.price),
        expectedPrice,
        "Course price is not 0"
      );
    });

    it("Fail: should not activate the deactivated course", async () => {
      const _contract = await CourseMarketplace.deployed();
      const currentOwner = await _contract.getContractOwner();

      const courseHash2 = await _contract.getCourseHashAtIndex(index2);
      try {
        await _contract.activateCourse(courseHash2, { from: currentOwner });
        expect.fail("should not activate the course");
      } catch (err) {}
    });

    it("Fail: should onlyOwner modifier works", async () => {
      const _contract = await CourseMarketplace.deployed();

      try {
        await _contract.transferOwnership(accounts[3], { from: accounts[4] });
        expect.fail("onlyOwner should have worked");
      } catch (err) {}
    });
  });

  describe("Repurchase course", () => {
    it("Success: should be able to repurchase with the original buyer", async () => {
      const _contract = await CourseMarketplace.deployed();
      const courseHash2 = await _contract.getCourseHashAtIndex(index2);

      await _contract.repurchaseCourse(courseHash2, { from: buyer, value });
      const course = await _contract.getCourseByHash(courseHash2);

      const exptectedState = 0;
      assert.equal(
        Number(course.state),
        exptectedState,
        "The course is not purchased"
      );
      assert.equal(
        String(course.price),
        value,
        `The course price is not ${value}`
      );
    });

    it("Fail: should not repurchase when the course doesn't exist", async () => {
      const dummyHash =
        "0x5ceb3f8075c3dbb5d490c8d1e6c950302ed065e1a9031750ad2c6513069e3fc3";

      const _contract = await CourseMarketplace.deployed();
      try {
        await _contract.repurchaseCourse(dummyHash, { from: buyer });
        expect.fail("course not found");
      } catch (err) {}
    });

    it("Fail: should onlyOwner modifier works", async () => {
      const _contract = await CourseMarketplace.deployed();
      const courseHash2 = await _contract.getCourseHashAtIndex(index2);

      try {
        await _contract.repurchaseCourse(courseHash2, {
          from: accounts[2],
          value,
        });
      } catch (err) {}
    });
  });
});
