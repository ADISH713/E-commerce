import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../services/productServices';

export const useCategories = () =>
    useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
        staleTime: 5 * 60 * 1000,
    });