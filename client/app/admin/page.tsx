'use client';
import React from 'react';
import Link from 'next/link';
import {
    NewspaperIcon,
    ShoppingBagIcon,
    TagIcon,
    UserGroupIcon,
    CurrencyDollarIcon,
    ChartBarIcon,
} from '@heroicons/react/24/outline';
import { ToastContainer } from 'react-toastify';
interface StatCard {
    title: string;
    value: number | string;
    description: string;
    icon: React.ReactNode;
    color: string;
    path: string;
}

const stats: StatCard[] = [
    {
        title: 'Sản phẩm',
        value: 42,
        description: 'Tổng số sản phẩm',
        icon: <ShoppingBagIcon className="w-7 h-7" />,
        color: 'bg-blue-500',
        path: '/admin/products',
    },
    {
        title: 'Danh mục',
        value: 5,
        description: 'Tổng số danh mục',
        icon: <TagIcon className="w-7 h-7" />,
        color: 'bg-green-500',
        path: '/admin/categories',
    },
    {
        title: 'Người dùng',
        value: 189,
        description: 'Tổng số người dùng',
        icon: <UserGroupIcon className="w-7 h-7" />,
        color: 'bg-purple-500',
        path: '/admin/users',
    },
    {
        title: 'Tin tức',
        value: 24,
        description: 'Tổng số bài viết',
        icon: <NewspaperIcon className="w-7 h-7" />,
        color: 'bg-yellow-500',
        path: '/admin/news',
    },
    {
        title: 'Doanh thu',
        value: '120.450.000 ₫',
        description: 'Doanh thu tháng này',
        icon: <CurrencyDollarIcon className="w-7 h-7" />,
        color: 'bg-red-500',
        path: '#',
    },
    {
        title: 'Đơn hàng',
        value: 38,
        description: 'Đơn hàng tháng này',
        icon: <ChartBarIcon className="w-7 h-7" />,
        color: 'bg-indigo-500',
        path: '#',
    },
];

const recentActivities = [
    { id: 1, action: 'Thêm sản phẩm mới', user: 'Admin', time: '10 phút trước' },
    { id: 2, action: 'Cập nhật danh mục', user: 'Admin', time: '25 phút trước' },
    { id: 3, action: 'Xóa sản phẩm', user: 'Admin', time: '1 giờ trước' },
    { id: 4, action: 'Đăng tin tức mới', user: 'Admin', time: '2 giờ trước' },
    { id: 5, action: 'Cập nhật người dùng', user: 'Admin', time: '3 giờ trước' },
];
export default function AdminPage() {
    return (
        <div className="container mx-auto">
            <ToastContainer />

            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Trang quản trị</h1>
                <p className="text-gray-600">Xem tổng quan và quản lý hệ thống</p>
            </div>

            <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat, index) => (
                    <Link
                        key={index}
                        href={stat.path}
                        className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="flex items-center">
                            <div className={`p-3 rounded-full ${stat.color} text-white mr-4`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">{stat.title}</p>
                                <p className="text-xl font-semibold text-gray-800">{stat.value}</p>
                                <p className="text-xs text-gray-500">{stat.description}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Hoạt động gần đây</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Hành động
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Người dùng
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thời gian
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {recentActivities.map((activity) => (
                                <tr key={activity.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {activity.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {activity.action}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {activity.user}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {activity.time}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
