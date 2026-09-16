import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../services/productServices';
import {
    setProducts,
    setLoading,
    setError,
} from '../../redux/slices/productSlice';

function AdminProducts() {
    const dispatch = useDispatch();

    const {
        items: products,
        isLoading,
        error,
    } = useSelector((state) => state.products);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                dispatch(setLoading(true));

                const data = await getProducts();

                dispatch(setProducts(data));
            } catch (error) {
                dispatch(setError(error.message));
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchProducts();
    }, [dispatch]);

    if (isLoading) {
        return <p>Loading products...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                    Products
                </h2>

                <button className="bg-orange-600 text-white px-4 py-2 rounded-lg">
                    Add Product
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b text-left">
                            <th className="p-4">Image</th>
                            <th className="p-4">Name</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map((product) => (
                            <tr
                                key={product.id}
                                className="border-b"
                            >
                                <td className="px-4 py-3">
                                    <img
                                        src={product.images?.[0]}
                                        alt={product.name}
                                        className="w-16 h-16 object-contain rounded"
                                    />
                                </td>
                                <td className="p-4">
                                    {product.name}
                                </td>

                                <td className="p-4">
                                    {product.category}
                                </td>

                                <td className="p-4">
                                    ₹{product.price}
                                </td>

                                <td className="p-4">
                                    {product.stock}
                                </td>

                                <td className="p-4">
                                    <button className="text-blue-600 mr-3">
                                        Edit
                                    </button>

                                    <button className="text-red-600">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminProducts;