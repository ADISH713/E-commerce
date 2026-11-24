import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getProducts } from '../services/productServices';

export const useProducts = (params = {}, options = {}) =>
    useQuery({
        queryKey: ['products', params],
        queryFn: () => getProducts(params),
        placeholderData: keepPreviousData,
        ...options,
    });