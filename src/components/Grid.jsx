import ProfileCard from "./ProfileCard";

export default function Grid({ filtered }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div
        className="
          grid gap-6
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
          justify-items-center
        "
      >
        {filtered.map((person, i) => (
          <div key={person.id} className="w-full max-w-sm">
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
