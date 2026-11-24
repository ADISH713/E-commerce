import { useEffect, useState } from 'react';

// returns the value only after it has stopped changing for `delay` ms
export const useDebounce = (value, delay = 300) => {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
};