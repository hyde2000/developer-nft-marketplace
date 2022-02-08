import { Hero } from "@components/ui/common";
import { CourseCard, CourseList } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { CourseType } from "../types/content";
import { getAllCourses } from "@content/courses/fetcher";

type Props = {
  courses: CourseType[];
};

const Home = ({ courses }: Props) => {
  return (
    <>
      <Hero />
      <CourseList courses={courses}>
        {(course: CourseType) => <CourseCard key={course.id} course={course} />}
      </CourseList>
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

Home.Layout = BaseLayout;
export default Home;
