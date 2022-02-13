import { useState } from "react";

import { Button, Loader } from "@components/ui/common";
import { CourseCard, CourseList } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import OrderModal from "@components/ui/order/modal";
import { getAllCourses } from "@content/courses/fetcher";
import { CourseType } from "types/content";
import { useWalletInfo } from "@components/hooks/useWalletInfo";
import { MarketHeader } from "@components/ui/marketplace";
import { OrderType } from "types/common";
import { useWeb3 } from "@components/providers";
import { useOwnedCourses } from "@components/hooks/useOwnedCourses";

const Marketplace = ({ courses }: { courses: CourseType[] }) => {
  const [selectedCourse, setSelectedCourse] = useState<CourseType | null>(null);
  const [isNewPurchase, setIsNewPurchase] = useState(true);

  const { web3, contract, requireInstall } = useWeb3();
  const { hasConnectedWallet, isConnecting, account } = useWalletInfo();
  const { ownedCourses } = useOwnedCourses(courses, account.data);

  const purchaseCourse = async (order: OrderType) => {
    const hexCourseID = web3?.utils.utf8ToHex(selectedCourse!.id);
    const address = account.data;
    const emailHash = web3?.utils.sha3(order.email);
    let proof;

    const _purchaseCourse = async (
      hexCourseID: string,
      proof: string,
      value: string
    ) => {
      try {
        await contract.methods
          .purchaseCourse(hexCourseID, proof)
          .send({ from: account.data, value });
      } catch {
        console.error("Purchase course: Operation has failed.");
      }
    };

    const _repurchaseCourse = async (courseHash: string, value: string) => {
      try {
        await contract.methods
          .repurchaseCourse(courseHash)
          .send({ from: account.data, value });
      } catch {
        console.error("Purchase course: Operation has failed.");
      }
    };

    if (hexCourseID && address && emailHash) {
      const value = web3?.utils.toWei(order.price);
      const orderHash = web3?.utils.soliditySha3(
        {
          type: "bytes32",
          value: hexCourseID,
        },
        {
          type: "address",
          value: address,
        }
      );

      if (orderHash && isNewPurchase) {
        proof = web3?.utils.soliditySha3(
          {
            type: "bytes32",
            value: emailHash,
          },
          {
            type: "bytes32",
            value: orderHash,
          }
        );
        proof && value && _purchaseCourse(hexCourseID, proof, value);
      } else {
        orderHash && value && _repurchaseCourse(orderHash, value);
      }
    }
  };

  return (
    <>
      <MarketHeader />
      <CourseList courses={courses}>
        {(course: CourseType) => {
          const owned = ownedCourses.lookup[course.id];
          return (
            <CourseCard
              key={course.id}
              course={course}
              state={owned?.state}
              disabled={!hasConnectedWallet}
              Footer={() => {
                if (requireInstall) {
                  return (
                    <Button
                      disabled={true}
                      variant="lightPurple"
                      sizeClass="sm"
                    >
                      Install
                    </Button>
                  );
                }

                if (isConnecting) {
                  return (
                    <Button
                      disabled={true}
                      variant="lightPurple"
                      sizeClass="sm"
                    >
                      <Loader size="sm" />
                    </Button>
                  );
                }

                if (!ownedCourses.hasInitialResponse) {
                  return <div style={{ height: "42px" }}></div>;
                }

                if (owned) {
                  return (
                    <>
                      <div className="flex">
                        <Button
                          onClick={() =>
                            alert("You are the owner of this course")
                          }
                          disabled={true}
                          variant="white"
                          sizeClass="sm"
                        >
                          You Own
                        </Button>
                        {owned.state === "deactivated" && (
                          <div className="ml-1">
                            <Button
                              disabled={false}
                              onClick={() => {
                                setIsNewPurchase(false);
                                setSelectedCourse(course);
                              }}
                              variant="purple"
                              sizeClass="sm"
                            >
                              Fund to Activate
                            </Button>
                          </div>
                        )}
                      </div>
                    </>
                  );
                }

                return (
                  <Button
                    onClick={() => setSelectedCourse(course)}
                    disabled={!hasConnectedWallet}
                    variant="lightPurple"
                    sizeClass="sm"
                  >
                    Purchase
                  </Button>
                );
              }}
            />
          );
        }}
      </CourseList>
      <OrderModal
        course={selectedCourse}
        isNewPurchase={isNewPurchase}
        onSubmit={purchaseCourse}
        onClose={() => {
          setSelectedCourse(null);
          setIsNewPurchase(true);
        }}
      />
    </>
  );
};

export const getStaticProps = () => {
  const { data } = getAllCourses();

  return {
    props: {
      courses: data,
    },
  };
};

Marketplace.Layout = BaseLayout;
export default Marketplace;
