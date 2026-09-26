import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

import ProductForm from "../components/ProductForm";
import { useProductForm } from "../hooks/useProductForm";

import { createProduct } from "../../services/productServices";
import { addProduct } from "../../redux/slices/productSlice";

function AddProduct() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        formData,
        errors,
        handleChange,
        validate,
        getProductData,
    } = useProductForm();

    const handleSubmit = async () => {
        const isValid = validate();

        if (!isValid) {
            return;
        }

        const productData = getProductData();

        try {
            const createdProduct = await createProduct(
                productData
            );

            dispatch(addProduct(createdProduct));
            toast.success('Product added successfully!');
            
            navigate("/admin/products");
        } catch (error) {
            console.error(
                "Failed to create product:",
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
            submitText="Add Product"
        />
    );
}

export default AddProduct;