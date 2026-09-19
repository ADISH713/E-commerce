import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createProduct } from '../../services/productServices';
import { addProduct } from '../../redux/slices/productSlice';
import { useNavigate } from 'react-router-dom';

function AddProduct() {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [customCategory, setCustomCategory] = useState('');
    const [grade, setGrade] = useState('');
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
            category: category === 'Other' ? customCategory : category,
            grade,
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

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full border rounded-lg px-4 py-2"
                    >
                        <option value="">Select category</option>
                        <option value="Off-Road Buggy">Off-Road Buggy</option>
                        <option value="Drift Car">Drift Car</option>
                        <option value="Monster Truck">Monster Truck</option>
                        <option value="Rock Crawler">Rock Crawler</option>
                        <option value="Other">Other</option>
                    </select>

                    {category === 'Other' && (
                        <input
                            type="text"
                            value={customCategory}
                            onChange={(e) => setCustomCategory(e.target.value)}
                            className="w-full border rounded-lg px-4 py-2 mt-2"
                            placeholder="Enter custom category"
                        />
                    )}
                </div>
                    
                    {/* Grade */}
                <div className="mb-4">
                    <label className="block mb-2 font-medium">
                        Grade
                    </label>

                    <select
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        className="w-full border rounded-lg px-4 py-2"
                    >
                        <option value="">Select grade</option>
                        <option value="toy">Toy</option>
                        <option value="hobby">Hobby</option>
                    </select>
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