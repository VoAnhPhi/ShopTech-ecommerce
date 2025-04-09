'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PencilIcon, TrashIcon, PlusIcon, ArrowLeftIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useSearchParams } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import Pagination from '../../../components/Pagination';

interface Product {
    id: number;
    ten_sp: string;
    gia: number;
    gia_km: number;
    ngay: string;
    slug: string;
    hinh: string;
    id_loai: number;
    luot_xem: number;
    hot: string;
    an_hien: number;
    mo_ta: string;
    tinh_chat: string;
    category: string;
    attributes: string;
}

interface PaginationData {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
}

// Format price
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(price);
};

export default function ProductsList() {
    const [productsList, setProductsList] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<PaginationData>({
        total: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 0,
    });

    const searchParams = useSearchParams();
    const page = Number(searchParams.get('page')) || 1;
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`http://localhost:3000/admin/product-da-xoa/page/${page}`);
                const data = await response.json();
                const productsList = data.products;
                const pagination = data.pagination;
                setProductsList(productsList);
                setPagination(pagination);
            } catch (error) {
                setError('Lỗi khi tải danh sách sản phẩm');
            }
        };
        fetchProducts();
        if (page) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }, [page]);

    const handleDelete = (id: number) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded shadow-md w-full max-w-sm text-center">
                            <h1 className="text-lg font-semibold mb-4">Xác nhận xóa?</h1>
                            <p className="mb-6 text-gray-600">Bạn có chắc muốn xóa vĩnh viễn sản phẩm này không?</p>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={async () => {
                                        try {
                                            const response = await fetch(`http://localhost:3000/admin/product/xoa-vinh-vien/${id}`, {
                                                method: 'DELETE'
                                            });
                                            if (!response.ok) throw new Error('Lỗi khi xóa sản phẩm');
                                            toast.success('Đã xóa sản phẩm thành công');
                                            setProductsList(prev => prev.filter(product => product.id !== id));
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
                )
            }
        })
    }

    const handleRestore = (id: number) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded shadow-md w-full max-w-sm text-center">
                            <h1 className="text-lg font-semibold mb-4">Xác nhận khôi phục?</h1>
                            <p className="mb-6 text-gray-600">Bạn có chắc muốn khôi phục sản phẩm này không?</p>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={async () => {
                                        try {
                                            const response = await fetch(`http://localhost:3000/admin/product/khoi-phuc/${id}`, {
                                                method: 'PATCH'
                                            });
                                            if (!response.ok) throw new Error('Lỗi khi khôi phục sản phẩm');
                                            toast.success('Đã khôi phục sản phẩm thành công');
                                            setProductsList(prev => prev.filter(product => product.id !== id));
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
                )
            }
        })
    }
    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Thùng rác sản phẩm</h1>
                <div className="flex space-x-4">
                    <Link
                        href={`/admin/products`}
                        className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center hover:bg-green-700"
                    >
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                        Quay lại
                    </Link>
                    <Link
                        href={`/admin/products/add`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Thêm sản phẩm
                    </Link>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Hình ảnh
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tên sản phẩm
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Danh mục
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Giá
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Giá khuyến mãi
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
                        {productsList.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {product.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <img src={product.hinh} alt={product.ten_sp} className="w-24 h-14 object-contain" />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {product.ten_sp}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {product.category}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatPrice(product.gia)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatPrice(product.gia_km)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${product.an_hien === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                    >
                                        {product.an_hien === 1 ? 'Ẩn' : 'Hiện'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                        <Link
                                            href={`/admin/products/edit/${product.id}`}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            <PencilIcon className="w-5 h-5" />
                                        </Link>
                                        <button onClick={() => handleRestore(product.id)} className="text-green-600 hover:text-green-900">
                                            <ArrowPathIcon className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination
                totalPages={pagination.totalPages}
                currentPage={pagination.currentPage}
                baseUrl="/admin/products"
            />
        </div>
    );
}