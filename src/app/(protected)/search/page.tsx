import { getSetItems } from "@/server/services/setService";
import Link from "next/link";
import { redirect } from "next/navigation";

const PAGE_SIZE = 24;

type SeachPageProps = {
  searchParams?: Promise<{ q?: string; page?: string }>;
};

export default async function search({ searchParams }: SeachPageProps) {
  const params = await searchParams;
  const q = (params?.q ?? "").trim();
  const page = Math.max(1, Number(params?.page ?? "1") || 1);

  if (!q) {
    redirect("/categories");
  }

  const data = await getSetItems(page, PAGE_SIZE, undefined, q, undefined);

  // No matching results
  if (data.count === 0) {
    return (
      <div className="container">
        <h1>Sökresultat</h1>
        <p>
          Inga träffar för <strong>{q}</strong>.
        </p>
      </div>
    );
  }

  // matching results
  return (
    <>
      <div className="container">
        <h1>Sökresultat</h1>
        <p>
          Visar {data.results.length} av {data.count} för <strong>{q}</strong>
        </p>

        <ul>
          {data.results.map((set) => (
            <li key={set.set_num}>
              <Link href={`/items/${set.set_num}`}>
                {set.set_num} — {set.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
