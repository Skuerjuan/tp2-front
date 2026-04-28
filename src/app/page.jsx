import { createClient } from "../utils/supabase/server.js";
import Link from "next/link.js";

export default async function Home() {

  const supabase = await createClient()

  const { data, error } = await supabase
  .from('users')
  .select('*')

  if(error) console.error("Error fetching data:", error);
  
  // const { data, error } = await supabase
  // .from('users')
  // .insert([{ nombre: 'John Doe', email: 'johndoe@gmail.com'}])
  // console.log(data)

  return (
    <>
    <div>
      {
        data.map((user) => (
          <div key={user.id}>
            <p>{user.nombre}</p>
            <p>{user.email}</p>
          </div>
        ))
      }
    </div>
    <Link href="/login" className="p-2 border-solid border-black">Login</Link>
    </>
  );
}
