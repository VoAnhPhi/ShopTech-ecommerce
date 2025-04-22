'use client'

import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const response = await fetch('http://localhost:3000/admin/dangnhap', {
            method: 'POST',
            body: JSON.stringify({ mat_khau: password, email: email }),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        const data = await response.json();
        if (data.status === 200) {
            toast.success('Đăng nhập thành công');
            localStorage.setItem('vai_tro', '1');
            setTimeout(() => {
                window.location.href = "/admin";
            }, 1500);
        }
        else {
            toast.error(data.thong_bao);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <ToastContainer />
            <div className="bg-white p-8 rounded-lg w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">Admin Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter your password"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                        >
                            Sign In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

