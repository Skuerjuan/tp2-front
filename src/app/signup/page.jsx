"use client"

import { useState } from "react";

export default function SignupPage() {
    const [user, setUser] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    function signup() {
        console.log(`user: ${user}, email: ${email}, password: ${password}, confirm password: ${confirmPassword}`)
    }
    return (
        <div className="flex flex-col gap-4 p-12">
            <input type="text" placeholder="user" value={user} onChange={(e) => setUser(e.target.value)} />
            <input type="text" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="text" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <input type="text" placeholder="confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
            <button onClick={signup} >Sign up</button>
        </div>
    )
}