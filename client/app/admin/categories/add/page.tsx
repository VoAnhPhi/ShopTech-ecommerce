'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
interface CategoryFormData {
    ten_loai: string;
    slug: string;
    thu_tu: number;
    an_hien: number;
}

export default function CategoryForm() {
    const router = useRouter();
    const [formData, setFormData] = useState<CategoryFormData>({
        ten_loai: '',
        slug: '',
        thu_tu: 0,
        an_hien: 0
    });


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3000/admin/loai`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error('Failed to submit form');
            }
            const data = await response.json();
            console.log(data);
            toast.success('Thêm danh mục thành công');
            setTimeout(() => {
                router.push('/admin/categories');
            }, 3000);
        } catch (error: any) {
            console.error('Error submitting form:', error);
            toast.error(error.message);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'thu_tu' || name === 'an_hien' ? Number(value) : value
        }));
    };


    return (
        <div className="container mx-auto">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Thêm danh mục mới
                </h1>
                <Link
                    href="/admin/categories"
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                    Quay lại
                </Link>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Tên danh mục
                        </label>
                        <input
                            type="text"
                            id="ten_loai"
                            name="ten_loai"
                            value={formData.ten_loai}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                            Slug
                        </label>
                        <input
                            type="text"
                            id="slug"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                            Thứ tự
                        </label>
                        <input
                            type="number"
                            id="thu_tu"
                            name="thu_tu"
                            value={formData.thu_tu}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                            Trạng thái
                        </label>
                        <select
                            id="an_hien"
                            name="an_hien"
                            value={formData.an_hien}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="1">Kích hoạt</option>
                            <option value="0">Vô hiệu</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <Link
                            href="/admin/categories"
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Hủy
                        </Link>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Thêm mới
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};