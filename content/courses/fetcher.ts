import courses from "./index.json";

export const getAllCourses = () => {
  return {
    data: courses,
    courseMap: courses.reduce((acc: any, c, i) => {
      acc[c.id] = c;
      acc[c.id].index = i;
      return acc;
    }, {}),
  };
};
