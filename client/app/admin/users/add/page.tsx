'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: 'admin' | 'user';
    status: 'active' | 'inactive';
}

export default function UserForm() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const isEditMode = !!id;

    const [formData, setFormData] = useState<UserFormData>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user',
        status: 'active',
    });

    const [errors, setErrors] = useState({
        password: '',
        confirmPassword: '',
    });

    useEffect(() => {
        if (isEditMode) {
            // In a real app, you would fetch the user by ID from an API
            // For this example, we'll use mock data
            if (id === '1') {
                setFormData({
                    name: 'Nguyễn Văn A',
                    email: 'nguyenvana@example.com',
                    password: '',
                    confirmPassword: '',
                    role: 'admin',
                    status: 'active',
                });
            } else if (id === '2') {
                setFormData({
                    name: 'Trần Thị B',
                    email: 'tranthib@example.com',
                    password: '',
                    confirmPassword: '',
                    role: 'user',
                    status: 'active',
                });
            } else if (id === '3') {
                setFormData({
                    name: 'Lê Văn C',
                    email: 'levanc@example.com',
                    password: '',
                    confirmPassword: '',
                    role: 'user',
                    status: 'active',
                });
            } else if (id === '4') {
                setFormData({
                    name: 'Phạm Thị D',
                    email: 'phamthid@example.com',
                    password: '',
                    confirmPassword: '',
                    role: 'user',
                    status: 'inactive',
                });
            }
        }
    }, [id, isEditMode]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear errors when user types
        if (name === 'password' || name === 'confirmPassword') {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { password: '', confirmPassword: '' };

        // Only validate password if it's a new user or if the password field is not empty
        if (!isEditMode || formData.password) {
            if (formData.password.length < 6) {
                newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
                isValid = false;
            }

            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            // In a real app, you would send the data to an API
            console.log('Submitted data:', formData);

            // Navigate back to the users list after submission
            router.push('/admin/users');
        }
    };

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                    {isEditMode ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
                </h1>
                <Link
                    href="/admin/users"
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
                                Họ tên
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

                        <div className="col-span-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Mật khẩu {isEditMode && <span className="text-gray-500">(để trống nếu không thay đổi)</span>}
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'
                                    } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                {...(!isEditMode && { required: true })}
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Xác nhận mật khẩu
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                    } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                {...(!isEditMode && { required: true })}
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                                Vai trò
                            </label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="user">Người dùng</option>
                                <option value="admin">Quản trị viên</option>
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
                                <option value="active">Hoạt động</option>
                                <option value="inactive">Khóa</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <Link
                            href="/admin/users"
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