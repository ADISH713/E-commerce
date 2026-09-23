import { useState } from "react";

export const useProductForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        brand: "",
        category: "",
        customCategory: "",
        grade: "",
        price: "",
        stock: "",
        images: ["", "", "", ""],
        scale: "",
        speed: "",
        battery: "",
        runtime: "",
        driveType: "",
        description: "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Product name is required";
        }

        if (!formData.brand.trim()) {
            newErrors.brand = "Brand is required";
        }

        if (!formData.category) {
            newErrors.category = "Please select a category";
        }

        if (
            formData.category === "Other" &&
            !formData.customCategory.trim()
        ) {
            newErrors.customCategory =
                "Please enter a custom category";
        }

        if (!formData.grade) {
            newErrors.grade = "Please select a grade";
        }

        if (!formData.price || Number(formData.price) <= 0) {
            newErrors.price =
                "Price must be greater than 0";
        }

        if (
            formData.stock === "" ||
            Number(formData.stock) < 0
        ) {
            newErrors.stock =
                "Stock cannot be negative";
        }

        const validImages = formData.images.filter(
            (image) => image.trim() !== ""
        );

        if (validImages.length === 0) {
            newErrors.images =
                "At least one product image is required";
        }

        if (!formData.scale.trim()) {
            newErrors.scale = "Scale is required";
        }

        if (!formData.speed.trim()) {
            newErrors.speed = "Speed is required";
        }

        if (!formData.battery.trim()) {
            newErrors.battery = "Battery is required";
        }

        if (!formData.runtime.trim()) {
            newErrors.runtime = "Runtime is required";
        }

        if (!formData.driveType.trim()) {
            newErrors.driveType =
                "Drive type is required";
        }

        if (!formData.description.trim()) {
            newErrors.description =
                "Description is required";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const getProductData = () => {
        const validImages = formData.images.filter(
            (image) => image.trim() !== ""
        );

        return {
            name: formData.name.trim(),
            brand: formData.brand.trim(),

            category:
                formData.category === "Other"
                    ? formData.customCategory.trim()
                    : formData.category,

            grade: formData.grade,
            price: Number(formData.price),
            stock: Number(formData.stock),

            images: validImages,

            specs: {
                scale: formData.scale.trim(),
                speed: formData.speed.trim(),
                battery: formData.battery.trim(),
                runtime: formData.runtime.trim(),
                driveType: formData.driveType.trim(),
            },

            description: formData.description.trim(),
        };
    };

    return {
        formData,
        setFormData,
        errors,
        setErrors,
        handleChange,
        validate,
        getProductData,
    };
};