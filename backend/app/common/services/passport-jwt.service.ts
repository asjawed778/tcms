// import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import createError from "http-errors";
import * as userService from "../../user/user.service";
import { type Request } from "express";
import { type IUserResponse, type IUserRole } from "../../user/user.dto";
import { UserRole } from "../utils/enum";
import bcrypt from 'bcrypt';

const isValidPassword = async function (value: string, password: string) {
  const compare = await bcrypt.compare(value, password);
  return compare;
};

export const initPassport = (): void => {
  passport.use(
    new Strategy(
      {
        secretOrKey: process.env.JWT_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      },
      async (token: { user: Request["user"] }, done) => {
        try {
          done(null, token.user);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  // user login
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await userService.getUserByEmail(email);
          if (user == null) {
            done(createError(401, "User not found!"), false);
            return;
          }

          if (!user.isActive) {
            done(createError(401, "User is inactive"), false);
            return;
          }

          if (!user.password) {
            return done(
              createError(401, "Set a password to use email login, or continue with your social provider."),
              false
            );
          }

          const validate = await isValidPassword(password, user.password);
          if (!validate) {
            done(createError(401, "Invalid email or password"), false);
            return;
          }
          const { password: _p, refreshToken, resetPasswordToken, ...result } = user;
          const userResp: IUserResponse = {
            ...result,
            role: result.role as unknown as IUserRole
          };
          done(null, userResp, { message: "Logged in Successfully" });
        } catch (error: any) {
          done(createError(500, error.message));
        }
      }
    )
  );

  passport.use(
    "admin-login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await userService.getUserByEmail(email);

          if (!user) return done(createError(401, "User not found!"), false);
          if (!user.password) {
            return done(
              createError(401, "Set a password to use email login, or continue with your social provider."),
              false
            );
          }
          if (!(await bcrypt.compare(password, user.password))) {
            return done(createError(401, "Invalid email or password"), false);
          }

          if (
            user.role?.name === UserRole.USER ||
            !user.role?.permissions?.some((perm: any) =>
              Object.values(perm.operations).includes(true)
            )
          ) {
            return done(createError(403, "You are not Authorized to access admin portal"), false);
          }

          done(null, user, { message: "Admin Dashboard login successful" });
        } catch (error: any) {
          done(createError(500, error.message));
        }
      }
    )
  );

};
