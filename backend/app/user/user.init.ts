import bcrypt from "bcrypt";
import userSchema from "../user/user.schema";
import * as Enum from "../common/constant/enum";

export const initUser = async () => {
    const email = "akrtimes@gmail.com";

    const existingUser = await userSchema.findOne({ email });
    if (existingUser) {
        console.log("✅ Super Admin already exists:", existingUser.email);
        return;
    }

    const hashedPassword = await bcrypt.hash("Test@1234", 10);

    const superAdmin = await userSchema.create({
        name: "Super Admin",
        email,
        password: hashedPassword,
        role: Enum.UserRole.SUPER_ADMIN,
        isLoginAllowed: true,
        active: true,
    });

    console.log("🚀 Super Admin created successfully:", superAdmin.email);
};
