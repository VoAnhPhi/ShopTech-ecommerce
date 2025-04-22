"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify"; 
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    mat_khau: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/dangnhap", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.status === 200) {
        toast.success("Đăng nhập thành công!");
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("user", JSON.stringify(data.user));
        sessionStorage.setItem("expiresIn", data.expiresIn);
        sessionStorage.setItem("email", data.user.email);
        setTimeout(() => {
          window.location.href = "/main";
        }, 2000);
      } else {
        toast.error(data.thong_bao);
      }
    } catch (error) {
      console.error("Đăng nhập thất bại:", error);
      toast.error("Đã xảy ra lỗi, vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <ToastContainer />
      {/* Left side - Form */}
      <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:w-1/2">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-6">
              <div className="w-12 h-12 bg-[#10375c] rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-2xl font-bold">ST</span>
              </div>
              <h1 className="text-2xl font-bold text-[#10375c]">ShopTech</h1>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Đăng nhập</h2>
            <p className="mt-2 text-sm text-gray-600">
              Hoặc{" "}
              <Link
                href="/main/sign-up"
                className="font-medium text-[#10375c] hover:text-[#1a4b7c]"
              >
                đăng ký tài khoản mới
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <FaEnvelope className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-3 pl-10 placeholder-gray-400 shadow-sm focus:border-[#10375c] focus:outline-none focus:ring-2 focus:ring-[#10375c]/30 sm:text-sm"
                      placeholder="Email của bạn"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="mat_khau" className="block text-sm font-medium text-gray-700">
                    Mật khẩu
                  </label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="mat_khau"
                      name="mat_khau"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={formData.mat_khau}
                      onChange={handleChange}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-3 pl-10 pr-10 placeholder-gray-400 shadow-sm focus:border-[#10375c] focus:outline-none focus:ring-2 focus:ring-[#10375c]/30 sm:text-sm"
                      placeholder="Mật khẩu của bạn"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FaEyeSlash className="h-5 w-5 text-gray-400" />
                      ) : (
                        <FaEye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-[#10375c] focus:ring-2 focus:ring-[#10375c]/30"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Nhớ mật khẩu
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link
                      href="/main/forgot-password"
                      className="font-medium text-[#10375c] hover:text-[#1a4b7c]"
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full justify-center rounded-lg bg-[#10375c] px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-[#1a4b7c] focus:outline-none focus:ring-2 focus:ring-[#10375c] focus:ring-offset-2"
                  >
                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Image */}
      <div className="relative hidden w-0 flex-1 lg:block lg:w-1/2">
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1556656793-08538906a9f8?q=80&w=2070&auto=format&fit=crop"
            alt="Electronics store"
            width={800}
            height={1200}
            className="h-full w-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[#10375c] mix-blend-multiply opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#10375c] via-[#10375c]/40"></div>
          <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
            <div className="mx-auto max-w-xl">
              <div className="mb-4 flex items-center">
                <div className="h-1 w-16 bg-white mr-3"></div>
                <span className="text-sm uppercase tracking-wider">Mua sắm công nghệ</span>
              </div>
              <h2 className="text-4xl font-bold leading-tight">Khám phá sản phẩm công nghệ mới nhất</h2>
              <p className="mt-4 text-lg text-white/80">Đăng nhập để trải nghiệm mua sắm công nghệ tốt nhất với ưu đãi độc quyền dành cho thành viên.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
