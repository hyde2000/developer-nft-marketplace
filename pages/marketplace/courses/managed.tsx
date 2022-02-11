import { useState } from "react";

import { CourseFilter, ManagedCourseCard } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";
import { Button, Message } from "@components/ui/common";
import { useManagedCourses } from "@components/hooks/useManagedCourses";
import { useWeb3 } from "@components/providers";
import { useAdmin } from "@components/hooks/useAdmin";

const ManageCourses = () => {
  const [email, setEmail] = useState("");
  const [proofedOwnership, setProofedOwnership] = useState<{
    [hash: string]: boolean;
  }>({ hash: false });

  const { web3 } = useWeb3();
  const { account } = useAdmin("/marketplace");
  const { managedCourses } = useManagedCourses(account);

  const verifyCourse = (
    email: string,
    { hash, proof }: { hash: string; proof: string }
  ) => {
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
        ? setProofedOwnership({ [hash]: true })
        : setProofedOwnership({ [hash]: false });
    }
  };

  if (!account.isAdmin) {
    return null;
  }

  return (
    <>
      <MarketHeader />
      <CourseFilter />
      <section className="grid grid-cols-1">
        {managedCourses.data?.map((course) => (
          <ManagedCourseCard key={course.ownedCourseID} course={course}>
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
                  verifyCourse(email, {
                    hash: course.hash,
                    proof: course.proof,
                  });
                }}
              >
                Verify
              </Button>
            </div>
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
          </ManagedCourseCard>
        ))}
      </section>
    </>
  );
};

ManageCourses.Layout = BaseLayout;
export default ManageCourses;