import React, { useState} from 'react';
import { useNavigate,useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    softDeleteProduct,
    permanentlyDeleteProduct,
    updateProduct as updateProductService,
} from '../../services/productServices';
import {softDeleteProduct as softDeleteProductAction,deleteProduct, restoreProduct as restoreProductAction,updateProduct as updateProductAction,} from '../../redux/slices/productSlice';
import Swal from 'sweetalert2';
import { usePagination } from '../../hooks/usePagination';
import Pagination from '../components/Pagination';

function AdminProducts() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const categorySort = searchParams.get("category") || "all";
    const {items: products,isLoading,error,} = useSelector((state) => state.products);


    const activeProducts = products.filter(
        (product) => !product.deleted
        );

    const filteredProducts = activeProducts.filter((product) =>
        categorySort === "all"
            ? true
            : product.category === categorySort
    );
     

        const {
        currentPage,
        totalPages,
        paginatedItems: paginatedProducts,
        goToPage,
        nextPage,
        previousPage,
    } = usePagination(filteredProducts, 5);


    

    if (isLoading) {
        return <p>Loading products...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }
   
    const handleDelete = async (product) => {
        const result = await Swal.fire({
            title: 'Delete Product',
            text: 'How do you want to delete this product?',
            icon: 'warning',
            showCancelButton: true,
            showDenyButton: true,

            confirmButtonText: 'Soft Delete',
            denyButtonText: 'Permanent Delete',
            cancelButtonText: 'Cancel',

            confirmButtonColor: '#f97316',
            denyButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
        });

        if (result.isConfirmed) {
            
            try {
                const updatedProduct = await softDeleteProduct(product.id);

                dispatch(
                    softDeleteProductAction(updatedProduct.id)
                );

                Swal.fire({
                    title: 'Deleted',
                    text: 'Product moved to trash.',
                    icon: 'success',
                    confirmButtonColor: '#f97316',
                });
            } catch (error) {
                console.error('Failed to soft delete product:', error);
            }
        }

        if (result.isDenied) {
            
            const confirmPermanent = await Swal.fire({
                title: 'Permanently delete?',
                text: 'This product cannot be recovered after permanent deletion.',
                icon: 'error',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete permanently',
                cancelButtonText: 'Cancel',
                confirmButtonColor: '#dc2626',
            });

            if (!confirmPermanent.isConfirmed) return;

            try {
                await permanentlyDeleteProduct(product.id);

                dispatch(deleteProduct(product.id));

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
        }
    };
    
   
return (
        <div>        

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
    <h2 className="text-2xl font-bold">
        Products
    </h2>

    <div className="flex items-center gap-3">
       
        <select
            value={categorySort}
            onChange={(e) => {
                const params = new URLSearchParams(searchParams);

                if (e.target.value === "all") {
                    params.delete("category");
                } else {
                    params.set("category", e.target.value);
                }

                params.set("page", "1");
                setSearchParams(params);
            }}
            className="border border-orange-400 rounded-md px-3 py-2"
        >
            <option value="all">All Categories</option>
            <option value="Off-Road Buggy">Off-Road Buggy</option>
            <option value="Drift car">Drift Car</option>
            <option value="Monster Truck">Monster Truck</option>
            <option value="Rock Crawler">Rock Crawler</option>
        </select>

        <button
            className="bg-orange-600 text-white px-4 py-2 rounded-lg"
            onClick={() => navigate('/admin/products/add')}
        >
            Add Product
        </button>
    </div>
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
                        {paginatedProducts.map((product) => (
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
                                    
                                    <button
                                        onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                                        className="text-blue-600 mr-3"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDelete(product)}
                                        className="text-red-500 hover:text-red-700 transition"
                                    >
                                        Delete
                                    </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
            </div>
            
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                goToPage={goToPage}
                nextPage={nextPage}
                previousPage={previousPage}
            />
        </div>
    );
}

export default AdminProducts;