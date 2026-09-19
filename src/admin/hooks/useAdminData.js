import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { getProducts } from '../../services/productServices';
import { getUsers } from '../../services/userServices';
import { getAllOrders } from '../../services/orderServices';

import {setProducts,setLoading as setProductLoading,setError as setProductError,} from '../../redux/slices/productSlice';

import {setUsers,setLoading as setUserLoading,setError as setUserError,} from '../../redux/slices/userSlice';

import {setOrders,setLoading as setOrderLoading,setError as setOrderError,} from '../../redux/slices/orderSlice';

export const useAdminData = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                dispatch(setProductLoading(true));
                dispatch(setUserLoading(true));
                dispatch(setOrderLoading(true));

                const [products, users, orders] = await Promise.all([
                    getProducts(),
                    getUsers(),
                    getAllOrders(),
                ]);

                dispatch(setProducts(products));
                dispatch(setUsers(users));
                dispatch(setOrders(orders));
            } catch (error) {
                console.error('Failed to load admin data:', error);
            } finally {
                dispatch(setProductLoading(false));
                dispatch(setUserLoading(false));
                dispatch(setOrderLoading(false));
            }
        };

        fetchAdminData();
    }, [dispatch]);
};