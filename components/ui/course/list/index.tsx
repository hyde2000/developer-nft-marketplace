import { FC } from "react";

import { CourseType } from "types/content";

type Props = {
  courses: CourseType[];
  children: any;
};

const List: FC<Props> = ({ courses, children }) => {
  return (
    <section className="grid md:grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
      {courses.map((course) => children(course))}
    </section>
  );
};

export default List;