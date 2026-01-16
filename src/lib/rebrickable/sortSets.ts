import { SetItem } from "@/models/SetItem";

export function sortSets(items: SetItem[], ordering: string) {
  const copy = [...items];

  switch (ordering) {
    case "name":
      return copy.sort((a, b) =>
        a.name.localeCompare(b.name, "sv", { sensitivity: "base", numeric: true })
      );

    case "-name":
      return copy.sort((a, b) =>
        b.name.localeCompare(a.name, "sv", { sensitivity: "base", numeric: true })
      );

    case "year":
      return copy.sort((a, b) => a.year - b.year);

    case "-year":
      return copy.sort((a, b) => b.year - a.year);

    default:
      return copy;
  }
}
