import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers";

export default async function Home() {

  const cookieStore = await cookies()
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
  
  // const { data, error } = await supabase
  // .from('usuarios')
  // .insert([
  //   { nombre: 'Juan', email: 'juan@email.com' }
  // ])
  const { data, error } = await supabase
  .from('users')
  .select('*')
  console.log(data)
  
  function btn(){
    console.log(data)
    console.log(error)
  }

  return (
    <>
    <div>
      <button type="button" className="border-solid b-2 p-4" onClick={btn()}>hola</button>
    </div>
    </>
  );
}
