import { createClient } from "@/utils/supabase/client.js";

const supabase = createClient();

export async function fetchResenas() {
  const { data, error } = await supabase.from("resenas").select("*");

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function fetchLeidos(userId) {
  const { data, error } = await supabase
    .from("leidos")
    .select("puntaje, resena_id")
    .eq("usuario_id", userId);

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function insertLeido(userId, resenaId, puntaje = 0) {
  const { data, error } = await supabase
    .from("leidos")
    .insert({ usuario_id: userId, resena_id: resenaId, puntaje })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function fetchResenasDesdeLeidos(userId) {
  const leidos = await fetchLeidos(userId);
  const ids = leidos.map((item) => item.resena_id).filter(Boolean);

  if (ids.length === 0) {
    return [];
  }

  const { data, error } = await supabase.from("resenas").select("*").in("id", ids);

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function fetchLeidosConResenas(userId) {
  const leidos = await fetchLeidos(userId);
  const ids = leidos.map((item) => item.resena_id).filter(Boolean);

  if (ids.length === 0) {
    return [];
  }

  const { data: resenas, error } = await supabase.from("resenas").select("*").in("id", ids);

  if (error) {
    throw error;
  }

  const resenasPorId = new Map((resenas ?? []).map((resena) => [resena.id, resena]));

  return leidos
    .map((item) => {
      const resena = resenasPorId.get(item.resena_id);

      if (!resena) {
        return null;
      }

      return {
        ...resena,
        puntaje_leido: item.puntaje,
        resena_id: item.resena_id,
      };
    })
    .filter(Boolean);
}

export async function updateLeidoPuntaje(userId, resenaId, puntaje) {
  const { data, error } = await supabase
    .from("leidos")
    .update({ puntaje })
    .eq("usuario_id", userId)
    .eq("resena_id", resenaId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
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