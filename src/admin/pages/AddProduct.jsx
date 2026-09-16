import React, { useState } from 'react';

function AddProduct() {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');

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

                <button
                    className="bg-orange-600 text-white px-5 py-2 rounded-lg"
                >
                    Add Product
                </button>

            </div>
        </div>
    );
}

export default AddProduct;