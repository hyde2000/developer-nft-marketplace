import { useAccount } from "@components/hooks/useAccount";
import { useOwnedCourse } from "@components/hooks/useOwnedCourse";
import { Modal } from "@components/ui/common";
import { Curriculum, KeyPoints, CourseHero } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { getAllCourses } from "@content/courses/fetcher";
import { CourseType } from "types/content";

const Course = ({ course }: { course: CourseType }) => {
  const { account } = useAccount();
  const { ownedCourse } = useOwnedCourse(course, account.data);

  return (
    <>
      <div className="py-4">
        <CourseHero
          title={course.title}
          description={course.description}
          imageUrl={course.coverImage}
        />
      </div>
      <KeyPoints points={course.wsl} />
      <Curriculum locked={true} />
      <Modal isOpen={false}>
        <div className=""></div>
      </Modal>
    </>
  );
};

export const getStaticPaths = () => {
  const { data } = getAllCourses();

  return {
    paths: data.map((c) => ({
      params: {
        slug: c.slug,
      },
    })),
    fallback: false,
  };
};

// FIXME
export const getStaticProps = ({ params }: any) => {
  const { data } = getAllCourses();
  const course = data.filter((c) => c.slug === params.slug)[0];

  return {
    props: {
      course,
    },
  };
};

Course.Layout = BaseLayout;
export default Course;
