import { FC, useState } from "react";

import { CourseFilter, ManagedCourseCard } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";
import { Button, Message } from "@components/ui/common";
import { useManagedCourses } from "@components/hooks/useManagedCourses";
import { useWeb3 } from "@components/providers";
import { useAdmin } from "@components/hooks/useAdmin";
import { normalizeOwnedCourse } from "@utils/normalizeOwnedCourse";
import { NormalizedManagedCourseType } from "types/common";
import { withToast } from "@utils/toast";

type Props = {
  onVerify: (email: string) => void;
};

const VerificationInput: FC<Props> = ({ onVerify }) => {
  const [email, setEmail] = useState("");

  return (
    <div className="flex mr-2 relative rounded-md">
      <input
        value={email}
        onChange={({ target: { value } }) => setEmail(value)}
        type="text"
        name="account"
        id="account"
        className="w-96 focus:ring-indigo-500 shadow-md focus:border-indigo-500 block pl-7 p-4 sm:text-sm border-gray-300 rounded-md"
        placeholder="0x2341ab..."
      />
      <Button
        onClick={() => {
          onVerify(email);
        }}
      >
        Verify
      </Button>
    </div>
  );
};

const ManageCourses = () => {
  const [proofedOwnership, setProofedOwnership] = useState<{
    [hash: string]: boolean;
  }>({ hash: false });
  const [searchedCourse, setSearchedCourse] = useState(null);
  const [filters, setFilters] = useState<{ state: string }>({ state: "all" });

  const { web3, contract } = useWeb3();
  const { account } = useAdmin("/marketplace");
  const { managedCourses } = useManagedCourses(account);

  const verifyCourse = (
    email: string,
    { hash, proof }: { hash: string; proof: string }
  ) => {
    if (!email) {
      return;
    }

    const emailHash = web3?.utils.sha3(email);
    if (emailHash) {
      const proofToCheck = web3?.utils.soliditySha3(
        {
          type: "bytes32",
          value: emailHash,
        },
        {
          type: "bytes32",
          value: hash,
        }
      );

      proofToCheck === proof
        ? setProofedOwnership({ ...proofedOwnership, [hash]: true })
        : setProofedOwnership({ ...proofedOwnership, [hash]: false });
    }
  };

  const changeCourseState = async (courseHash: string, method: string) => {
    try {
      const result = await contract.methods[method](courseHash).send({
        from: account.data,
      });

      return result;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const activateCourse = async (courseHash: string) => {
    withToast(changeCourseState(courseHash, "activateCourse"));
  };

  const deactivateCourse = async (courseHash: string) => {
    withToast(changeCourseState(courseHash, "deactivateCourse"));
  };

  const searchCourse = async (courseHash: string) => {
    const re = /[0-9A-Fa-f]{6}/g;

    if (courseHash && courseHash.length === 66 && re.test(courseHash)) {
      const course = await contract.methods.getCourseByHash(courseHash).call();

      if (course.owner !== "0x0000000000000000000000000000000000000000") {
        const normalized = normalizeOwnedCourse(web3)(
          { hash: courseHash },
          course
        );
        setSearchedCourse(normalized);
        return;
      }
    }
    setSearchedCourse(null);
  };

  const renderCard = (
    course: NormalizedManagedCourseType,
    isSearched: boolean = false
  ) => {
    return (
      <ManagedCourseCard
        key={course.ownedCourseID}
        isSearched={isSearched}
        course={course}
      >
        <VerificationInput
          onVerify={(email) => {
            verifyCourse(email, {
              hash: course.hash,
              proof: course.proof,
            });
          }}
        />
        {proofedOwnership[course.hash] && (
          <div className="mt-2">
            <Message>Verified!</Message>
          </div>
        )}
        {proofedOwnership[course.hash] === false && (
          <div className="mt-2">
            <Message type="danger">Wrong Proof!</Message>
          </div>
        )}
        {course.state === "purchased" && (
          <div className="mt-2">
            <Button onClick={() => activateCourse(course.hash)} variant="green">
              Activate
            </Button>
            <Button onClick={() => deactivateCourse(course.hash)} variant="red">
              Deactivate
            </Button>
          </div>
        )}
      </ManagedCourseCard>
    );
  };

  const filteredCourses = managedCourses.data
    ?.filter((course) => {
      if (filters.state === "all") {
        return true;
      }

      return course.state === filters.state;
    })
    .map((course) => renderCard(course));

  if (!account.isAdmin) {
    return null;
  }

  return (
    <>
      <MarketHeader />
      <CourseFilter
        onSearchSubmit={searchCourse}
        onFilterSelect={(value: string) => setFilters({ state: value })}
      />
      <section className="grid grid-cols-1">
        {searchedCourse && (
          <div>
            <h1 className="text-2xl font-bold p-5">Search</h1>
            {renderCard(searchedCourse, true)}
          </div>
        )}
        <h1 className="text-2xl font-bold p-5">All Courses</h1>
        {filteredCourses}

        {filteredCourses?.length === 0 && (
          <Message type="warning">No courses to display</Message>
        )}
      </section>
    </>
  );
};

ManageCourses.Layout = BaseLayout;
export default ManageCourses;
