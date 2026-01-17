import * as ClassDto from "./academic.dto";
import subjectSchema from "./subject.schema";
import classSchema from "./class.schema";
import createHttpError from "http-errors";
import sectionSchema from "./section.schema";
import classTimetableSchema from "./class.timetable.schema";
import * as Enum from "../common/utils/enum";
import mongoose, { PipelineStage } from "mongoose";
import * as AcademicUtils from "./academic.utils";
import * as AcademicDto from "./academic.dto";
import admissionSchema from "../student/admission.schema";
import classFeeStructureSchema from "./feeStructure.schema";


// subjects service functions
// need to remove
export const createSubject = async (data: ClassDto.ICreateSubject) => {
  const subjectId = await AcademicUtils.generateUniqueSubjectId(data.name);
  const newSubject = await subjectSchema.create({ ...data, subjectId });
  if (!newSubject) {
    throw createHttpError(500, "Failed to create subject");
  }
  return newSubject;
};

// will use this function
export const upsertSubjectBulk = async (subjects: Partial<ClassDto.ISubject>[]) => {
  const bulkOperations: any[] = [];
  const createdIds: any[] = [];
  const updatedIds: any[] = [];
  for (const subject of subjects) {
    if (subject._id) {
      updatedIds.push(subject._id);
      bulkOperations.push({
        updateOne: {
          filter: { _id: subject._id },
          update: {
            $set: {
              name: subject.name,
              classId: subject.classId,
              sessionId: subject.sessionId,
              subjectType: subject.subjectType,
              syllabus: subject.syllabus,
              books: subject.books || [],
            }
          }
        }
      });
    } else {
      const subjectId = await AcademicUtils.generateUniqueSubjectId(subject.name!);
      bulkOperations.push({
        insertOne: {
          document: {
            ...subject,
            subjectId
          }
        }
      });
    }
  }

  if (!bulkOperations.length) {
    throw createHttpError(400, "No subjects to upsert");
  }
  const writeResult = await subjectSchema.bulkWrite(bulkOperations);
  const insertedIds = Object.values(writeResult.insertedIds || {});
  createdIds.push(...insertedIds);
  const subjectsData = await subjectSchema.find({
    _id: { $in: [...createdIds, ...updatedIds] }
  });
  return subjectsData;
};

// will use this function
export const getSubjectsByClass = async ({
  classId,
  sessionId,
  subjectType
}: ClassDto.GetSubjectsByClassParams) => {

  const filter: any = {
    classId
  };

  if (sessionId) {
    filter.sessionId = sessionId;
  }

  if (subjectType) {
    filter.subjectType = subjectType;
  }

  const subjects = await subjectSchema
    .find(filter)
    .sort({ createdAt: 1 });

  if (!subjects.length) {
    return [];
  }
  return subjects;
};


// need to remove
export const editSubject = async (subjectId: string, data: Partial<ClassDto.ISubject>) => {
  const subject = await subjectSchema.findByIdAndUpdate(subjectId, data, { new: true });
  if (!subject) {
    throw createHttpError(404, "Subject not found");
  }
  return subject;
};

// need to remove
export const deleteSubject = async (subjectId: string) => {
  const subject = await subjectSchema.findByIdAndDelete(subjectId);
  if (!subject) throw createHttpError(404, "Subject not found");

  await classSchema.updateMany(
    { subjects: subjectId },
    { $pull: { subjects: subjectId } }
  );

  await classTimetableSchema.updateMany(
    { "weeklySchedule.periods.subject": subjectId },
    { $pull: { "weeklySchedule.$[].periods": { subject: subjectId } } }
  );

  return subject;
};

// need to remove
export const getAllSubjects = async (sessionId: string, page?: number, limit?: number, search?: string, classId?: string) => {
  const query: any = {};
  if (sessionId) {
    query.sessionId = sessionId;
  }
  if (classId) {
    const classDoc = await classSchema.findById(classId);
    if (!classDoc) {
      throw createHttpError(404, "Class not found");
    }
    // query._id = { $in: classDoc.subjects };
  }
  if (search) {
    query.name = { $regex: search, $options: "i" };
  }
  const subjects = await subjectSchema.find(query)
    .skip(page && limit ? (page - 1) * limit : 0)
    .limit(limit || 0);
  const total = await subjectSchema.countDocuments(query);
  return { subjects, totalDoc: total, currentPage: page || 1, totalPages: limit ? Math.ceil(total / limit) : 1 };
};

// section service functions
export const getSectionByUniqueId = async (sectionUniqueId: string) => {
  const sectionDoc = await sectionSchema.findOne({ sectionId: sectionUniqueId, deleted: false });
  if (!sectionDoc) {
    throw createHttpError(404, "Section not found");
  }
  return sectionDoc;
};

export const createSection = async (data: ClassDto.ICreateSection) => {
  const classDoc = await classSchema.findById(data.classId);
  if (!classDoc) {
    throw createHttpError(404, "Class not found");
  }
  const sectionId = await AcademicUtils.generateSectionId(classDoc.name, data.name);
  const newSection = await sectionSchema.create({ ...data, sectionId });
  if (!newSection) {
    throw createHttpError(500, "Failed to create section");
  }
  return newSection;
};

export const editSection = async (sectionId: string, data: Partial<ClassDto.ISection>) => {
  const section = await sectionSchema.findByIdAndUpdate(sectionId, data, { new: true });
  if (!section) {
    throw createHttpError(404, "Section not found");
  }
  return section;
};

export const deleteSection = async (sectionId: string) => {
  const section = await sectionSchema.findById(sectionId);
  if (!section) throw createHttpError(404, "Section not found");

  const activeAdmissions = await admissionSchema.findOne({
    section: sectionId,
    session: section.sessionId,
    deleted: false,
  });

  if (activeAdmissions) {
    throw createHttpError(
      400,
      "Cannot delete section: active student admissions exist in this section"
    );
  }
  await sectionSchema.findByIdAndDelete(sectionId);
  await classTimetableSchema.deleteMany({ section: sectionId });
  return section;
};

export const getAllSections = async (sessionId: string, classId?: string) => {
  const query: any = {};
  if (sessionId) query.sessionId = sessionId;
  if (classId) query.classId = classId;

  const sections = await sectionSchema.find(query).lean();

  const result = await Promise.all(
    sections.map(async (sec) => {
      const classDoc = await classSchema.findById(sec.classId).select("_id classId name").lean();
      const totalAdmissions = await admissionSchema.countDocuments({
        section: sec._id,
        session: sec.sessionId,
        admissionStatus: "ACTIVE",
        deleted: false,
      });

      return {
        ...sec,
        class: classDoc ? { id: classDoc.classId, name: classDoc.name } : null,
        totalAdmissions,
        classTeacher: sec.classTeacher || null,
      };
    })
  );

  return { sections: result };
};

// class service functions
export const getClassByUniqueId = async (classUniqueId: string) => {
  const classDoc = await classSchema.findOne({ classId: classUniqueId, deleted: false });
  if (!classDoc) {
    throw createHttpError(404, "Class not found");
  }
  return classDoc;
};

export const createClass = async (data: Partial<ClassDto.IClass>) => {
  const result = await classSchema.create(data);
  if (!result) {
    throw createHttpError(500, "Failed to create class");
  }
  return result;
};

export const updateClass = async (classId: string, data: Partial<ClassDto.IClass>) => {
  const classDoc = await classSchema.findByIdAndUpdate(classId, data, { new: true });
  if (!classDoc) {
    throw createHttpError(404, "Class not found");
  }
  return classDoc;
};

export const addClassFeeStructure = async (classId: string, data: ClassDto.ICreateClassFeeStructure) => {
  const classDoc = await classSchema.findById(classId);
  if (!classDoc) {
    throw createHttpError(404, "Class Not found");
  }
  const result = await classFeeStructureSchema.create({ ...data, session: classDoc.session, classId });
  if (!result) {
    throw createHttpError(500, "Something went wrong, try again");
  }
  return result;
};

export const updateClassFeeStructure = async (classId: string, data: Partial<ClassDto.IClassFeeStructure>) => {
  const classDoc = await classSchema.findById(classId);
  if (!classDoc) {
    throw createHttpError(404, "Class Not found");
  }
  const result = await classFeeStructureSchema.findOneAndUpdate({ classId }, data, { new: true });
  if (!result) {
    throw createHttpError(500, "Something went wrong, try again");
  }
  return result;
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
          { $project: { _id: 1, session: 1 } }
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
          { $match: { deleted: false } },
          {
            $project: {
              _id: 0,
              name: 1
            }
          }
        ]
      }
    },
    {
      $addFields: {
        subjectsCount: { $size: "$subjectDetails" },
        subjects: {
          $map: {
            input: "$subjectDetails",
            as: "sub",
            in: "$$sub.name"
          }
        }
      }
    },
    {
      $lookup: {
        from: "sections",
        localField: "sections",
        foreignField: "_id",
        as: "sectionDetails",
        pipeline: [
          { $match: { deleted: false } },
          { $count: "totalSections" }
        ]
      }
    },
    {
      $addFields: {
        sectionsCount: {
          $ifNull: [{ $arrayElemAt: ["$sectionDetails.totalSections", 0] }, 0]
        }
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
      $lookup: {
        from: "classfeestructures",
        let: { classId: "$_id", sessionId: "$session" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$classId", "$$classId"] },
                  { $eq: ["$session", "$$sessionId"] },
                  { $eq: ["$status", Enum.ActiveStatus.ACTIVE] }
                ]
              }
            }
          },
          { $limit: 1 }
        ],
        as: "feeStructure"
      }
    },
    {
      $addFields: {
        feeStructureAdded: {
          $gt: [{ $size: "$feeStructure" }, 0]
        }
      }
    },
    {
      $lookup: {
        from: "timetables",
        let: { classId: "$_id", sessionId: "$session" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$class", "$$classId"] },
                  { $eq: ["$session", "$$sessionId"] },
                  { $eq: ["$status", Enum.TimeTableStatus.ACTIVE] }
                ]
              }
            }
          },
          { $limit: 1 }
        ],
        as: "timetable"
      }
    },
    {
      $addFields: {
        isTimetableCreated: {
          $gt: [{ $size: "$timetable" }, 0]
        }
      }
    },
    { $sort: { sortOrder: 1 } },
    {
      $project: {
        _id: 1,
        name: 1,
        classId: 1,
        courseStream: 1,
        session: {
          _id: "$sessionDetails._id",
          name: "$sessionDetails.session"
        },
        subjectsCount: 1,
        sectionsCount: 1,
        feeStructureAdded: 1,
        isTimetableCreated: 1
      }
    }
  ];
  const classes = await classSchema.aggregate(pipeline);
  return { classes: classes || [] };
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
          { $project: { _id: 1, session: 1 } }
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
          { $match: { deleted: false } },
          { $count: "totalSubjects" }
        ]
      }
    },
    {
      $addFields: {
        subjectsCount: {
          $ifNull: [{ $arrayElemAt: ["$subjectDetails.totalSubjects", 0] }, 0]
        }
      }
    },
    {
      $lookup: {
        from: "sections",
        localField: "sections",
        foreignField: "_id",
        as: "sectionDetails",
        pipeline: [
          { $match: { deleted: false } },
          { $count: "totalSections" }
        ]
      }
    },
    {
      $addFields: {
        sectionsCount: {
          $ifNull: [{ $arrayElemAt: ["$sectionDetails.totalSections", 0] }, 0]
        }
      }
    },
    {
      $project: {
        _id: 1,
        name: 1,
        classId: 1,
        courseStream: 1,
        session: {
          _id: "$sessionDetails._id",
          name: "$sessionDetails.session"
        },
        subjectsCount: 1,
        sectionsCount: 1
      }
    }
  ];
  const classes = await classSchema.aggregate(pipeline);
  if (!classes || classes.length === 0) {
    throw createHttpError(404, "Class not found");
  }
  return classes[0];
};

export const getClassFeeStructure = async (classId: string) => {
  const result = await classFeeStructureSchema.findOne({ classId, status: Enum.ActiveStatus.ACTIVE });
  return result;
};

// -------- Timetable service functions ---------
export const createTimeTable = async (sessionId: string, classId: string, sectionId: string, timeTableData: AcademicDto.IDaySchedule) => {

  const existingTimeTable = await classTimetableSchema.findOne({
    session: sessionId,
    class: classId,
    section: sectionId,
    status: {
      $in: [
        Enum.TimeTableStatus.ACTIVE,
        Enum.TimeTableStatus.DRAFT
      ]
    }
  });

  if (existingTimeTable) {
    throw createHttpError(400, "Time table already exists for this class and section");
  }

  const newTimeTable = await classTimetableSchema.create({
    session: sessionId,
    section: sectionId,
    class: classId,
    weeklySchedule: [timeTableData],
    status: Enum.TimeTableStatus.DRAFT,
    effectiveFrom: new Date()
  });

  if (!newTimeTable) {
    throw createHttpError(500, "Failed to create time table");
  }

  return newTimeTable;
};

export const updateTimeTable = async (
  sessionId: string,
  classId: string,
  sectionId: string,
  timeTableData: AcademicDto.IDaySchedule
) => {

  const existingTimeTable = await classTimetableSchema.findOne({
    session: sessionId,
    class: classId,
    section: sectionId,
    status: Enum.TimeTableStatus.DRAFT
  });

  if (!existingTimeTable) {
    throw createHttpError(404, "No draft timetable found to update");
  }

  const dayOrder: Record<Enum.WeekDay, number> = {
    [Enum.WeekDay.MONDAY]: 0,
    [Enum.WeekDay.TUESDAY]: 1,
    [Enum.WeekDay.WEDNESDAY]: 2,
    [Enum.WeekDay.THURSDAY]: 3,
    [Enum.WeekDay.FRIDAY]: 4,
    [Enum.WeekDay.SATURDAY]: 5,
    [Enum.WeekDay.SUNDAY]: 6
  };

  const dayIndex = existingTimeTable.weeklySchedule.findIndex(
    (d: any) => d.day === timeTableData.day
  );

  if (dayIndex >= 0) {
    existingTimeTable.weeklySchedule[dayIndex] = timeTableData;
  } else {
    existingTimeTable.weeklySchedule.push(timeTableData);
  }

  existingTimeTable.weeklySchedule.sort((a: any, b: any) => {
    return dayOrder[a.day as Enum.WeekDay] - dayOrder[b.day as Enum.WeekDay];
  });

  const updated = await existingTimeTable.save();

  if (!updated) {
    throw createHttpError(500, "Failed to update timetable");
  }
  return updated;
};


// old class service functions


// export const getAssignedFaculyIds = async (sessionId: mongoose.Types.ObjectId,
//   day: Enum.WeekDay,
//   startTime: { hour: number; minute: number },
//   endTime: { hour: number; minute: number }
// ) => {
//   const timeTable = await classTimetableSchema.find({
//     session: sessionId,
//     "weeklySchedule.day": day,
//     "weeklySchedule.periods": {
//       $elemMatch: {
//         "timeSlot.start.hour": startTime.hour,
//         "timeSlot.start.minute": startTime.minute,
//         "timeSlot.end.hour": endTime.hour,
//         "timeSlot.end.minute": endTime.minute,
//         faculty: { $ne: null }
//       }
//     }
//   });
//   const assignedFacultyIds = new Set<string>();
//   timeTable.forEach((timetable) => {
//     timetable.weeklySchedule.forEach((schedule) => {
//       if (schedule.day !== day) return;

//       schedule.periods?.forEach((period) => {
//         if (!period.faculty || !period.timeSlot) return;

//         const periodStart = period.timeSlot.start.hour * 60 + period.timeSlot.start.minute;
//         const periodEnd = period.timeSlot.end.hour * 60 + period.timeSlot.end.minute;

//         const startTotalMinutes = startTime.hour * 60 + startTime.minute;
//         const endTotalMinutes = endTime.hour * 60 + endTime.minute;

//         const buffer = 5;
//         const isOverlap = (startTotalMinutes - buffer) < periodEnd && periodStart < (endTotalMinutes + buffer);

//         if (isOverlap && period.faculty) {
//           assignedFacultyIds.add(String(period.faculty));
//         }
//       });
//     });
//   })
//   return Array.from(assignedFacultyIds);

// };



// old class service functions
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
  const query: any = {};
  if (sessionId) {
    query.session = new mongoose.Types.ObjectId(sessionId);
  }
  if (sectionId) {
    query.section = new mongoose.Types.ObjectId(sectionId);
  }
  if (classId) {
    query.class = new mongoose.Types.ObjectId(classId);
  }
  const timeTable = await classTimetableSchema.find(query)
    .populate("session", "session")
    .populate("class", "name")
    .populate("section", "name")
    .populate("weeklySchedule.periods.subject", "_id name publication writer ISBN subjectType subjectCategory")
    .populate("weeklySchedule.periods.faculty", "_id name");

  return timeTable;
};