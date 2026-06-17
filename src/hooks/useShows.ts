// src/hooks/useShows.ts
import { useEffect, useState } from "react";
import axios from "axios";
import type { AsyncState, SearchShowResponse, Show } from "../types";

export function useShows(search: string): AsyncState<Show[]> {
  //CREAMOS UN ESTADO INTERNO DE TIPO AsyncState, y lo inicializamos con el estado IDLE.
  const [state, setState] = useState<AsyncState<Show[]>>({
    status: "idle",
  });

  useEffect(() => {
    const controller = new AbortController();

    async function fetchShows() {
      setState({ status: "loading" });

      try {
        if (search.trim()) {
          const response = await axios.get<SearchShowResponse[]>(
            "https://api.tvmaze.com/search/shows",
            {
              params: { q: search }, //opcion de axios, convierte automaticamente la url a la que le pega con los params especificados
              signal: controller.signal,
            },
          );

          const shows = response.data.map((item) => item.show); //convierto el response de array de { score, show } a Show[]

          setState({ status: "success", data: shows });
          return;
        }

        //si no existe search:
        const response = await axios.get<Show[]>(
          "https://api.tvmaze.com/shows?page=0",
          {
            signal: controller.signal,
          },
        );

        setState({ status: "success", data: response.data });
      } catch (error) {
        if (axios.isCancel(error)) return;

        setState({
          status: "error",
          error: "No se pudieron cargar los shows.",
        });
      }
    }

    fetchShows();

    return () => {
      controller.abort();
    };
  }, [search]);

  return state;
}
