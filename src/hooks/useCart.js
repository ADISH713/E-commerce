
import { useSelector } from "react-redux";

export const useCart = () => {
    const user = useSelector((state) => state.auth.user);
    const cart = useSelector((state) => state.cart);

    return {
        user,
        cart,
    };
};