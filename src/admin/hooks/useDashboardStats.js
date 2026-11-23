import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../../services/adminServices';

export const useDashboardStats = () =>
    useQuery({
        queryKey: ['admin-stats'],
        queryFn: getDashboardStats,
    });