import * as ClassDto from "./class.dto";
import subjectSchema from "./subject.schema";
import classSchema from "./class.schema";
import createHttpError from "http-errors";
import sectionSchema from "./section.schema";
import classTimetableSchema from "./class.timetable.schema";
import * as Enum from "../common/constant/enum";
import mongoose, { PipelineStage } from "mongoose";

export const isClassAlreadyExists = async (name: string, session: string) => {
  const existingClass = await classSchema.findOne({ name, session, deleted: false });
  return !!existingClass;
};

export const isClassAndSectionValid = async (sessionId: string, classId: string, sectionId?: string) => {
  const result = await classSchema.findOne({ _id: classId, session: sessionId, deleted: false });
  if (!result) {
    return false;
  }
  if (sectionId) {
    const section = result.sections.find((sec) => {
      return sec.toString() === sectionId
    });
    return !!section;
  }
  return true;
};

export const assignFaculty = async (sectionId: string, facultyId: string) => {
  const section = await sectionSchema.findById(sectionId);

  if (!section) {
    throw createHttpError(404, "Section not found");
  }

  if (section.classTeacher && section.classTeacher.toString() === facultyId) {
    throw createHttpError(400, "This faculty is already assigned to this Class - section");
  }

  if (section.classTeacher) {
    throw createHttpError(400, "This section already has an assigned faculty");
  }
  const result = await sectionSchema.findByIdAndUpdate(
    sectionId,
    { classTeacher: facultyId },
    { new: true }
  );

  return result;
};

export const removeAssignedTeacher = async (sectionId: string) => {
  const section = await sectionSchema.findById(sectionId);

  if (!section) {
    throw createHttpError(404, "Section not found");
  }
  if (!section.classTeacher) {
    throw createHttpError(400, "This section doesn't have an assigned teacher");
  }
  const result = await sectionSchema.findByIdAndUpdate(
    sectionId,
    { $unset: { classTeacher: 1 } },
    { new: true }
  );

  return result;
};

export const createClass = async (data: ClassDto.ICreateClass) => {
  const { subjects: subjectInputs = [], sections: sectionInputs = [], ...classData } = data;

  let subjectIds: string[] = [];
  if (subjectInputs.length > 0) {
    const createdSubjects = await subjectSchema.insertMany(subjectInputs);
    if (!createdSubjects || createdSubjects.length !== subjectInputs.length) {
      throw createHttpError(400, "Failed to create some or all subjects");
    }
    subjectIds = createdSubjects.map((subject) => subject._id);
  }

  const createdSections = await sectionSchema.insertMany(sectionInputs);
  if (!createdSections || createdSections.length !== sectionInputs.length) {
    throw createHttpError(500, "Failed to create some or all sections");
  }
  const sectionIds = createdSections.map((section) => section._id);

  const newClass = await classSchema.create({
    ...classData,
    subjects: subjectIds,
    sections: sectionIds
  });

  if (!newClass) {
    throw createHttpError(500, "Failed to create class");
  }

  return newClass;
};

export const getAllClass = async (sessionId: string) => {
  const classOrder = Object.values(Enum.ClassName);

  const pipeline: PipelineStage[] = [
    {
      $match: {
        session: new mongoose.Types.ObjectId(sessionId),
        deleted: false
      }
    },
    {
      $lookup: {
        from: "sessions",
        localField: "session",
        foreignField: "_id",
        as: "sessionDetails",
        pipeline: [
          {
            $project: {
              _id: 1,
              session: 1
            }
          }
        ]
      }
    },
    {
      $unwind: { path: "$sessionDetails", preserveNullAndEmptyArrays: true }
    },
    {
      $lookup: {
        from: "subjects",
        localField: "subjects",
        foreignField: "_id",
        as: "subjectDetails",
        pipeline: [
          {
            $match: { deleted: false }
          },
          {
            $project: {
              _id: 1,
              name: 1,
              publication: 1,
              writer: 1,
              ISBN: 1,
              subjectType: 1,
              subjectCategory: 1
            }
          }
        ]
      }
    },
    {
      $lookup: {
        from: "sections",
        localField: "sections",
        foreignField: "_id",
        as: "sectionDetails",
        pipeline: [
          {
            $match: { deleted: false }
          },
          {
            $lookup: {
              from: "users",
              localField: "classTeacher",
              foreignField: "_id",
              as: "facultyDetails"
            }
          },
          {
            $unwind: { path: "$facultyDetails", preserveNullAndEmptyArrays: true }
          },
          {
            $project: {
              _id: 1,
              name: 1,
              capacity: 1,
              classTeacher: {
                _id: "$facultyDetails._id",
                name: "$facultyDetails.name"
              }
            }
          },
          {
            $sort: {
              name: 1
            }
          }
        ]
      }
    },
    {
      $addFields: {
        sortOrder: {
          $indexOfArray: [classOrder, "$name"]
        }
      }
    },
    {
      $sort: {
        sortOrder: 1
      }
    },
    {
      $group: {
        _id: "$_id",
        name: { $first: "$name" },
        session: { $first: "$sessionDetails" },
        courseStream: { $first: "$courseStream" },
        feeStructure: { $first: "$feeStructure" },
        subjectDetails: { $first: "$subjectDetails" },
        sectionDetails: { $first: "$sectionDetails" }
      }
    },
    {
      $project: {
        _id: 1,
        name: 1,
        session: {
          _id: "$session._id",
          name: "$session.session"
        },
        courseStream: 1,
        feeStructure: 1,
        subjects: "$subjectDetails",
        sections: "$sectionDetails"
      }
    }
  ];

  const classes = await classSchema.aggregate(pipeline);

  if (!classes || classes.length === 0) {
    return { classes: [] };
  }

  return { classes };
};

export const getClassById = async (classId: string) => {
  const pipeline: PipelineStage[] = [
    {
      $match: {
        _id: new mongoose.Types.ObjectId(classId),
        deleted: false
      }
    },
    {
      $lookup: {
        from: "sessions",
        localField: "session",
        foreignField: "_id",
        as: "sessionDetails",
        pipeline: [
          {
            $match: { deleted: false }
          },
          {
            $project: {
              _id: 1,
              session: 1
            }
          }
        ]
      }
    },
    {
      $unwind: { path: "$sessionDetails", preserveNullAndEmptyArrays: true }
    },
    {
      $lookup: {
        from: "subjects",
        localField: "subjects",
        foreignField: "_id",
        as: "subjectDetails",
        pipeline: [
          {
            $match: { deleted: false }
          },
          {
            $project: {
              _id: 1,
              name: 1,
              publication: 1,
              writer: 1,
              ISBN: 1,
              subjectType: 1,
              subjectCategory: 1
            }
          }
        ]
      }
    },
    {
      $lookup: {
        from: "sections",
        localField: "sections",
        foreignField: "_id",
        as: "sectionDetails",
        pipeline: [
          {
            $match: { deleted: false }
          },
          {
            $lookup: {
              from: "users",
              localField: "classTeacher",
              foreignField: "_id",
              as: "facultyDetails",
              pipeline: [
                {
                  $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails"
                  }
                },
                {
                  $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true }
                },
                {
                  $project: {
                    _id: 1,
                    employeeId: 1,
                    name: 1,
                    designation: 1,
                    status: 1,
                    profilePic: "$userDetails.profilePic"
                  }
                }
              ]
            }
          },
          {
            $unwind: { path: "$facultyDetails", preserveNullAndEmptyArrays: true }
          },
          {
            $project: {
              _id: 1,
              name: 1,
              capacity: 1,
              classTeacher: {
                _id: "$facultyDetails._id",
                employeeId: "$facultyDetails.employeeId",
                name: "$facultyDetails.name",
                designation: "$facultyDetails.designation",
                status: "$facultyDetails.status",
                profilePic: "$facultyDetails.profilePic"
              }
            }
          },
          {
            $sort: {
              name: 1
            }
          }
        ]
      }
    },
    {
      $project: {
        _id: 1,
        name: 1,
        session: {
          _id: "$sessionDetails._id",
          name: "$sessionDetails.session"
        },
        courseStream: 1,
        feeStructure: 1,
        subjects: "$subjectDetails",
        sections: "$sectionDetails"
      }
    }
  ];

  const classes = await classSchema.aggregate(pipeline);

  if (!classes || classes.length === 0) {
    throw createHttpError(404, "Class not found");
  }

  return classes[0];
};

export const getAssignedFaculyIds = async (sessionId: mongoose.Types.ObjectId,
  day: Enum.WeekDay,
  startTime: { hour: number; minute: number },
  endTime: { hour: number; minute: number }
) => {
  const timeTable = await classTimetableSchema.find({
    session: sessionId,
    "weeklySchedule.day": day,
    "weeklySchedule.periods": {
      $elemMatch: {
        "timeSlot.start.hour": startTime.hour,
        "timeSlot.start.minute": startTime.minute,
        "timeSlot.end.hour": endTime.hour,
        "timeSlot.end.minute": endTime.minute,
        faculty: { $ne: null }
      }
    }
  });
  const assignedFacultyIds = new Set<string>();
  timeTable.forEach((timetable) => {
    timetable.weeklySchedule.forEach((schedule) => {
      if (schedule.day !== day) return;

      schedule.periods?.forEach((period) => {
        if (!period.faculty || !period.timeSlot) return;

        const periodStart = period.timeSlot.start.hour * 60 + period.timeSlot.start.minute;
        const periodEnd = period.timeSlot.end.hour * 60 + period.timeSlot.end.minute;

        const startTotalMinutes = startTime.hour * 60 + startTime.minute;
        const endTotalMinutes = endTime.hour * 60 + endTime.minute;

        const buffer = 5;
        const isOverlap = (startTotalMinutes - buffer) < periodEnd && periodStart < (endTotalMinutes + buffer);

        if (isOverlap && period.faculty) {
          assignedFacultyIds.add(String(period.faculty));
        }
      });
    });
  })
  return Array.from(assignedFacultyIds);

};

export const createTimeTable = async (timeTableData: ClassDto.ICreateTimeTable) => {
  const { session, section, class: classId, weeklySchedule } = timeTableData;

  const existingTimeTable = await classTimetableSchema.findOne({ session, section, class: classId });
  if (existingTimeTable) {
    throw createHttpError(400, "Time table already exists for this class and section");
  }

  const newTimeTable = await classTimetableSchema.create({
    session,
    section,
    class: classId,
    weeklySchedule
  });

  if (!newTimeTable) {
    throw createHttpError(500, "Failed to create time table");
  }

  return newTimeTable;
};

export const getTimeTableofClassById = async (timeTableId: string) => {
  const timeTable = await classTimetableSchema.findById(timeTableId)
    .populate("session", "session")
    .populate("class", "name")
    .populate("section", "name")
    .populate("weeklySchedule.periods.subject", "_id name publication writer ISBN subjectType subjectCategory")
    .populate("weeklySchedule.periods.faculty", "_id name");

  return timeTable;
};

export const getTimeTableBySectionId = async (sessionId: string, sectionId: string, classId: string) => {

  const timeTable = await classTimetableSchema.findOne({
    session: new mongoose.Types.ObjectId(sessionId),
    section: new mongoose.Types.ObjectId(sectionId),
    class: new mongoose.Types.ObjectId(classId)
  })
    .populate("session", "session")
    .populate("class", "name")
    .populate("section", "name")
    .populate("weeklySchedule.periods.subject", "_id name publication writer ISBN subjectType subjectCategory")
    .populate("weeklySchedule.periods.faculty", "_id name");

  return timeTable;
};