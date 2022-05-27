import CsvValidator from "./core";
import { validateCourse } from "models";

export class CourseCsvValidator extends CsvValidator {
  static HEADER_BY_FIELD = {
    courseId: "CourseId",
    courseTitle: "CourseTitle",
    durationInSeconds: "DurationInSeconds",
    releaseDate: "ReleaseDate",
    description: "Description",
    assessmentStatus: "AssessmentStatus",
    isCourseRetired: "IsCourseRetired",
  };

  static validate(row) {
    return validateCourse(row);
  }
}
