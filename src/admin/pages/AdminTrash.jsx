import React from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    useQuery,
    useQueryClient,
    keepPreviousData,
} from '@tanstack/react-query';
import { IconRefresh, IconTrash } from '@tabler/icons-react';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

import {
    getAdminProducts,
    restoreProduct,
    permanentlyDeleteProduct,
} from '../../services/productServices';
import { getErrorMessage } from '../../utils/getErrorMessage';
import Pagination from '../components/Pagination';

const PAGE_SIZE = 10;

function AdminTrash() {
    const queryClient = useQueryClient();
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get('page')) || 1;

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['admin-products', { status: 'trash', page }],
        queryFn: () =>
            getAdminProducts({ status: 'trash', page, limit: PAGE_SIZE }),
        placeholderData: keepPreviousData,
    });

    const products = data?.products ?? [];
    const totalPages = data?.pages ?? 1;

    const goToPage = (target) => {
        setSearchParams((prev) => {
            const params = new URLSearchParams(prev);
            params.set('page', String(target));
            return params;
        });
    };

    const refreshProducts = () => {
        queryClient.invalidateQueries({ queryKey: ['admin-products'] });
        queryClient.invalidateQueries({ queryKey: ['categories'] });
        queryClient.invalidateQueries({ queryKey: ['products'] });
    };

    const handleRestore = async (productId) => {
        try {
            await restoreProduct(productId);
            refreshProducts();
            toast.success('Product restored');
        } catch (err) {
            toast.error(getErrorMessage(err, 'Failed to restore product'));
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

        if (!result.isConfirmed) return;

        try {
            await permanentlyDeleteProduct(productId);
            refreshProducts();
            toast.success('Product permanently deleted');
        } catch (err) {
            toast.error(getErrorMessage(err, 'Failed to delete product'));
        }
    };

    if (isLoading) return <p>Loading trash...</p>;
    if (isError) return <p className="text-red-500">{getErrorMessage(error)}</p>;

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6">Trash</h2>

            {products.length === 0 ? (
                <p className="text-gray-500">No deleted products.</p>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left p-4">Image</th>
                                <th className="text-left p-4">Product</th>
                                <th className="text-left p-4">Brand</th>
                                <th className="text-left p-4">Category</th>
                                <th className="text-left p-4">Price</th>
                                <th className="text-left p-4">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id} className="border-t">
                                    <td className="p-4">
                                        <img
                                            src={product.images?.[0]}
                                            alt={product.name}
                                            className="w-16 h-16 object-contain rounded"
                                        />
                                    </td>
                                    <td className="p-4 font-medium">{product.name}</td>
                                    <td className="p-4">{product.brand}</td>
                                    <td className="p-4">{product.category}</td>
                                    <td className="p-4">
                                        ₹{Number(product.price).toLocaleString('en-IN')}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => handleRestore(product.id)}
                                                className="flex items-center gap-1 text-green-600 hover:text-green-800"
                                            >
                                                <IconRefresh size={18} />
                                                Restore
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handlePermanentDelete(product.id)}
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

                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        goToPage={goToPage}
                        nextPage={() => page < totalPages && goToPage(page + 1)}
                        previousPage={() => page > 1 && goToPage(page - 1)}
                    />
                </div>
            )}
        </div>
    );
}

export default AdminTrash;