"use client"
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
const page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "/api/auth/signin",
        { email, password },
        { withCredentials: true } // ✅ important so cookies are included
      );

      // console.log(res.data, "response");

      alert(res.data.message);
      setEmail("");
      setPassword("");

      // Redirect to homepage (protected)
      router.push("/");

    } catch (error) {
      console.error(error);
      if (error.response) {
        alert(error.response.data.error || "Something went wrong");
      } else {
        alert("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };


  return (
   <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
<main className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
<h1 className="text-2xl font-semibold text-gray-800 text-center">
Login
</h1>
<p className="text-sm text-gray-500 text-center mt-2">
Enter your name & password to continue
</p>


<form onSubmit={handleSubmit} className="mt-6 space-y-5">
<div>
<label
htmlFor="email"
className="block text-sm font-medium text-gray-700"
>
Email
</label>
<input
id="email"
name="email"
type="text"
required
placeholder="Your Email"
value={email}
onChange={(e) => setEmail(e.target.value)}
className="mt-1 block w-full rounded-lg  px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"

/>

</div>


<div>
<label
htmlFor="password"
className="block text-sm font-medium text-gray-700"
>
Password
</label>
<input
id="password"
name="password"
type="password"
required
placeholder="Enter your password"
value={password}
onChange={(e) => setPassword(e.target.value)}
className="mt-1 block w-full rounded-lg  px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"

/>

</div>


<button
type="submit"
className="w-full py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
>
Login
</button>
</form>


<p className="text-xs text-gray-500 text-center mt-4">
Don't have account, Please <Link href="/signup" className="text-indigo-600">Signup</Link>
</p>
</main>
</div>
  )
}

export default page
