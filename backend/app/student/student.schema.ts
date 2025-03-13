// import mongoose from "mongoose";

// const CounterSchema = new mongoose.Schema({
//     key: { type: String, required: true, unique: true },
//     count: { type: Number, default: 1 },
// });

// const StudentSchema = new mongoose.Schema({
//     enrollmentNumber: { type: String, unique: true }, 
// });

// Pre-save middleware to generate `enrollmentNumber`
// StudentSchema.pre("save", async function (next) {
//     if (!this.enrollmentNumber) {
//         const admissionYear = this.admissionYear.slice(-2); // Get last 2 digits of year (e.g., "24" for 2024)
//         const counter = await CounterSchema.findOneAndUpdate(
//             { key: `STUDENT-${admissionYear}` },
//             { $inc: { count: 1 } },
//             { new: true, upsert: true }
//         );
//         this.enrollmentNumber = `TCMS${admissionYear}${counter.count.toString().padStart(4, "0")}`;
//     }
//     next();
// });

// export default mongoose.model<>("Student", StudentSchema);
