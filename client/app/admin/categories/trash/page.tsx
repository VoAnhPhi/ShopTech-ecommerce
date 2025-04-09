"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PencilIcon, TrashIcon, PlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { toast, ToastContainer } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';

interface Category {
    id: number;
    ten_loai: string;
    thu_tu: number;
    slug: string;
    product_count: number;
    an_hien: number;
    created_at: string;
    updated_at: string;
    deleted_at: string;
}

export default function TrashCategories() {
    const [categoriesList, setCategoriesList] = useState<Category[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:3000/admin/loai-da-xoa');
                const data = await response.json();
                console.log(data);
                setCategoriesList(data);
            } catch (error) {
                setError('Lỗi khi tải danh mục');
            }
        };
        fetchCategories();
    }, []);

    const handleDelete = (id: number) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded shadow-md w-full max-w-sm text-center">
                            <h1 className="text-lg font-semibold mb-4">Xác nhận xóa?</h1>
                            <p className="mb-6 text-gray-600">Bạn có chắc muốn xóa danh mục này vĩnh viễn không?</p>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={async () => {
                                        try {
                                            const response = await fetch(`http://localhost:3000/admin/loai/xoa-vinh-vien/${id}`, {
                                                method: 'DELETE'
                                            });
                                            if (!response.ok) throw new Error('Lỗi khi xóa danh mục');

                                            // Cập nhật danh sách sau khi xóa thành công
                                            setCategoriesList(prev => prev.filter(cat => cat.id !== id));
                                            toast.success("Đã xóa thành công");
                                        } catch (err: any) {
                                            toast.error(err.message || "Lỗi xóa");
                                        } finally {
                                            onClose();
                                        }
                                    }}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Xác nhận
                                </button>
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 border rounded hover:bg-gray-100"
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </div>
                );
            }
        });
    };

    const handleRestore = (id: number) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded shadow-md w-full max-w-sm text-center">
                            <h1 className="text-lg font-semibold mb-4">Xác nhận khôi phục?</h1>
                            <p className="mb-6 text-gray-600">Bạn có chắc muốn khôi phục danh mục này không?</p>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={async () => {
                                        try {
                                            const response = await fetch(`http://localhost:3000/admin/loai/khoi-phuc/${id}`, {
                                                method: 'PATCH'
                                            });
                                            if (!response.ok) throw new Error('Lỗi khi khôi phục danh mục');

                                            // Cập nhật danh sách sau khi xóa thành công
                                            setCategoriesList(prev => prev.filter(cat => cat.id !== id));
                                            toast.success("Đã khôi phục thành công");
                                        } catch (err: any) {
                                            toast.error(err.message || "Lỗi khôi phục");
                                        } finally {
                                            onClose();
                                        }
                                    }}
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    Xác nhận
                                </button>
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 border rounded hover:bg-gray-100"
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </div>
                );
            }
        });
    }

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Thùng rác danh mục</h1>
                    <Link
                        href="/admin/categories/add"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Thêm danh mục
                    </Link>
                </div>

                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tên danh mục
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Slug
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thứ tự hiển thị
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Số sản phẩm
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {categoriesList.map((category) => (
                                <tr key={category.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {category.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {category.ten_loai}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">
                                        {category.slug}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">
                                        {category.thu_tu}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {category.product_count}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${category.an_hien === 1 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                                        >
                                            {category.an_hien === 1 ? 'Hiện' : 'Ẩn'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <Link
                                                href={`/admin/categories/edit/${category.id}`}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                <PencilIcon className="w-5 h-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleRestore(category.id)}
                                                className="text-green-600 hover:text-green-900"
                                            >
                                                <ArrowPathIcon className="w-5 h-5" />
                                            </button>
                                            <button className="text-red-600 hover:text-red-900"
                                                onClick={() => handleDelete(category.id)}>
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}