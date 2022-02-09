import { useRouter } from "next/router";

import { useAccount } from "@components/hooks/useAccount";
import { useOwnedCourses } from "@components/hooks/useOwnedCourses";
import { Button, Message } from "@components/ui/common";
import { OwnedCourseCard } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";
import { getAllCourses } from "@content/courses/fetcher";
import { CourseType } from "types/content";

type Props = {
  courses: CourseType[];
};

const OwnedCourses = ({ courses }: Props) => {
  const router = useRouter();

  const { account } = useAccount();
  const { ownedCourses } = useOwnedCourses(courses, account.data);

  return (
    <>
      <MarketHeader />
      <section className="grid grid-cols-1">
        {ownedCourses.data?.map((course) => (
          <OwnedCourseCard key={course.id} ownedCourse={course}>
            {/*<Message>My custom message!</Message> */}
            <Button onClick={() => router.push(`/courses/${course.slug}`)}>
              Watch the course
            </Button>
          </OwnedCourseCard>
        ))}
      </section>
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

OwnedCourses.Layout = BaseLayout;
export default OwnedCourses;
