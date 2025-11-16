import studentSchema from "./student.schema";


export const generateEnrollmentNumber = async (
    admissionYear?: number,
    prefix: string = "TCMS"
): Promise<string> => {
    const year = admissionYear || new Date().getFullYear();
    let unique = false;
    let registrationNumber = "";

    while (!unique) {
        const randomNumber = Math.floor(100000 + Math.random() * 900000);
        registrationNumber = `${prefix}${year}${randomNumber}`;

        const existingStudent = await studentSchema.findOne({
            enrollmentNumber: registrationNumber,
        });

        if (!existingStudent) {
            unique = true;
        }
    }
    return registrationNumber;
};