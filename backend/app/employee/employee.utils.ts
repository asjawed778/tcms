import employeeSchema from "./employee.schema";

export const getUniqueEmployeeId = async () => {
    let isUnique = false;
    let newId = '';
    while (!isUnique) {
        const randomId = "TCMS" + Math.floor(10000000 + Math.random() * 90000000);
        const existing = await employeeSchema.findOne({ employeeId: randomId });
        if (!existing) {
            newId = randomId;
            isUnique = true;
        }
    }
    return newId.toString();
};
