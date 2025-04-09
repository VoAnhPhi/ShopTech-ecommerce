'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface NewsFormData {
    title: string;
    summary: string;
    content: string;
    status: 'published' | 'draft';
}

const NewsForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const isEditMode = !!id;

    const [formData, setFormData] = useState<NewsFormData>({
        title: '',
        summary: '',
        content: '',
        status: 'draft',
    });

    useEffect(() => {
        if (isEditMode) {
            // In a real app, you would fetch the news item by ID from an API
            // For this example, we'll use mock data
            if (id === '1') {
                setFormData({
                    title: 'Tin tức mới nhất về công nghệ',
                    summary: 'Những tiến bộ công nghệ mới nhất trong năm 2023',
                    content: 'Nội dung chi tiết về tin tức công nghệ mới nhất...',
                    status: 'published',
                });
            } else if (id === '2') {
                setFormData({
                    title: 'Sự kiện ra mắt sản phẩm mới',
                    summary: 'Sự kiện ra mắt sản phẩm mới sắp diễn ra vào tháng tới',
                    content: 'Chi tiết về sự kiện ra mắt sản phẩm mới...',
                    status: 'published',
                });
            } else if (id === '3') {
                setFormData({
                    title: 'Chương trình khuyến mãi đặc biệt',
                    summary: 'Khuyến mãi đặc biệt nhân dịp kỷ niệm 10 năm thành lập',
                    content: 'Chi tiết về chương trình khuyến mãi...',
                    status: 'draft',
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

        // Navigate back to the news list after submission
        router.push('/admin/news');
    };

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                    {isEditMode ? 'Chỉnh sửa tin tức' : 'Thêm tin tức mới'}
                </h1>
                <Link
                    href="/admin/news"
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                    Quay lại
                </Link>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Tiêu đề
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
                            Tóm tắt
                        </label>
                        <input
                            type="text"
                            id="summary"
                            name="summary"
                            value={formData.summary}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                            Nội dung
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            rows={8}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-6">
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
                            <option value="draft">Bản nháp</option>
                            <option value="published">Xuất bản</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <Link
                            href="/admin/news"
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