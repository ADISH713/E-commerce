import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createProduct } from '../../services/productServices';
import { addProduct } from '../../redux/slices/productSlice';
import { useNavigate } from 'react-router-dom';

function AddProduct() {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [images, setImages] = useState(['', '', '', '']);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validImages = images.filter(
            (image) => image.trim() !== ''
        );

        const newProduct = {
            name,
            category,
            price: Number(price),
            stock: Number(stock),
            images: validImages,
        };

        try {
            const createdProduct = await createProduct(newProduct);

            dispatch(addProduct(createdProduct));
            navigate('/admin/products');
            console.log(createdProduct);
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">
                Add Product
            </h2>

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
                        placeholder="Enter product name"
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
                        placeholder="Enter category"
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
                        placeholder="Enter price"
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
                        placeholder="Enter stock"
                    />
                </div>

                {/* Product Image */}
                <div className="mb-4">
                    <label className="block mb-2 font-medium">
                        Product Images
                    </label>

                    {images.map((image, index) => (
                        <input
                            key={index}
                            type="text"
                            value={image}
                            onChange={(e) => {
                                const updatedImages = [...images];
                                updatedImages[index] = e.target.value;
                                setImages(updatedImages);
                            }}
                            className="w-full border rounded-lg px-4 py-2 mb-2"
                            placeholder={`/images/image${index + 1}.jpg`}
                        />
                    ))}
                </div>

                <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-orange-600 text-white px-5 py-2 rounded-lg"
                >
                    Add Product
                </button>

            </div>
        </div>
    );
}

export default AddProduct;