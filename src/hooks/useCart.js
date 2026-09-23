import { useSelector } from "react-redux";
import { getCartByUserId, updateCart } from "../services/cartServices";

export const useCart = () => {
    const user = useSelector((state) => state.auth.user);
    const cart = useSelector((state) => state.cart);

    const getUserCart = async () => {
        if (!user) return null;

        return await getCartByUserId(user.id);
    };

    const updateUserCart = async (items) => {
        if (!cart?.id) return null;

        return await updateCart(cart.id, items);
    };

    return {
        user,
        cart,
        getUserCart,
        updateUserCart,
    };
};