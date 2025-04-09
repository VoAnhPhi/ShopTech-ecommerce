'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

interface News {
    id: number;
    an_hien: number;
    category: string;
    hinh: string;
    id_loai: number;
    luot_xem: number;
    mo_ta: string;
    ngay: string;
    noi_dung: string;
    slug: string;
    tieu_de: string;
}

interface NewsCategory {
    id: number;
    ten_loai: string;
}

interface NewsWithCategory {
    id: number;
    title: string;
    summary: string;
    createdAt: string;
    status: 'published' | 'draft';
    ten_loai: string;
}

interface NewsList {
    news: News[];
    total: number;
    totalPages: number;
}

export default function NewsList() {
    const [newsList, setNewsList] = useState<News[]>([]);
    const [newsCategory, setNewsCategory] = useState<NewsCategory[]>([]);
    const [newsWithCategory, setNewsWithCategory] = useState<NewsWithCategory[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(12);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch(`http://localhost:3000/admin/news/page/${page}`);
                const data = await response.json();
                setNewsList(data.news);
                console.log(data.news);
                setNewsCategory(data.news_category);
                setNewsWithCategory(data.news_with_category);
            } catch (error) {
                setError('Lỗi khi tải tin tức');
            }
        };
        fetchNews();
    }, []);

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Quản lý tin tức</h1>
                <Link
                    href="/admin/news/add"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Thêm tin tức
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
                                Tiêu đề
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tóm tắt
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ngày tạo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Danh mục
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
                        {newsList.map((news) => (
                            <tr key={news.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {news.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {news.tieu_de}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">
                                    {news.mo_ta}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {news.ngay}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {news.category}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${news.an_hien === 1 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                                    >
                                        {news.an_hien === 1 ? 'Đã xuất bản' : 'Bản nháp'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                        <Link
                                            href={`/admin/news/edit/${news.id}`}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            <PencilIcon className="w-5 h-5" />
                                        </Link>
                                        <button className="text-red-600 hover:text-red-900">
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
    );
};