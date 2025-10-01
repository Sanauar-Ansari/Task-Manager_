

// import { NextResponse } from 'next/server';
// import connectToDatabase from "@/lib/mongodb";
// import Task from '@/models/Task';
// import { cookies } from "next/headers";
// import { jwtVerify } from "jose";

// export async function POST(request) {
//   try {
//     await connectToDatabase();

//     const cookieStore = await cookies();
//     const token = cookieStore.get("token")?.value;

//     if (!token) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const { payload } = await jwtVerify(
//       token,
//       new TextEncoder().encode(process.env.JWT_SECRET || "sanauaransari")
//     );

//     const data = await request.json();

//     const task = await Task.create({
//       ...data,
//       userId: payload.userId, // 👈 attach userId from token
//     });

//     return NextResponse.json({ message: 'Task created', task }, { status: 201 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { message: 'Error creating task', error: error.message },
//       { status: 500 }
//     );
//   }
// }

// export async function GET() {
//   try {
//     await connectToDatabase();

//     const cookieStore = await cookies();
//     const token = cookieStore.get("token")?.value;

//     if (!token) {
//       return NextResponse.json([], { status: 200 }); // ✅ return empty array if no token
//     }

//     const { payload } = await jwtVerify(
//       token,
//       new TextEncoder().encode(process.env.JWT_SECRET || "sanauaransari")
//     );

//     const tasks = await Task.find({ userId: payload.userId }).lean(); // plain JS objects

//     return NextResponse.json(tasks, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching tasks:", error.message);
//     return NextResponse.json([], { status: 200 }); // ✅ return empty array on error
//   }
// }



import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Task from "@/models/Task";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function POST(request) {
  try {
    await connectToDatabase();

    const token = cookies().get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let payload;
    try {
      ({ payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET || "sanauaransari")
      ));
    } catch (err) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
    }

    const data = await request.json();

    const task = await Task.create({
      ...data,
      userId: payload.userId, // ✅ attach userId from JWT
    });

    return NextResponse.json({ message: "Task created", task }, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error.message);
    return NextResponse.json(
      { message: "Error creating task", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();

    const token = cookies().get("token")?.value;
    if (!token) {
      return NextResponse.json([], { status: 200 }); // ✅ empty array if not logged in
    }

    let payload;
    try {
      ({ payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET || "sanauaransari")
      ));
    } catch (err) {
      console.error("JWT verification failed:", err.message);
      return NextResponse.json([], { status: 200 }); // ✅ return empty if invalid token
    }

    const tasks = await Task.find({ userId: payload.userId }).lean();
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    return NextResponse.json([], { status: 200 }); // ✅ still return empty array
  }
}

