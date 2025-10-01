// import connectToDatabase from "@/lib/mongodb";
// import User from "@/models/User";
// import bcrypt from "bcryptjs";

// export async function POST(req) {
//   try {
//     // Extract the value email, password fron req.
//     const { email, password } = await req.json();

//     if (!email || !password) {
//       return Response.json({ error: "Email and password are required" }, { status: 400 });
//     }

//     await connectToDatabase();

//     const user = await User.findOne({ email });
//     if (!user) {
//       return Response.json({ error: "User not found" }, { status: 404 });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return Response.json({ error: "Invalid credentials" }, { status: 401 });
//     }

//     return Response.json({ message: "Login successful", user }, { status: 200 });
//   } catch (error) {
//     return Response.json({ error: error.message }, { status: 500 });
//   }
// }




// // src/app/api/auth/signin/route.js
// import connectToDatabase from "@/lib/mongodb";
// import User from "@/models/User";
// import bcrypt from "bcryptjs";
// import { SignJWT } from "jose";
// import { cookies } from "next/headers";

// export async function POST(req) {
//   try {
//     const { email, password } = await req.json();

//     if (!email || !password) {
//       return Response.json({ error: "Email and password are required" }, { status: 400 });
//     }

//     await connectToDatabase();
//     const user = await User.findOne({ email });
//     if (!user) {
//       return Response.json({ error: "User not found" }, { status: 404 });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return Response.json({ error: "Invalid credentials" }, { status: 401 });
//     }

//     // ✅ Create JWT
//     const token = await new SignJWT({ userId: user._id, email: user.email })
//       .setProtectedHeader({ alg: "HS256" })
//       .setExpirationTime("1d")
//       .sign(new TextEncoder().encode("sanauaransari"));

//     // ✅ Store JWT in HttpOnly cookie
//     cookies().set({
//       name: "token",
//       value: token,
//       httpOnly: true,
//       secure:"s79uaruiuiui",
//       path: "/",
//       sameSite: "lax",
//       maxAge: 60 * 60 * 24, // 1 day
//     });

//     return Response.json({ message: "Login successful",token }, { status: 200 });
//   } catch (error) {
//     return Response.json({ error: error.message }, { status: 500 });
//   }
// }






import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json({ error: "Email and password are required" }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // ✅ Use env secret
    const token = await new SignJWT({ userId: user._id, email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1d")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    // ✅ Set cookie
    cookies().set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
    });

    return Response.json({ message: "Login successful" }, { status: 200 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

