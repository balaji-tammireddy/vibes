import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const getDataFromToken = async () => {
  try {
    const cookieStore = await cookies(); 
    const token = cookieStore.get("token")?.value;

    if (!token) throw new Error("Token not found");

    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);
    return decodedToken.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
};