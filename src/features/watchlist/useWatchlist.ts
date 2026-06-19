// src/features/watchlist/useWatchlist.ts

import { useEffect, useMemo } from "react";
import { useAuthStore } from "../auth/authStore";
import { useWatchlistStore } from "./watchlistStore";
import type { WatchStatus } from "../../types";

export function useWatchlist() {
  //selecciono solo el estado que voy a usar del useAuthStore
  const user = useAuthStore((state) => state.user);

  //todos los estados de useWatchlistStore
  const {items, agregarShow, cambiarStatus, cargarLista, estaEnLista, getStatus, quitarShow } = useWatchlistStore()

  //Cuando la id del usuario del authstore cambia, se vuelve a cargar la lista
  useEffect(() => {
    cargarLista(user?.id ?? null);
  }, [user?.id, cargarLista]);

  // Derivado: no se guarda en estado.
  // Se recalcula solo cuando cambia items.
  const totalPorStatus: Record<WatchStatus, number> = useMemo(
    () =>
      items.reduce(
        (acc, item) => {
          acc[item.status] = acc[item.status] + 1;
          return acc;
        },
        {
          "plan-to-watch": 0,
          watching: 0,
          completed: 0,
        }
      ),
    [items],
  );

  return {
    items,
    agregarShow,
    quitarShow,
    cambiarStatus,
    estaEnLista,
    getStatus,
    totalPorStatus,
  };
}