// import React from 'react'
"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation"; // for redirecting after login
import axios from "axios";
const page = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

   const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "/auth/signup",
        { name, email, password },
        { withCredentials: true } // keep cookies consistent
      );

      // console.log(res.data, "response");

      alert(res.data.message);
      setName("");
      setEmail("");
      setPassword("");

      // Redirect to signin page after signup
      router.push("/signin");

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
Create account
</h1>
<p className="text-sm text-gray-500 text-center mt-2">
Just an email & password to get started
</p>


<form onSubmit={handleSubmit} className="mt-6 space-y-5">


    <div>
<label
htmlFor="name"
className="block text-sm font-medium text-gray-700"
>
Name
</label>
<input
id="name"
name="name"
type="text"
required
placeholder="Your Name"
value={name}
onChange={(e) => setName(e.target.value)}
className="mt-1 block w-full rounded-lg  px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
/>
</div>





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
type="email"
required
placeholder="you@example.com"
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
minLength={5}
placeholder="Enter a strong password"
value={password}
onChange={(e) => setPassword(e.target.value)}
className="mt-1 block w-full rounded-lg  px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
/>
</div>

<button
type="submit"
disabled={loading}
className="w-full py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
>
{loading ? "Creating User..." : " Create account"}  
</button>
</form>
<p className="text-xs text-gray-500 text-center mt-4">
Already have account, Please <Link href="/signin" className="text-indigo-600">Login</Link>
</p>
</main>
</div>
  )
}

export default page
