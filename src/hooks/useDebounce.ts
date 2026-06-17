import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number): T{
    const [state, setState] = useState(value);

    useEffect(() => {
        const timeoutId = setTimeout(() => {setState(value)}, delay)

        return () => clearTimeout(timeoutId)
    }, [value, delay])

    return state;
}