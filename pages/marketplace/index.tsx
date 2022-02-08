import { Button } from "@components/ui/common";
import { CourseCard, CourseList } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import OrderModal from "@components/ui/order/modal";
import { getAllCourses } from "@content/courses/fetcher";
import { useState } from "react";
import { CourseType } from "types/content";
import { useWalletInfo } from "@components/hooks/useWalletInfo";
import { MarketHeader } from "@components/ui/marketplace";
import { OrderType } from "types/common";
import { useWeb3 } from "@components/providers";

const Marketplace = ({ courses }: { courses: CourseType[] }) => {
  const [selectedCourse, setSelectedCourse] = useState<CourseType | null>(null);

  const { web3, contract } = useWeb3();
  const { canPurchaseCourse, account } = useWalletInfo();

  const purchaseCourse = async (order: OrderType) => {
    const hexCourseID = web3?.utils.utf8ToHex(selectedCourse!.id);
    const address = account.data;
    const emailHash = web3?.utils.sha3(order.email);
    let proof;

    if (hexCourseID && address && emailHash) {
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

      proof =
        orderHash &&
        web3?.utils.soliditySha3(
          {
            type: "bytes32",
            value: emailHash,
          },
          {
            type: "bytes32",
            value: orderHash,
          }
        );
    }

    const value = web3?.utils.toWei(order.price);
    try {
      await contract.methods
        .purchaseCourse(hexCourseID, proof)
        .send({ from: account.data, value });
    } catch {
      console.error("Purchase error: Operation has failed.");
    }
  };

  return (
    <>
      <MarketHeader />
      <CourseList courses={courses}>
        {(course: CourseType) => (
          <CourseCard
            key={course.id}
            course={course}
            disabled={!canPurchaseCourse}
            Footer={() => (
              <div className="mt-4">
                <Button
                  onClick={() => setSelectedCourse(course)}
                  disabled={!canPurchaseCourse}
                  variant="lightPurple"
                >
                  Purchase
                </Button>
              </div>
            )}
          />
        )}
      </CourseList>
      <OrderModal
        course={selectedCourse}
        onSubmit={purchaseCourse}
        onClose={() => setSelectedCourse(null)}
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
