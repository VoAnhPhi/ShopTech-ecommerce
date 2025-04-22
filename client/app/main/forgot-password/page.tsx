'use client'
import Link from "next/link";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";


export default function ForgotPassword() {
    const [formData, setFormData] = useState({
        email: "",
    });
    const [message, setMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = await fetch("http://localhost:3000/api/quenpass", {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        if (data.status === 200) {
            toast.success("Gửi liên kết đặt lại mật khẩu thành công!");
            setMessage("Chúng tôi đã gửi liên kết đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra email của bạn để đặt lại mật khẩu.");
        } else {
            toast.error(data.thong_bao);
            setMessage("Đã xảy ra lỗi, vui lòng thử lại sau!");
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-100 via-indigo-100 to-blue-100 p-4">
            <ToastContainer />
            <div className="w-full max-w-md rounded-xl bg-white p-10 shadow-xl">
                {/* You can add a logo here if you have one */}
                {/* <img src="/path/to/your/logo.svg" alt="Logo" className="mx-auto mb-6 h-12 w-auto" /> */}
                <h1 className="mb-4 text-center text-3xl font-bold text-gray-800">Quên mật khẩu?</h1>
                <p className="mb-8 text-center text-base text-gray-600">
                    {message || "Đừng lo lắng! Nhập email của bạn dưới đây và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu."}
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-700">
                            Địa chỉ Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            className="block w-full rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-400 shadow-sm transition duration-150 ease-in-out focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Email của bạn"
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        className="flex w-full justify-center rounded-lg border border-transparent bg-[#10375C] px-4 py-3 text-base font-medium text-white shadow-md transition duration-150 ease-in-out hover:bg-[#0056b3] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Gửi liên kết đặt lại mật khẩu
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <Link href="/main/sign-in" className="text-sm font-medium text-[#10375C] hover:text-[#0056b3]">
                        Quay lại Đăng nhập
                    </Link>
                </div>
            </div>
        </div>
    )
}
