import React, { useState } from 'react';
import Link from 'next/link';
import {
    HomeIcon,
    NewspaperIcon,
    ShoppingBagIcon,
    TagIcon,
    UserGroupIcon,
    Bars3Icon,
    XMarkIcon,
    ShoppingCartIcon
} from '@heroicons/react/24/outline';

interface SidebarItem {
    name: string;
    path: string;
    icon: React.ReactNode;
}

const Sidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const sidebarItems: SidebarItem[] = [
        {
            name: 'Dashboard',
            path: '/admin',
            icon: <HomeIcon className="w-6 h-6 mr-3" />,
        },
        {
            name: 'Tin tức',
            path: '/admin/news',
            icon: <NewspaperIcon className="w-6 h-6 mr-3" />,
        },
        {
            name: 'Sản phẩm',
            path: '/admin/products',
            icon: <ShoppingBagIcon className="w-6 h-6 mr-3" />,
        },
        {
            name: 'Danh mục sản phẩm',
            path: '/admin/categories',
            icon: <TagIcon className="w-6 h-6 mr-3" />,
        },
        {
            name: 'Đơn hàng',
            path: '/admin/orders',
            icon: <ShoppingCartIcon className="w-6 h-6 mr-3" />,
        },
        {
            name: 'Người dùng',
            path: '/admin/users',
            icon: <UserGroupIcon className="w-6 h-6 mr-3" />,
        },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-center h-16 px-4 border-b">
                    <div className="text-xl font-bold text-gray-800">Admin Panel</div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-1 text-gray-500 rounded-md hover:text-gray-900 hover:bg-gray-100"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <nav className="px-2 py-4 space-y-1">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.path}
                            className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
                            onClick={() => setSidebarOpen(false)}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64 lg:overflow-y-auto lg:bg-white lg:border-r lg:pb-4">
                <div className="flex items-center justify-center h-16 px-4 border-b">
                    <div className="text-xl font-bold text-gray-800">Admin Panel</div>
                </div>
                <nav className="px-2 py-4 space-y-1">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.path}
                            className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Content area */}
            <div className="flex-1 lg:pl-64">
                <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-white border-b shadow-sm lg:justify-end">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-1 text-gray-500 rounded-md lg:hidden hover:text-gray-900 hover:bg-gray-100"
                    >
                        <Bars3Icon className="w-6 h-6" />
                    </button>
                    <div className="flex items-center">
                        <div className="relative ml-3">
                            <button className="flex items-center max-w-xs text-sm bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 p-2">
                                <span className="sr-only">Open user menu</span>
                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                    A
                                </div>
                                <span className="ml-2">Admin</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main content */}
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Sidebar; 