'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    EyeIcon,
    PencilIcon,
    TrashIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    FunnelIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

interface Order {
    id: number;
    orderCode: string;
    customerName: string;
    orderDate: string;
    total: number;
    status: 'pending' | 'processing' | 'delivered' | 'cancelled';
    paymentMethod: 'cod' | 'bank_transfer' | 'credit_card';
    shippingAddress: string;
    phone: string;
}

const ordersList: Order[] = [
    {
        id: 1,
        orderCode: 'DH00001',
        customerName: 'Nguyễn Văn A',
        orderDate: '2024-05-15',
        total: 2490000,
        status: 'delivered',
        paymentMethod: 'cod',
        shippingAddress: '123 Đường ABC, Quận 1, TP.HCM',
        phone: '0901234567',
    },
    {
        id: 2,
        orderCode: 'DH00002',
        customerName: 'Trần Thị B',
        orderDate: '2024-05-16',
        total: 1850000,
        status: 'processing',
        paymentMethod: 'bank_transfer',
        shippingAddress: '456 Đường XYZ, Quận 2, TP.HCM',
        phone: '0909876543',
    },
    {
        id: 3,
        orderCode: 'DH00003',
        customerName: 'Lê Văn C',
        orderDate: '2024-05-17',
        total: 980000,
        status: 'pending',
        paymentMethod: 'credit_card',
        shippingAddress: '789 Đường DEF, Quận 3, TP.HCM',
        phone: '0912345678',
    },
    {
        id: 4,
        orderCode: 'DH00004',
        customerName: 'Phạm Thị D',
        orderDate: '2024-05-18',
        total: 3450000,
        status: 'processing',
        paymentMethod: 'bank_transfer',
        shippingAddress: '101 Đường GHI, Quận 4, TP.HCM',
        phone: '0987654321',
    },
    {
        id: 5,
        orderCode: 'DH00005',
        customerName: 'Hoàng Văn E',
        orderDate: '2024-05-19',
        total: 1250000,
        status: 'cancelled',
        paymentMethod: 'cod',
        shippingAddress: '202 Đường JKL, Quận 5, TP.HCM',
        phone: '0976543210',
    },
];

export default function OrdersList() {
    const [showFilters, setShowFilters] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredOrders = statusFilter === 'all'
        ? ordersList
        : ordersList.filter(order => order.status === statusFilter);

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending':
                return { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' };
            case 'processing':
                return { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-800' };
            case 'delivered':
                return { label: 'Đã giao hàng', color: 'bg-green-100 text-green-800' };
            case 'cancelled':
                return { label: 'Đã hủy', color: 'bg-red-100 text-red-800' };
            default:
                return { label: 'Không xác định', color: 'bg-gray-100 text-gray-800' };
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Quản lý đơn hàng</h1>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md flex items-center hover:bg-gray-50"
                >
                    <FunnelIcon className="w-5 h-5 mr-2" />
                    Bộ lọc
                    {showFilters ? <ChevronUpIcon className="w-5 h-5 ml-1" /> : <ChevronDownIcon className="w-5 h-5 ml-1" />}
                </button>
            </div>

            {showFilters && (
                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-medium">Lọc đơn hàng</h2>
                        <button
                            onClick={() => setShowFilters(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                Trạng thái
                            </label>
                            <select
                                id="status"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="all">Tất cả</option>
                                <option value="pending">Chờ xác nhận</option>
                                <option value="processing">Đang xử lý</option>
                                <option value="delivered">Đã giao hàng</option>
                                <option value="cancelled">Đã hủy</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã đơn hàng</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày đặt</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng tiền</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredOrders.map((order) => {
                            const status = getStatusLabel(order.status);
                            return (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.orderCode}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        <div>{order.customerName}</div>
                                        <div className="text-xs text-gray-500">{order.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {formatCurrency(order.total)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${status.color}`}>
                                            {status.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <Link href={`/admin/orders/detail/${order.id}`} className="text-indigo-600 hover:text-indigo-900" title="Xem chi tiết">
                                                <EyeIcon className="w-5 h-5" />
                                            </Link>
                                            <button className="text-blue-600 hover:text-blue-900" title="Cập nhật trạng thái">
                                                <PencilIcon className="w-5 h-5" />
                                            </button>
                                            <button className="text-red-600 hover:text-red-900" title="Hủy đơn hàng">
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
