import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconRefresh, IconTrash } from '@tabler/icons-react';
import Swal from 'sweetalert2';

import {
    updateProduct as updateProductService,
    permanentlyDeleteProduct,
} from '../../services/productServices';

import {
    restoreProduct as restoreProductAction,
    deleteProduct,
} from '../../redux/slices/productSlice';

function AdminTrash() {
    const dispatch = useDispatch();

    const { items: products } = useSelector(
        (state) => state.products
    );

    const deletedProducts = products.filter(
        (product) => product.deleted === true
    );

    const handleRestore = async (productId) => {
        try {
            const restoredProduct = await updateProductService(
                productId,
                { deleted: false }
            );

            dispatch(
                restoreProductAction(restoredProduct.id)
            );

            Swal.fire({
                title: 'Restored!',
                text: 'Product has been restored.',
                icon: 'success',
                confirmButtonColor: '#f97316',
            });

        } catch (error) {
            console.error(
                'Failed to restore product:',
                error
            );
        }
    };

    const handlePermanentDelete = async (productId) => {
        const result = await Swal.fire({
            title: 'Permanently delete?',
            text: 'This product cannot be recovered after permanent deletion.',
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete permanently',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#dc2626',
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            await permanentlyDeleteProduct(productId);

            dispatch(deleteProduct(productId));

            Swal.fire({
                title: 'Deleted!',
                text: 'Product permanently deleted.',
                icon: 'success',
                confirmButtonColor: '#f97316',
            });

        } catch (error) {
            console.error(
                'Failed to permanently delete product:',
                error
            );
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6">
                Trash
            </h2>

            {deletedProducts.length === 0 ? (
                <p className="text-gray-500">
                    No deleted products.
                </p>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left p-4">
                                    Image
                                </th>

                                <th className="text-left p-4">
                                    Product
                                </th>

                                <th className="text-left p-4">
                                    Brand
                                </th>

                                <th className="text-left p-4">
                                    Category
                                </th>

                                <th className="text-left p-4">
                                    Price
                                </th>

                                <th className="text-left p-4">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {deletedProducts.map((product) => (
                                <tr
                                    key={product.id}
                                    className="border-t"
                                >
                                    {/* Image */}
                                    <td className="p-4">
                                        <img
                                            src={product.images?.[0]}
                                            alt={product.name}
                                            className="w-16 h-16 object-contain rounded"
                                        />
                                    </td>

                                    {/* Product */}
                                    <td className="p-4 font-medium">
                                        {product.name}
                                    </td>

                                    {/* Brand */}
                                    <td className="p-4">
                                        {product.brand}
                                    </td>

                                    {/* Category */}
                                    <td className="p-4">
                                        {product.category}
                                    </td>

                                    {/* Price */}
                                    <td className="p-4">
                                        ₹{product.price}
                                    </td>

                                    {/* Actions */}
                                    <td className="p-4">
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() =>
                                                    handleRestore(product.id)
                                                }
                                                className="flex items-center gap-1 text-green-600 hover:text-green-800"
                                            >
                                                <IconRefresh size={18} />
                                                Restore
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handlePermanentDelete(
                                                        product.id
                                                    )
                                                }
                                                className="flex items-center gap-1 text-red-600 hover:text-red-800"
                                            >
                                                <IconTrash size={18} />
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default AdminTrash;