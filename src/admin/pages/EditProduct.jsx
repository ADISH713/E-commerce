import React, { useEffect, useState } from 'react';
import {useNavigate, useParams } from 'react-router-dom';
import {getProductById,updateProduct as updateProductService} from '../../services/productServices';
import { useDispatch } from 'react-redux';
import { updateProduct } from '../../redux/slices/productSlice';

function EditProduct() {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductById(id);

                setProduct(data);
                setName(data.name);
                setCategory(data.category);
                setPrice(data.price);
                setStock(data.stock);

            } catch (error) {
                console.error(error);
            }
        };

        fetchProduct();
        }, [id]);

        if (!product) {
            return <p>Loading product...</p>;
        }

        const handleSubmit = async (e) => {
            e.preventDefault();

            const updatedProduct = {
                name,
                category,
                price: Number(price),
                stock: Number(stock),
                images: product.images,
            };

            try {
                const updatedProductData = await updateProductService(
                id,
                updatedProduct
            );

            dispatch(updateProduct(updatedProductData));
            navigate('/admin/products');
            } catch (error) {
                console.error(error);
            }
        };

    return (
        <div className="bg-white p-6 rounded-lg shadow max-w-2xl">

            {/* Product Name */}
            <div className="mb-4">
                <label className="block mb-2 font-medium">
                    Product Name
                </label>

                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border rounded-lg px-4 py-2"
                />
            </div>

            {/* Category */}
            <div className="mb-4">
                <label className="block mb-2 font-medium">
                    Category
                </label>

                <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border rounded-lg px-4 py-2"
                />
            </div>

            {/* Price */}
            <div className="mb-4">
                <label className="block mb-2 font-medium">
                    Price
                </label>

                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full border rounded-lg px-4 py-2"
                />
            </div>

            {/* Stock */}
            <div className="mb-4">
                <label className="block mb-2 font-medium">
                    Stock
                </label>

                <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full border rounded-lg px-4 py-2"
                />
            </div>
            <button
                type="button"
                onClick={handleSubmit}
                className="bg-orange-600 text-white px-5 py-2 rounded-lg"
            >
                Update Product
            </button>

        </div>
    );
}

export default EditProduct;