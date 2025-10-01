// import connectToDatabase from "@/lib/mongodb";
// import User from "@/models/User";
// import bcrypt from "bcryptjs";

// export async function POST(req) {
//   try {
//     const { name, email, password } = await req.json();

//     if (!name || !email || !password) {
//       return Response.json({ error: "All fields are required" }, { status: 400 });
//     }
//     const db = await connectToDatabase();
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return Response.json({ error: "User already exists" }, { status: 400 });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ name, email, password: hashedPassword });
//     await newUser.save();
//     return Response.json({ message: "User created successfully" }, { status: 201 });
//   } catch (error) {
//     return Response.json({ error: error.message }, { status: 500 });
//   }
// }



export const runtime = "nodejs";

import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: "Name, email and password are required" }), { status: 400 });
    }

    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "User already exists" }), { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // ✅ Return proper JSON response
    return new Response(JSON.stringify({ message: "Signup successful" }), { status: 201 });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
