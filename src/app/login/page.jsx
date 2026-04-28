"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client.js";

export default function LoginPage() {
    const router = useRouter();
    const supabase = createClient();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState(null);

    async function onSubmit(e) {
        e.preventDefault();
        setErrorMsg(null);

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        setErrorMsg(error.message);
        return;
    }

        router.push("/");
        router.refresh();
    }

    return (
        <div className="flex flex-col gap-4 p-12">
            <input type="text" placeholder="user" />
            <input type="text" placeholder="password" />
            <input type="text" placeholder="confirm password" />
            <button >Log in</button>
        </div>
    );
}