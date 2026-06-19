import { Link } from "react-router-dom";
import type { Show } from "../types";
import React from "react";

function ShowCard({ show, onAgregarALista }: { show: Show, onAgregarALista: (show: Show) => void }) {
  return (
    <article className="overflow-hidden rounded-lg border-gray-800 bg-white shadow-md">
        <Link to={`/shows/${show.id}`}>
          <img
            src={show.image?.medium ?? "/placeholder.jpg"}
            alt={show.name}
            className="h-64 w-full object-cover"
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
        </Link>
        <div className="flex justify-center mb-2">
          <button className="rounded-xl border border-blue-500/40 px-3 py-2 text-sm font-semibold text-blue-500 transition hover:bg-blue-500 hover:text-white"
          onClick={() => onAgregarALista(show)}
          >
             Agregar a mi lista
          </button>
        </div>
      </article>
  );
}

export default React.memo(ShowCard);