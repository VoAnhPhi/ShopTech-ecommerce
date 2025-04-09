'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface ProductFormData {
    name: string;
    categoryId: string;
    price: string;
    stock: string;
    description: string;
    image: string;
    status: 'active' | 'inactive';
}

interface Category {
    id: string;
    name: string;
}

const ProductForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const isEditMode = !!id;

    // Mock categories data
    const categories: Category[] = [
        { id: '1', name: 'Điện thoại' },
        { id: '2', name: 'Laptop' },
        { id: '3', name: 'Máy tính bảng' },
        { id: '4', name: 'Phụ kiện' },
    ];

    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        categoryId: '',
        price: '',
        stock: '',
        description: '',
        image: '',
        status: 'active',
    });

    useEffect(() => {
        if (isEditMode) {
            // In a real app, you would fetch the product by ID from an API
            // For this example, we'll use mock data
            if (id === '1') {
                setFormData({
                    name: 'iPhone 14 Pro Max',
                    categoryId: '1',
                    price: '29990000',
                    stock: '34',
                    description: 'iPhone 14 Pro Max, 256GB, Deep Purple',
                    image: 'https://example.com/iphone14.jpg',
                    status: 'active',
                });
            } else if (id === '2') {
                setFormData({
                    name: 'Samsung Galaxy S23 Ultra',
                    categoryId: '1',
                    price: '25990000',
                    stock: '28',
                    description: 'Samsung Galaxy S23 Ultra, 256GB, Phantom Black',
                    image: 'https://example.com/s23.jpg',
                    status: 'active',
                });
            } else if (id === '3') {
                setFormData({
                    name: 'MacBook Pro 14"',
                    categoryId: '2',
                    price: '49990000',
                    stock: '12',
                    description: 'MacBook Pro 14", M2 Pro, 16GB RAM, 512GB SSD',
                    image: 'https://example.com/macbook.jpg',
                    status: 'active',
                });
            } else if (id === '4') {
                setFormData({
                    name: 'iPad Air',
                    categoryId: '3',
                    price: '16990000',
                    stock: '0',
                    description: 'iPad Air, M1, 64GB, Wi-Fi, Space Gray',
                    image: 'https://example.com/ipad.jpg',
                    status: 'inactive',
                });
            }
        }
    }, [id, isEditMode]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you would send the data to an API
        console.log('Submitted data:', formData);

        // Navigate back to the products list after submission
        router.push('/admin/products');
    };

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                    {isEditMode ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                </h1>
                <Link
                    href="/admin/products"
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                    Quay lại
                </Link>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="col-span-2">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Tên sản phẩm
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                                Danh mục
                            </label>
                            <select
                                id="categoryId"
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="">Chọn danh mục</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                Trạng thái
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="active">Còn hàng</option>
                                <option value="inactive">Hết hàng</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                Giá (VNĐ)
                            </label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                                min="0"
                            />
                        </div>

                        <div>
                            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                                Số lượng tồn kho
                            </label>
                            <input
                                type="number"
                                id="stock"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                                min="0"
                            />
                        </div>

                        <div className="col-span-2">
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                                URL Hình ảnh
                            </label>
                            <input
                                type="text"
                                id="image"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="col-span-2">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                Mô tả sản phẩm
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <Link
                            href="/admin/products"
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Hủy
                        </Link>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            {isEditMode ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm; 