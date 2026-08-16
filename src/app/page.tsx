import Link from "next/link";
import { CATEGORIES, CATEGORY_LABELS } from "@/lib/types";

export default function HomePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <div className="grid gap-3">
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            href={`/category/${c}`}
            className="block p-5 rounded-lg bg-white border hover:shadow-sm transition"
          >
            <div className="text-lg font-medium">{CATEGORY_LABELS[c]}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
