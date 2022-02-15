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
import { withToast } from "@utils/toast";

type PurchaseProps = { hexCourseID: string; proof: string; value: string };
type RepurchaseProps = { courseHash: string; value: string };

const Marketplace = ({ courses }: { courses: CourseType[] }) => {
  const [selectedCourse, setSelectedCourse] = useState<CourseType | null>(null);
  const [busyCourseID, setBusyCourseID] = useState("");
  const [isNewPurchase, setIsNewPurchase] = useState(true);

  const { web3, contract, requireInstall } = useWeb3();
  const { hasConnectedWallet, isConnecting, account } = useWalletInfo();
  const { ownedCourses } = useOwnedCourses(courses, account.data);

  const purchaseCourse = async (order: OrderType, course: CourseType) => {
    const hexCourseID = web3?.utils.utf8ToHex(course.id);
    const address = account.data;
    const emailHash = web3?.utils.sha3(order.email);
    let proof;

    if (hexCourseID && address && emailHash) {
      const value = web3?.utils.toWei(order.price);
      setBusyCourseID(course.id);

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
        proof &&
          value &&
          withToast(_purchaseCourse({ hexCourseID, proof, value }, course));
      } else {
        orderHash &&
          value &&
          withToast(
            _repurchaseCourse({ courseHash: orderHash, value }, course)
          );
      }
    }
  };

  const _purchaseCourse = async (
    { hexCourseID, proof, value }: PurchaseProps,
    course: CourseType
  ) => {
    try {
      const result = await contract.methods
        .purchaseCourse(hexCourseID, proof)
        .send({ from: account.data, value });

      ownedCourses.data &&
        ownedCourses.mutate([
          ...ownedCourses.data,
          {
            ...course,
            proof,
            state: "purchased",
            owner: account.data,
            price: value,
          },
        ]);

      return result;
    } catch (error: any) {
      throw new Error(error.message);
    } finally {
      setBusyCourseID("");
    }
  };

  const _repurchaseCourse = async (
    { courseHash, value }: RepurchaseProps,
    course: CourseType
  ) => {
    try {
      const result = await contract.methods
        .repurchaseCourse(courseHash)
        .send({ from: account.data, value });

      const index = ownedCourses.data?.findIndex((c) => c.id == course.id);
      if (index && ownedCourses.data && index >= 0) {
        ownedCourses.data[index].state = "purchased";
        ownedCourses.mutate(ownedCourses.data);
      } else {
        ownedCourses.mutate();
      }

      return result;
    } catch (error: any) {
      throw new Error(error.message);
    } finally {
      setBusyCourseID("");
    }
  };

  const cleanupModal = () => {
    setSelectedCourse(null);
    setIsNewPurchase(true);
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
                  return (
                    <Button variant="white" disabled={true} sizeClass="sm">
                      {hasConnectedWallet ? "Loading State..." : "Connect"}
                    </Button>
                  );
                }

                const isBusy = busyCourseID === course.id;

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
                              disabled={isBusy}
                              onClick={() => {
                                setIsNewPurchase(false);
                                setSelectedCourse(course);
                              }}
                              variant="purple"
                              sizeClass="sm"
                            >
                              {isBusy ? (
                                <div className="flex">
                                  <Loader size="sm" />
                                  <div className="ml-2">In Progress</div>
                                </div>
                              ) : (
                                <div>Fund to Activate</div>
                              )}
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
                    disabled={!hasConnectedWallet || isBusy}
                    variant="lightPurple"
                    sizeClass="sm"
                  >
                    {isBusy ? (
                      <div className="flex">
                        <Loader size="sm" />
                        <div className="ml-2">In Progress</div>
                      </div>
                    ) : (
                      <div>Purchase</div>
                    )}
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
        onSubmit={(formData, course) => {
          purchaseCourse(formData, course);
          cleanupModal();
        }}
        onClose={cleanupModal}
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
