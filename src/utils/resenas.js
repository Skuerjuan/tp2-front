import { createClient } from "@/utils/supabase/client.js";

const supabase = createClient();

export async function fetchResenas() {
  const { data, error } = await supabase.from("resenas").select("*");

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function fetchLeidos(){
    const { data, error } = await supabase.from("resenas").select("*").eq("leido", true);

    if (error) {
        throw error;
    }

    return data ?? [];
}

export async function insertResena(resena) {
  const { data, error } = await supabase.from("resenas").insert(resena).select("*").single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateResena(id, changes) {
  const { data, error } = await supabase
    .from("resenas")
    .update(changes)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteResena(id) {
  const { error } = await supabase.from("resenas").delete().eq("id", id);

  if (error) {
    throw error;
  }
}