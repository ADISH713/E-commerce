import { updateOrderStatus as updateOrderStatusAction } from '../../redux/slices/orderSlice';
import { updateOrderStatus } from '../../services/orderServices';
import { getProductById, updateProduct } from '../../services/productServices';
import { useDispatch } from 'react-redux';

export const useOrderActions = () => {
    const dispatch = useDispatch();

    const changeOrderStatus = async (order, status) => {
        try {
            if (!order) {
                throw new Error('Order not found');
            }

            if (status === 'Cancelled' && order.status !== 'Cancelled') {
                await Promise.all(
                    order.items.map(async (item) => {
                        const product = await getProductById(item.id);

                        return updateProduct(product.id, {
                            stock: product.stock + item.quantity,
                        });
                    })
                );
            }

            const updatedOrder = await updateOrderStatus(order.id, status);

            dispatch(
                updateOrderStatusAction({
                    id: updatedOrder.id,
                    status: updatedOrder.status,
                })
            );
        } catch (error) {
            console.error('Failed to update order status:', error);
        }
    };

    return { changeOrderStatus };
};