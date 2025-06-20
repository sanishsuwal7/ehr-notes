import {useQuery} from '@tanstack/react-query';

export function useNotes() {
    return useQuery({
        queryKey: ['notes'],
        queryFn: async () => {
            const res = await fetch('http://localhost:8000/notes');
            return res.json();
        }
    })
}