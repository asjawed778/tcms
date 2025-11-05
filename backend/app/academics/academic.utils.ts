import createHttpError from "http-errors";
import subjectSchema from "./subject.schema";
import classSchema from "./class.schema";
import sectionSchema from "./section.schema";


export const isClassAlreadyExists = async (name: string, session: string) => {
    const existingClass = await classSchema.findOne({ name, session, deleted: false });
    return !!existingClass;
};

export const isClassAndSectionValid = async (
    sessionId: string,
    classId: string,
    sectionId?: string
): Promise<boolean> => {
    const classDoc = await classSchema.findOne({
        _id: classId,
        session: sessionId,
        deleted: false,
    });
    if (!classDoc) {
        return false;
    }
    if (sectionId) {
        const sectionDoc = await sectionSchema.findOne({
            _id: sectionId,
            classId,
            sessionId,
        });
        return !!sectionDoc;
    }
    return true;
};

const getFixedClassCode = (className: string): string => {
    const name = className.toLowerCase();

    if (name.includes("nursery")) return "NR";
    if (name.includes("lkg")) return "LK";
    if (name.includes("ukg")) return "UK";

    const numberMatch = className.match(/\d+/);
    if (numberMatch) {
        const num = parseInt(numberMatch[0], 10);
        return num < 10 ? `0${num}` : `${num}`;
    }
    return className.replace(/\s+/g, "").substring(0, 2).toUpperCase();
};

export const generateClassId = async (className: string, year: string): Promise<string> => {
    const classCode = getFixedClassCode(className);
    let classId: string;
    let exists = true;
    while (exists) {
        // const randomNum = Math.floor(1000 + Math.random() * 9000);
        classId = `C${classCode}${year}`;
        exists = !!(await classSchema.exists({ classId }));
    }
    return classId!;
};

export const generateSectionId = async (className: string, sectionName: string): Promise<string> => {
    const classCode = getFixedClassCode(className);
    const sectionCode = sectionName.replace(/\s+/g, "").substring(0, 1).toUpperCase(); // single letter (A, B, C)
    const year = new Date().getFullYear().toString().slice(-2);

    let sectionId: string;
    let exists = true;
    while (exists) {
        const randomNum = Math.floor(1000 + Math.random() * 9000); // 4 digits
        sectionId = `S${classCode}${sectionCode}${year}${randomNum}`; // e.g. S12A254321
        exists = !!(await sectionSchema.exists({ sectionId }));
    }
    return sectionId!;
};

export const generateUniqueSubjectId = async (subjectName: string): Promise<string> => {
    if (!subjectName || typeof subjectName !== "string") {
        throw createHttpError(401, "Subject name must be a valid string");
    }

    const prefix = subjectName.trim().substring(0, 3).toUpperCase();
    let subjectId = "";
    let isUnique = false;

    while (!isUnique) {
        const randomNumber = Math.floor(10000 + Math.random() * 90000);
        subjectId = `${prefix}${randomNumber}`;

        const existing = await subjectSchema.findOne({ subjectId });
        if (!existing) {
            isUnique = true;
        }
    }
    return subjectId;
};

export const calculateDuration = (startTime: string, endTime: string): string => {
    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);

    const start = sh * 60 + sm;
    const end = eh * 60 + em;
    const diffMin = Math.max(0, end - start);

    const hours = Math.floor(diffMin / 60);
    const minutes = diffMin % 60;

    let iso = "PT";
    if (hours > 0) iso += `${hours}H`;
    if (minutes > 0) iso += `${minutes}M`;
    if (iso === "PT") iso = "PT0M";

    return iso;
};

