import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

import {
    softDeleteProduct,
    permanentlyDeleteProduct,
    createProduct,
    getProductById,
    updateProduct as updateProductService,
} from '../../services/productServices';

import {
    softDeleteProduct as softDeleteProductAction,
    deleteProduct,
    addProduct,
    updateProduct as updateProductAction,
} from '../../redux/slices/productSlice';

import { usePagination } from '../../hooks/usePagination';
import Pagination from '../components/Pagination';
import ProductForm from '../components/ProductForm';
import { useProductForm } from '../hooks/useProductForm';

function AdminProducts() {
    const dispatch = useDispatch();

    const [searchParams, setSearchParams] = useSearchParams();

    const categorySort = searchParams.get("category") || "all";
    
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [modalMode, setModalMode] = useState("add");

    const [editingProductId, setEditingProductId] = useState(null);

    const { items: products, isLoading, error } = useSelector(
    (state) => state.products
);
    const {
        formData,
        setFormData,
        errors,
        handleChange,
        resetForm,
        validate,
        getProductData,
    } = useProductForm();

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


    const openAddModal = () => {
        resetForm();

        setEditingProductId(null);
        setModalMode("add");
        setIsModalOpen(true);
    };

    const openEditModal = async (productId) => {
        try {
            const data = await getProductById(productId);

            setFormData({
                name: data.name || '',
                brand: data.brand || '',
                category: data.category || '',
                customCategory: '',
                grade: data.grade || '',
                price: data.price ?? '',
                stock: data.stock ?? '',

                images:
                    data.images && data.images.length > 0
                        ? data.images
                        : ['', '', '', ''],

                scale: data.specs?.scale || '',
                speed: data.specs?.speed || '',
                battery: data.specs?.battery || '',
                runtime: data.specs?.runtime || '',
                driveType: data.specs?.driveType || '',

                description: data.description || '',
            });

            setEditingProductId(productId);
            setModalMode("edit");
            setIsModalOpen(true);

        } catch (error) {
            console.error(
                "Failed to fetch product:",
                error
            );

            toast.error("Failed to load product");
        }
    };

    const handleSubmit = async () => {
        const isValid = validate();

        if (!isValid) {
            return;
        }

        const productData = getProductData();

        try {
            if (modalMode === "add") {

                const createdProduct =
                    await createProduct(productData);

                dispatch(addProduct(createdProduct));

                toast.success(
                    "Product added successfully!"
                );

            } else {

                const updatedProduct =
                    await updateProductService(
                        editingProductId,
                        productData
                    );

                dispatch(
                    updateProductAction(updatedProduct)
                );

                toast.success(
                    "Product updated successfully!"
                );
            }

            setIsModalOpen(false);
            resetForm();
            setEditingProductId(null);

        } catch (error) {
            console.error(
                "Failed to save product:",
                error
            );

            toast.error(
                "Failed to save product"
            );
        }
    };

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
        <div className="w-full min-w-0">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 sm:mb-8">

                <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                        Products
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Manage your TORQUE products
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

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
                        className="border border-gray-200 bg-white rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                    >
                        <option value="all">All Categories</option>
                        <option value="Off-Road Buggy">Off-Road Buggy</option>
                        <option value="Drift car">Drift Car</option>
                        <option value="Monster Truck">Monster Truck</option>
                        <option value="Rock Crawler">Rock Crawler</option>
                    </select>

                    <button
                        className="bg-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-orange-700 active:bg-orange-800 shadow-sm hover:shadow transition"
                        onClick={openAddModal}
                    >
                        + Add Product
                    </button>

                </div>
            </div>
            
            {/* Products table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

                <div className="overflow-x-auto scrollbar-none">

                    <table className="w-full min-w-[750px] text-sm">

                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-left">

                                <th className="px-4 sm:px-6 py-3.5 font-medium text-gray-500">
                                    Image
                                </th>

                                <th className="px-4 sm:px-6 py-3.5 font-medium text-gray-500">
                                    Name
                                </th>

                                <th className="px-4 sm:px-6 py-3.5 font-medium text-gray-500">
                                    Category
                                </th>

                                <th className="px-4 sm:px-6 py-3.5 font-medium text-gray-500">
                                    Price
                                </th>

                                <th className="px-4 sm:px-6 py-3.5 font-medium text-gray-500">
                                    Stock
                                </th>

                                <th className="px-4 sm:px-6 py-3.5 font-medium text-gray-500">
                                    Actions
                                </th>

                            </tr>
                        </thead>

                        <tbody>

                            {paginatedProducts.map((product) => (

                                <tr
                                    key={product.id}
                                    className="border-b border-gray-100 last:border-b-0 hover:bg-orange-50/40 transition"
                                >

                                    {/* Image */}
                                    <td className="px-4 sm:px-6 py-3.5">

                                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center overflow-hidden">

                                            <img
                                                src={product.images?.[0]}
                                                alt={product.name}
                                                className="w-full h-full object-contain"
                                            />

                                        </div>

                                    </td>

                                    {/* Name */}
                                    <td className="px-4 sm:px-6 py-3.5">

                                        <p className="font-medium text-gray-900 max-w-[220px]">
                                            {product.name}
                                        </p>

                                    </td>

                                    {/* Category */}
                                    <td className="px-4 sm:px-6 py-3.5">

                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-medium whitespace-nowrap">
                                            {product.category}
                                        </span>

                                    </td>

                                    {/* Price */}
                                    <td className="px-4 sm:px-6 py-3.5 font-medium text-gray-900 whitespace-nowrap">
                                        ₹{Number(product.price).toLocaleString('en-IN')}
                                    </td>

                                    {/* Stock */}
                                    <td className="px-4 sm:px-6 py-3.5">

                                        <span
                                            className={`font-medium ${
                                                product.stock === 0
                                                    ? 'text-red-600'
                                                    : product.stock <= 5
                                                    ? 'text-orange-600'
                                                    : 'text-gray-700'
                                            }`}
                                        >
                                            {product.stock}
                                        </span>

                                    </td>

                                    {/* Actions */}
                                    <td className="px-4 sm:px-6 py-3.5">

                                        <div className="flex items-center gap-3">

                                            <button
                                                onClick={() => openEditModal(product.id)}
                                                className="text-blue-600 hover:text-blue-700 font-medium transition"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(product)
                                                }
                                                className="text-red-500 hover:text-red-600 font-medium transition"
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

                {/* Empty state */}
                {paginatedProducts.length === 0 && (
                    <div className="px-4 sm:px-6 py-12 text-center">

                        <p className="text-sm text-gray-500">
                            No products found in this category.
                        </p>

                    </div>
                )}

            </div>
            
            {/* Pagination */}
            <div className="mt-5 sm:mt-6">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    goToPage={goToPage}
                    nextPage={nextPage}
                    previousPage={previousPage}
                />
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
                    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto scrollbar-none border border-orange-400">
                        {/* Modal Header */}
                        <div className="sticky top-0 z-10 bg-white border-b px-5 py-4 flex items-center justify-between">

                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {modalMode === "add"
                                        ? "Add Product"
                                        : "Edit Product"}
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    {modalMode === "add"
                                        ? "Add a new product to your store"
                                        : "Update the product information"}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setIsModalOpen(false);
                                    resetForm();
                                    setEditingProductId(null);
                                }}
                                className="text-gray-500 hover:text-gray-800 text-2xl leading-none"
                            >
                                ×
                            </button>

                        </div>

                        {/* Product Form */}
                        <div className="p-5">
                            <ProductForm
                                formData={formData}
                                errors={errors}
                                handleChange={handleChange}
                                onSubmit={handleSubmit}
                                submitText={
                                    modalMode === "add"
                                        ? "Add Product"
                                        : "Update Product"
                                }
                            />
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}

export default AdminProducts;