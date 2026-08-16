"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Category } from "@/lib/types";

export default function DeleteRecipeButton({ id, category }: { id: string; category: Category }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (!confirm("Delete this recipe?")) return;
    setBusy(true);
    const { error } = await supabase.from("recipes").delete().eq("id", id);
    setBusy(false);
    if (error) return alert(error.message);
    router.push(`/category/${category}`);
    router.refresh();
  }

  return (
    <button
      onClick={onDelete}
      disabled={busy}
      className="text-sm px-3 py-1.5 rounded-md border border-red-300 text-red-600 disabled:opacity-50"
    >
      {busy ? "..." : "Delete"}
    </button>
  );
}
