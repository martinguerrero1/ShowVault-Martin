import { Link } from "react-router-dom";
import type { Show } from "../types";

function ShowCard({ show }: { show: Show }) {
  return (
    <Link to={`/shows/${show.id}`}>
      <article className="overflow-hidden rounded-lg border-gray-800 bg-white shadow-md">
        <img
          src={show.image?.medium ?? "/placeholder.jpg"}
          alt={show.name}
          className="h-72 w-full object-cover"
        />
        <div className="p-4">
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
    </Link>
  );
}

export default ShowCard;