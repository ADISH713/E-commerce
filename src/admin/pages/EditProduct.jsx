import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById, updateProduct as updateProductService } from '../../services/productServices';
import { useDispatch } from 'react-redux';
import { updateProduct } from '../../redux/slices/productSlice';

import ProductForm from '../components/ProductForm';
import { useProductForm } from '../hooks/useProductForm';

function EditProduct() {
    const { id } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        formData,
        setFormData,
        errors,
        handleChange,
        validate,
        getProductData,
    } = useProductForm();

    

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductById(id);

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
            } catch (error) {
                console.error(
                    'Failed to fetch product:',
                    error
                );
            }
        };

        fetchProduct();
    }, [id, setFormData]);

    const handleSubmit = async () => {
        const isValid = validate();

        if (!isValid) {
            return;
        }

        const productData = getProductData();

        try {
            const updatedProductData =
                await updateProductService(
                    id,
                    productData
                );

            dispatch(
                updateProduct(updatedProductData)
            );

            navigate('/admin/products');
        } catch (error) {
            console.error(
                'Failed to update product:',
                error
            );
        }
    };

    return (
        <ProductForm
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            onSubmit={handleSubmit}
            submitText="Update Product"
        />
    );
}

export default EditProduct;