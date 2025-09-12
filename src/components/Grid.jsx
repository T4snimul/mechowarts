import ProfileCard from "./ProfileCard";

export default function Grid({ filtered }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      {/* Auto-fit columns; each card is at least 20rem (~320px) but can grow up to 1fr */}
      <div
        className="
          grid
          gap-x-6 gap-y-10
          [grid-template-columns:repeat(auto-fit,minmax(20rem,1fr))]
        "
      >
        {filtered.map((person, i) => (
          <div key={person.id} className="min-w-0">
            <ProfileCard person={person} index={i} />
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed bg-white p-10 text-center text-gray-600">
          No matches. Try a different search.
        </div>
      )}
    </section>
  );
}
