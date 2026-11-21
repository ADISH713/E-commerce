import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    useQuery,
    useQueryClient,
    keepPreviousData,
} from '@tanstack/react-query';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

import {
    getAdminProducts,
    getProductById,
    createProduct,
    updateProduct,
    softDeleteProduct,
} from '../../services/productServices';

import { getErrorMessage } from '../../utils/getErrorMessage';
import { useCategories } from '../../hooks/useCategories';
import Pagination from '../components/Pagination';
import ProductForm from '../components/ProductForm';
import { useProductForm } from '../hooks/useProductForm';

const PAGE_SIZE = 5;

function AdminProducts() {
    const queryClient = useQueryClient();
    const [searchParams, setSearchParams] = useSearchParams();

    const categorySort = searchParams.get('category') || 'all';
    const page = Number(searchParams.get('page')) || 1;
    const urlSearch = searchParams.get('search') || '';

    const [searchInput, setSearchInput] = useState(urlSearch);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [editingProductId, setEditingProductId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const { data: categories = [] } = useCategories();

    const {
        formData,
        setFormData,
        errors,
        handleChange,
        resetForm,
        validate,
        getProductData,
    } = useProductForm();

    // wait 400ms after typing, then put the search in the URL
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput.trim() === urlSearch) return;

            setSearchParams((prev) => {
                const params = new URLSearchParams(prev);
                if (searchInput.trim()) params.set('search', searchInput.trim());
                else params.delete('search');
                params.set('page', '1');
                return params;
            });
        }, 400);

        return () => clearTimeout(timer);
    }, [searchInput, urlSearch, setSearchParams]);

    const {
        data,
        isLoading,
        isError,
        error: loadError,
    } = useQuery({
        queryKey: ['admin-products', { page, category: categorySort, search: urlSearch }],
        queryFn: () =>
            getAdminProducts({
                status: 'active',
                page,
                limit: PAGE_SIZE,
                category: categorySort === 'all' ? undefined : categorySort,
                search: urlSearch || undefined,
            }),
        placeholderData: keepPreviousData,
    });

    const products = data?.products ?? [];
    const totalPages = data?.pages ?? 1;

    // if the last item of the last page was removed, step back one page
    useEffect(() => {
        if (data && data.pages > 0 && page > data.pages) {
            setSearchParams((prev) => {
                const params = new URLSearchParams(prev);
                params.set('page', String(data.pages));
                return params;
            });
        }
    }, [data, page, setSearchParams]);

    const goToPage = (target) => {
        setSearchParams((prev) => {
            const params = new URLSearchParams(prev);
            params.set('page', String(target));
            return params;
        });
    };
    const nextPage = () => page < totalPages && goToPage(page + 1);
    const previousPage = () => page > 1 && goToPage(page - 1);

    const refreshProducts = () => {
        queryClient.invalidateQueries({ queryKey: ['admin-products'] });
        queryClient.invalidateQueries({ queryKey: ['categories'] });
        queryClient.invalidateQueries({ queryKey: ['products'] });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        resetForm();
        setEditingProductId(null);
    };

    const openAddModal = () => {
        resetForm();
        setEditingProductId(null);
        setModalMode('add');
        setIsModalOpen(true);
    };

    const openEditModal = async (productId) => {
        try {
            const product = await getProductById(productId);

            setFormData({
                name: product.name || '',
                brand: product.brand || '',
                category: product.category || '',
                customCategory: '',
                grade: product.grade || '',
                price: product.price ?? '',
                stock: product.stock ?? '',
                images:
                    product.images && product.images.length > 0
                        ? product.images
                        : ['', '', '', ''],
                scale: product.specs?.scale || '',
                speed: product.specs?.speed || '',
                battery: product.specs?.battery || '',
                runtime: product.specs?.runtime || '',
                driveType: product.specs?.driveType || '',
                description: product.description || '',
            });

            setEditingProductId(productId);
            setModalMode('edit');
            setIsModalOpen(true);
        } catch (error) {
            toast.error(getErrorMessage(error, 'Failed to load product'));
        }
    };

    const handleSubmit = async () => {
        if (isSaving || !validate()) return;

        const productData = getProductData();
        setIsSaving(true);

        try {
            if (modalMode === 'add') {
                await createProduct(productData);
                toast.success('Product added successfully!');
            } else {
                await updateProduct(editingProductId, productData);
                toast.success('Product updated successfully!');
            }

            refreshProducts();
            closeModal();
        } catch (error) {
            toast.error(getErrorMessage(error, 'Failed to save product'));
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (product) => {
        const result = await Swal.fire({
            title: 'Move to trash?',
            text: `"${product.name}" will be hidden from the store. You can restore it from Trash.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Move to trash',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#f97316',
            cancelButtonColor: '#6b7280',
        });

        if (!result.isConfirmed) return;

        try {
            await softDeleteProduct(product.id);
            refreshProducts();
            toast.success('Product moved to trash');
        } catch (error) {
            toast.error(getErrorMessage(error, 'Failed to delete product'));
        }
    };

    if (isLoading) {
        return <p>Loading products...</p>;
    }

    if (isError) {
        return <p className="text-red-500">{getErrorMessage(loadError)}</p>;
    }
    
   
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
                
                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search products..."
                    className="border border-gray-200 bg-white rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                />
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
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
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

                            {products.map((product) => (

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
                {products.length === 0 && (
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
                    currentPage={page}
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