"use client"

import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
    const [user, setUser] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);

    function signup() {
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if(!user || !email || !password) {
            setError("All fields are required");
            return;
        }
        console.log(`user: ${user}, email: ${email}, password: ${password}, confirm password: ${confirmPassword}`)
        setUser("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setError(null);
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <p className="text-4xl font-bold mb-6 text-center text-gray-800">Sign Up</p>
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
                <input 
                    type="password" 
                    placeholder="Confirm Password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-red-700">{error ? error : ""}</p>
                <button 
                    onClick={signup} 
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
                >
                    Sign Up
                </button>
            </div>
            <p>if you already have an account you can <Link href="/login" className="underline">sign in</Link></p>
        </div>
    )
}