
// export default function Home() {
//   return (
//     <div>Home page</div>
//   );
// }




// src/app/page.js
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";

export default async function HomePage() {
  // 1️⃣ Get the token from the cookie
  const token = cookies().get("token")?.value;

  // 2️⃣ If no token → redirect to signin
  if (!token) redirect("/signin");

  try {
    // 3️⃣ Verify JWT
    const { payload } = await jwtVerify(token, new TextEncoder().encode("sanauaransari"));

    // 4️⃣ Render protected content
    return (
      <main className="p-10">
        <h1 className="text-2xl font-bold">Welcome back, {payload.email}</h1>
        <p className="mt-4">This is your protected homepage!</p>
      </main>
    );
  } catch (err) {
    // Token invalid → redirect to signin
    redirect("/signin");
  }
}
