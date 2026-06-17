import type { Show } from "../types";

function ShowCard({ show }: { show: Show }) {
  return (
    <article className="overflow-hidden rounded-lg border bg-white shadow-sm">
      <img
        src={show.image?.medium ?? "/placeholder.jpg"}
        alt={show.name}
        className="h-72 w-full object-cover"
      />

      <div className="space-y-2 p-4">
        <h2 className="line-clamp-1 text-lg font-semibold">
          {show.name}
        </h2>

        <p className="text-sm text-gray-600">
          Estado: {show.status}
        </p>

        <p className="text-sm text-gray-600">
          Rating: {show.rating.average ?? "N/A"}
        </p>
      </div>
    </article>
  );
}

export default ShowCard;