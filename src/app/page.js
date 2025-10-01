// // src/app/page.js
// import { cookies } from "next/headers";
// import { jwtVerify } from "jose";
// import { redirect } from "next/navigation";

// export default async function HomePage() {
//   // 1️⃣ Get cookie store
//   const cookieStore = await cookies();
//   const token = cookieStore.get("token")?.value;

//   // 2️⃣ If no token → redirect to signin
//   if (!token) redirect("/signin");

//   try {
//     // 3️⃣ Verify JWT
//     const { payload } = await jwtVerify(
//       token,
//       new TextEncoder().encode(process.env.JWT_SECRET || "sanauaransari") // ✅ better to use env
//     );

//     // 4️⃣ Render protected content
//     return (
//       <main className="p-10">
//         <h1 className="text-2xl font-bold">Welcome back, {payload.email}</h1>
//         <p className="mt-4">This is your protected homepage!</p>
//       </main>
//     );

//   } catch (err) {
//     console.error("JWT verification failed:", err.message);
//     redirect("/signin");
//   }
// }









// src/app/page.js
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import TaskManager from "./TaskManager.jsx";

export default async function HomePage() {
  // 1️⃣ Get cookie store
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/signin");

  try {
    // 2️⃣ Verify JWT
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET || "sanauaransari")
    );

    // 3️⃣ Render Client Component (with user email if needed)
    return <TaskManager email={payload.email} />;
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    redirect("/signin");
  }
}
