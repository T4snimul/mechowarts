import { useMemo } from "react";

export default function usePeopleFilter(people, query, sortBy) {
  return useMemo(() => {
    const q = query.toLowerCase().trim();

    let list = people.filter((p) => {
      return (
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.roll.toLowerCase().includes(q) ||
        p.bloodGroup.toLowerCase().includes(q) ||
        p.hometown.toLowerCase().includes(q) ||
        p.phone.toLowerCase().includes(q)
      );
    });

    // Fallback if the field doesn’t exist
    list.sort((a, b) => {
      const aVal = a[sortBy] || "";
      const bVal = b[sortBy] || "";
      if (sortBy === "roll") {
        return Number(aVal) - Number(bVal);
      }
      return aVal.localeCompare(bVal);
    });

    return list;
  }, [people, query, sortBy]);
}
