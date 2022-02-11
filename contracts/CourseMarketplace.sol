// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract CourseMarketplace {
    enum State {
        Purchased,
        Activated,
        Deactivated
    }

    struct Course {
        uint256 id;
        uint256 price;
        bytes32 proof;
        address owner;
        State state;
    }

    mapping(bytes32 => Course) private ownedCourses;
    mapping(uint256 => bytes32) private ownedCourseHash;

    uint256 private totalOwnedCourses;
    address payable private owner;

    modifier onlyOwner() {
        require(msg.sender == getContractOwner(), "Only owner has access");
        _;
    }

    constructor() {
        setContractOwner(msg.sender);
    }

    function purchaseCourse(bytes32 courseId, bytes32 proof)
        external
        payable
        returns (bytes32)
    {
        bytes32 courseHash = keccak256(abi.encodePacked(courseId, msg.sender));
        uint256 id = totalOwnedCourses++;

        require(
            !hasCourseOwnership(courseHash),
            "This course already has owner"
        );

        ownedCourseHash[id] = courseHash;
        ownedCourses[courseHash] = Course({
            id: id,
            price: msg.value,
            proof: proof,
            owner: msg.sender,
            state: State.Purchased
        });
        return courseHash;
    }

    function repurchaseCourse(bytes32 courseHash) external payable {
        require(isCourseCreated(courseHash), "Course is not created.");
        require(hasCourseOwnership(courseHash), "Course doesn't have owner");

        Course storage course = ownedCourses[courseHash];
        require(course.state == State.Deactivated);

        course.state = State.Purchased;
        course.price = msg.value;
    }

    function activateCourse(bytes32 courseHash) external onlyOwner {
        require(isCourseCreated(courseHash), "Course is not created.");
        Course storage course = ownedCourses[courseHash];

        require(course.state == State.Purchased, "Course not purchased yet.");
        course.state = State.Activated;
    }

    function deactivateCourse(bytes32 courseHash) external onlyOwner {
        require(isCourseCreated(courseHash), "Course is not created.");
        Course storage course = ownedCourses[courseHash];

        require(course.state == State.Purchased, "Course not purchased yet.");
        (bool success, ) = course.owner.call{value: course.price}("");
        require(success, "Transfer failed!");

        course.state = State.Deactivated;
        course.price = 0;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        setContractOwner(newOwner);
    }

    function getCourseCount() external view returns (uint256) {
        return totalOwnedCourses;
    }

    function getCourseHashAtIndex(uint32 index)
        external
        view
        returns (bytes32)
    {
        return ownedCourseHash[index];
    }

    function getCourseByHash(bytes32 courseHash)
        external
        view
        returns (Course memory)
    {
        return ownedCourses[courseHash];
    }

    function getContractOwner() public view returns (address) {
        return owner;
    }

    function setContractOwner(address newOwner) private {
        owner = payable(newOwner);
    }

    function isCourseCreated(bytes32 courseHash) private view returns (bool) {
        return
            ownedCourses[courseHash].owner !=
            0x0000000000000000000000000000000000000000;
    }

    function hasCourseOwnership(bytes32 courseHash)
        private
        view
        returns (bool)
    {
        return ownedCourses[courseHash].owner == msg.sender;
    }
}
