import { cookies } from "next/headers";

export async function POST() {
  (await cookies()).set("token", "", {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 0,
  });

  return Response.json({ message: "Logout successful" });
}