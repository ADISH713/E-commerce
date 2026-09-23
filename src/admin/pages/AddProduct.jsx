import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

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
        // Validate the form
        const isValid = validate();

        if (!isValid) {
            return;
        }

        // Prepare product object
        const productData = getProductData();

        try {
            // Save product to JSON Server
            const createdProduct = await createProduct(
                productData
            );

            // Update Redux immediately
            dispatch(addProduct(createdProduct));

            // Go back to products page
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