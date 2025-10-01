import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
export const runtime = "nodejs";



export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email and password are required" }), { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
    }

    // Create JWT
  const token = await new SignJWT({ userId: user._id.toString(), email: user.email })
  .setProtectedHeader({ alg: "HS256" })
  .setExpirationTime("1d")
  .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    // Set cookie
    const cookieStore = await cookies();
  cookieStore.set({
  name: "token",
  value: token,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  sameSite: "lax",
  maxAge: 60 * 60 * 24,
});


    // ✅ Correct JSON response
    return new Response(JSON.stringify({ message: "Login successful" ,token}), { status: 200 });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}



