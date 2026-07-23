"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function MuseumFilter({
  museums,
}: {
  museums: { id: string; name: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("museumId") ?? "";

  return (
    <select
      value={current}
      onChange={(e) => {
        const params = new URLSearchParams(searchParams.toString());
        if (e.target.value) {
          params.set("museumId", e.target.value);
        } else {
          params.delete("museumId");
        }
        router.push(`/admin/bens?${params.toString()}`);
      }}
      className="flex h-9 w-full max-w-xs rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <option value="">Todos os museus</option>
      {museums.map((museum) => (
        <option key={museum.id} value={museum.id}>
          {museum.name}
        </option>
      ))}
    </select>
  );
}
