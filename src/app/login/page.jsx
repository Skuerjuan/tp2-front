"use client"

import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
    const [user, setUser] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    function login() {

        if(!user || !email || !password) {
            setError("All fields are required");
            return;
        }
        console.log(`user: ${user}, email: ${email}, password: ${password}`)

        //https://supabase.com/docs/guides/auth/passwords

        setUser("");
        setEmail("");
        setPassword("");
        setError(null);
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <p className="text-4xl font-bold mb-6 text-center text-gray-800">Sign in</p>
                <input 
                    type="text" 
                    placeholder="User" 
                    value={user} 
                    onChange={(e) => setUser(e.target.value)} 
                    className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-red-700">{error ? error : ""}</p>
                <button 
                    onClick={login} 
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
                >
                    Sign Up
                </button>
            </div>
            <p>if you don't have an account you can <Link href="/signup" className="underline">sign up</Link></p>
        </div>
    )
}