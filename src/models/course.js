import * as Yup from "yup";

export const CourseSchema = Yup.object({
  courseId: Yup.string().required(),
  courseTitle: Yup.string().required(),
  durationInSeconds: Yup.number().integer().min(0).required(),
  releaseDate: Yup.date().required(),
  description: Yup.string().nullable(),
  assessmentStatus: Yup.string().required(),
  isCourseRetired: Yup.boolean()
    .transform((value, originalValue) =>
      ["yes", "no"].includes(value) ? value === "yes" : value
    )
    .required(),
});

export function validateCourse(course) {
  return CourseSchema.validateSync(course, {
    abortEarly: false,
    stripUnknown: true,
  });
}
