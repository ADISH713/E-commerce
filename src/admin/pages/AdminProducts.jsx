import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    softDeleteProduct,
    permanentlyDeleteProduct,
    updateProduct as updateProductService,
} from '../../services/productServices';
import {setProducts,setLoading,setError,softDeleteProduct as softDeleteProductAction,deleteProduct, restoreProduct as restoreProductAction,updateProduct as updateProductAction,} from '../../redux/slices/productSlice';

function AdminProducts() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 5;

    const {items: products,isLoading,error,} = useSelector((state) => state.products);

    const activeProducts = products.filter(
        (product) => !product.deleted
    );

    const deletedProducts = products.filter(
        (product) => product.deleted
    );

    const totalPages = Math.ceil(
        activeProducts.length / productsPerPage
    );

    const startIndex = (currentPage - 1) * productsPerPage;

    const paginatedProducts = activeProducts.slice(
        startIndex,
        startIndex + productsPerPage
    );

    

    if (isLoading) {
        return <p>Loading products...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }
    const handleSoftDelete = async (productId) => {
        try {
            const updatedProduct = await softDeleteProduct(productId);

            dispatch(softDeleteProductAction(updatedProduct.id));
        } catch (error) {
            console.error(error);
        }
    };

    const handlePermanentDelete = async (productId) => {
        const confirmed = window.confirm(
            'Are you sure you want to permanently delete this product?'
        );

        if (!confirmed) {
            return;
        }

        try {
            await permanentlyDeleteProduct(productId);

            dispatch(deleteProduct(productId));
        } catch (error) {
            console.error(error);
        }
    };
   const handleRestore = async (productId) => {
    try {
        const restoredProduct = await updateProductService(
            productId,
            { deleted: false }
        );

        dispatch(restoreProductAction(restoredProduct.id));
    } catch (error) {
        console.error(error);
    }
};
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                    Products
                </h2>

                <button className="bg-orange-600 text-white px-4 py-2 rounded-lg"
                onClick={() => navigate('/admin/products/add')}>
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
                                        onClick={() => handleSoftDelete(product.id)}
                                        className="text-red-600"
                                    >
                                       Soft Delete
                                    </button>
                                    <button
                                        onClick={() => handlePermanentDelete(product.id)}
                                        className="text-red-600"
                                    >
                                        Permanent Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
            </div>
            {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">

            <button
                onClick={() =>
                    setCurrentPage((page) => page - 1)
                }
                disabled={currentPage === 1}
                className="px-3 py-2 border rounded disabled:opacity-50"
            >
                Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
                <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-3 py-2 border rounded ${
                        currentPage === index + 1
                            ? "bg-orange-600 text-white"
                            : ""
                    }`}
                >
                    {index + 1}
                </button>
            ))}

            <button
                onClick={() =>
                    setCurrentPage((page) => page + 1)
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 border rounded disabled:opacity-50"
            >
                Next
            </button>

        </div>
    )}

            {/* Trash */}
<div className="mt-10">
    <h2 className="text-2xl font-bold mb-4">
        🗑 Trash
    </h2>

    {deletedProducts.length === 0 ? (
        <p className="text-gray-500">
            No deleted products.
        </p>
    ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b">
                        <th className="text-left p-4">Image</th>
                        <th className="text-left p-4">Name</th>
                        <th className="text-left p-4">Category</th>
                        <th className="text-left p-4">Price</th>
                        <th className="text-left p-4">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {deletedProducts.map((product) => (
                        <tr key={product.id} className="border-b">
                            <td className="p-4">
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
                                <button
                                    onClick={() =>
                                        handleRestore(product.id)
                                    }
                                    className="text-green-600 mr-4"
                                >
                                    Restore
                                </button>

                                <button
                                    onClick={() =>
                                        handlePermanentDelete(product.id)
                                    }
                                    className="text-red-600"
                                >
                                    Permanent Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )}
</div>
        </div>
    );
}

export default AdminProducts;