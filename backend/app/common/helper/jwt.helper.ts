import jwt from "jsonwebtoken";
import { loadConfig } from "./config.hepler";
import createHttpError from "http-errors";
import { IUserResponse, Payload } from "../../user/user.dto";
import bcrypt from 'bcrypt';
loadConfig();

const ACCESS_TOKEN_SECRET: string = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET: string = process.env.REFRESH_TOKEN_SECRET as string;
const ACCESS_TOKEN_EXPIRY: string = process.env.ACCESS_TOKEN_EXPIRY as string;
const REFRESH_TOKEN_EXPIRY: string = process.env.REFRESH_TOKEN_EXPIRY as string;


export const generateTokens = (payload: Payload) => {
  try {
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: '7d',
    });

    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  } catch (error) {
    throw createHttpError(500, "Error generating tokens");
  }
};

export const validateToken = (token: string, secret: string) => {
  try {
    const decoded = jwt.verify(token, secret);
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error };
  }
};

export const decodeAccessToken = async (encryptedAccessToken: string) => {
  const payload: IUserResponse = jwt.verify(
    encryptedAccessToken,
    ACCESS_TOKEN_SECRET
  ) as IUserResponse;
  if (payload === null) {
    throw createHttpError(403, {
      message: "Invalid Token...",
    });
  }
  return payload;
};

export const generatePasswordRestToken = async (userId: string) => {
  const resetToken = jwt.sign({ userId: userId }, ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  return resetToken;
};

export const verifyResetPasswordToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error };
  }
};

export const verifyPasswrod = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 12);
};
