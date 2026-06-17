import axios from "axios";
import type { AsyncState, CastMember, Season, Show } from "../types";
import { useEffect, useState } from "react";

// Entra: id del show (string | undefined desde useParams)
// Sale: objeto con estados separados para cada recurso
export function useShowDetails(id: string | undefined): {
  show: AsyncState<Show>;
  seasons: AsyncState<Season[]>;
  cast: AsyncState<CastMember[]>;
}{
    const [show, setShow] = useState<AsyncState<Show>>({status: "idle"});
    const [seasons, setSeasons] = useState<AsyncState<Season[]>>({status: "idle"});
    const [cast, setCast] = useState<AsyncState<CastMember[]>>({status: "idle"});

    useEffect(() => {
        //si el id es undefined ni tratamos de cambiar el estado (se queda en idle)
        if (!id) return;

        const controller = new AbortController()
        const abortSignal = controller.signal;

        async function detailsFetch() {
            setShow({status: "loading"})
            setSeasons({status: "loading"})
            setCast({status: "loading"})

            try {
                const [showData, seasonsData, castData] = await Promise.all([
                    axios.get(`https://api.tvmaze.com/shows/${id}`, {signal: abortSignal}).then(r => r.data),
                    axios.get(`https://api.tvmaze.com/shows/${id}/seasons`, {signal: abortSignal}).then(r => r.data),
                    axios.get(`https://api.tvmaze.com/shows/${id}/cast`, {signal: abortSignal}).then(r => r.data),
                ])
                
                setShow({ status: "success", data: showData})
                setSeasons({ status: "success", data: seasonsData})
                setCast({ status: "success", data: castData})

            } catch (error) {
                if (axios.isCancel(error)) return //ignorar error del abort

                setShow({status: "error", error: "Hubo un error en la carga de los detalles del show"})
                setSeasons({status: "error", error: "Hubo un error en la carga de las temporadas del show"})
                setCast({status: "error", error: "Hubo un error en la carga de el elenco del show"})
            }   
        }
    
        void detailsFetch()

        return () => controller.abort()
    }, [id])

    return {show, seasons, cast}
}

