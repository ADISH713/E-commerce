import React from 'react';

function ProductForm({
    formData,
    errors,
    handleChange,
    onSubmit,
    submitText = 'Save Product',
}) {
    const {
        name,
        brand,
        category,
        customCategory,
        grade,
        price,
        stock,
        images,
        scale,
        speed,
        battery,
        runtime,
        driveType,
        description,
    } = formData;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">
                {submitText}
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
                        onChange={(e) =>
                            handleChange('name', e.target.value)
                        }
                        className="w-full border rounded-lg px-4 py-2"
                        placeholder="Enter product name"
                    />

                    {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.name}
                        </p>
                    )}
                </div>

                {/* Brand */}
                <div className="mb-4">
                    <label className="block mb-2 font-medium">
                        Brand
                    </label>

                    <input
                        type="text"
                        value={brand}
                        onChange={(e) =>
                            handleChange('brand', e.target.value)
                        }
                        className="w-full border rounded-lg px-4 py-2"
                        placeholder="Enter brand"
                    />

                    {errors.brand && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.brand}
                        </p>
                    )}
                </div>

                {/* Category */}
                <div className="mb-4">
                    <label className="block mb-2 font-medium">
                        Category
                    </label>

                    <select
                        value={category}
                        onChange={(e) =>
                            handleChange('category', e.target.value)
                        }
                        className="w-full border rounded-lg px-4 py-2"
                    >
                        <option value="">Select category</option>
                        <option value="Off-Road Buggy">
                            Off-Road Buggy
                        </option>
                        <option value="Drift Car">
                            Drift Car
                        </option>
                        <option value="Monster Truck">
                            Monster Truck
                        </option>
                        <option value="Rock Crawler">
                            Rock Crawler
                        </option>
                        <option value="Other">
                            Other
                        </option>
                    </select>

                    {errors.category && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.category}
                        </p>
                    )}

                    {category === 'Other' && (
                        <>
                            <input
                                type="text"
                                value={customCategory}
                                onChange={(e) =>
                                    handleChange(
                                        'customCategory',
                                        e.target.value
                                    )
                                }
                                className="w-full border rounded-lg px-4 py-2 mt-2"
                                placeholder="Enter custom category"
                            />

                            {errors.customCategory && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.customCategory}
                                </p>
                            )}
                        </>
                    )}
                </div>

                {/* Grade */}
                <div className="mb-4">
                    <label className="block mb-2 font-medium">
                        Grade
                    </label>

                    <select
                        value={grade}
                        onChange={(e) =>
                            handleChange('grade', e.target.value)
                        }
                        className="w-full border rounded-lg px-4 py-2"
                    >
                        <option value="">Select grade</option>
                        <option value="toy">Toy</option>
                        <option value="hobby">Hobby</option>
                    </select>

                    {errors.grade && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.grade}
                        </p>
                    )}
                </div>

                {/* Price */}
                <div className="mb-4">
                    <label className="block mb-2 font-medium">
                        Price
                    </label>

                    <input
                        type="number"
                        value={price}
                        onChange={(e) =>
                            handleChange('price', e.target.value)
                        }
                        className="w-full border rounded-lg px-4 py-2"
                        placeholder="Enter price"
                    />

                    {errors.price && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.price}
                        </p>
                    )}
                </div>

                {/* Stock */}
                <div className="mb-4">
                    <label className="block mb-2 font-medium">
                        Stock
                    </label>

                    <input
                        type="number"
                        value={stock}
                        onChange={(e) =>
                            handleChange('stock', e.target.value)
                        }
                        className="w-full border rounded-lg px-4 py-2"
                        placeholder="Enter stock"
                    />

                    {errors.stock && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.stock}
                        </p>
                    )}
                </div>

                {/* Images */}
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

                                updatedImages[index] =
                                    e.target.value;

                                handleChange(
                                    'images',
                                    updatedImages
                                );
                            }}
                            className="w-full border rounded-lg px-4 py-2 mb-2"
                            placeholder={`/images/image${index + 1}.jpg`}
                        />
                    ))}

                    {errors.images && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.images}
                        </p>
                    )}
                </div>

                {/* Specifications */}
                <div className="border-t pt-6 mt-6">
                    <h3 className="text-lg font-semibold mb-4">
                        Specifications
                    </h3>

                    {/* Scale */}
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">
                            Scale
                        </label>

                        <input
                            type="text"
                            value={scale}
                            onChange={(e) =>
                                handleChange(
                                    'scale',
                                    e.target.value
                                )
                            }
                            className="w-full border rounded-lg px-4 py-2"
                            placeholder="Example: 1:10"
                        />
                        {errors.scale && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.scale}
                            </p>
                        )}
                    </div>

                    {/* Speed */}
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">
                            Top Speed
                        </label>

                        <input
                            type="text"
                            value={speed}
                            onChange={(e) =>
                                handleChange(
                                    'speed',
                                    e.target.value
                                )
                            }
                            className="w-full border rounded-lg px-4 py-2"
                            placeholder="Example: 45 km/h"
                        />

                        {errors.speed && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.speed}
                            </p>
                        )}
                    </div>

                    {/* Battery */}
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">
                            Battery
                        </label>

                        <input
                            type="text"
                            value={battery}
                            onChange={(e) =>
                                handleChange(
                                    'battery',
                                    e.target.value
                                )
                            }
                            className="w-full border rounded-lg px-4 py-2"
                            placeholder="Example: 7.4V 1500mAh Li-ion"
                        />
                         
                        {errors.battery && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.batery}
                            </p>
                        )}
                    </div>

                    {/* Runtime */}
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">
                            Runtime
                        </label>

                        <input
                            type="text"
                            value={runtime}
                            onChange={(e) =>
                                handleChange(
                                    'runtime',
                                    e.target.value
                                )
                            }
                            className="w-full border rounded-lg px-4 py-2"
                            placeholder="Example: 20 minutes"
                        />
                         
                        {errors.runtime && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.runtime}
                            </p>
                        )}
                    </div>

                    {/* Drive Type */}
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">
                            Drive Type
                        </label>

                        <input
                            type="text"
                            value={driveType}
                            onChange={(e) =>
                                handleChange(
                                    'driveType',
                                    e.target.value
                                )
                            }
                            className="w-full border rounded-lg px-4 py-2"
                            placeholder="Example: 4WD"
                        />
                         
                        {errors.driveType && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.driveType}
                            </p>
                        )}
                    </div>
                </div>

                {/* Description */}
                <div className="mb-6 mt-6">
                    <label className="block mb-2 font-medium">
                        Description
                    </label>

                    <textarea
                        value={description}
                        onChange={(e) =>
                            handleChange(
                                'description',
                                e.target.value
                            )
                        }
                        rows={5}
                        className="w-full border rounded-lg px-4 py-2"
                        placeholder="Enter product description"
                    />

                    {errors.description && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.description}
                        </p>
                    )}
                </div>

                <button
                    type="button"
                    onClick={onSubmit}
                    className="bg-orange-600 text-white px-5 py-2 rounded-lg"
                >
                    {submitText}
                </button>

            </div>
        </div>
    );
}

export default ProductForm;