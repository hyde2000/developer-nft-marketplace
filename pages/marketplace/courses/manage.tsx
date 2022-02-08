import { CourseFilter, OwnedCourseCard } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { getAllCourses } from "@content/courses/fetcher";
import { MarketHeader } from "@components/ui/marketplace";
import { Button } from "@components/ui/common";

const ManageCourses = () => {
  return (
    <>
      <div className="py-4">
        <MarketHeader />
        <CourseFilter />
      </div>
      <section className="grid grid-cols-1">
        <OwnedCourseCard>
          <div className="flex mr-2 relative rounded-md">
            <input
              type="text"
              name="account"
              id="account"
              className="w-96 focus:ring-indigo-500 shadow-md focus:border-indigo-500 block pl-7 p-4 sm:text-sm border-gray-300 rounded-md"
              placeholder="0x2341ab..."
            />
            <Button>Verify</Button>
          </div>
        </OwnedCourseCard>
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

ManageCourses.Layout = BaseLayout;
export default ManageCourses;
