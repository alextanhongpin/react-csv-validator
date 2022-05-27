import Joi from "joi";
import CsvValidator from "./core";

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

  static parse(row) {
    return {
      ...row,
      isCourseRetired: row.isCourseRetired === "yes",
    };
  }

  static SCHEMA = Joi.compile(
    Joi.object({
      courseId: Joi.string().required(),
      courseTitle: Joi.string().required(),
      durationInSeconds: Joi.number().integer().required().min(0),
      releaseDate: Joi.date().required(),
      //description: Joi.string().optional(),
      description: Joi.string().allow("").optional(),
      assessmentStatus: Joi.string(),
      isCourseRetired: Joi.boolean().required(),
    })
  );
}
