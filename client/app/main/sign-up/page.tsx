"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast, ToastContainer } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaPhone } from "react-icons/fa";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ho_ten: "",
    email: "",
    mat_khau: "",
    dien_thoai: "",
    nhap_lai_mat_khau: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Validate passwords match
    if (formData.mat_khau !== formData.nhap_lai_mat_khau) {
      toast.error("Mật khẩu không khớp!");
      return;
    }
    if (formData.ho_ten === "" || formData.email === "" || formData.mat_khau === "" || formData.nhap_lai_mat_khau === "" || formData.dien_thoai === "") {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/api/dangky", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Lỗi kết nối server.");
      }

      const data = await response.json();
      console.log("Response nhận được:", response);
      console.log("Response JSON:", data);
      if (response.ok) {
        toast.success("Đăng ký thành công!");
        setTimeout(() => {
          window.location.href = "/main/sign-in";
        }, 2000);
      } else {
        toast.error(data.thong_bao || "Đăng ký thất bại!");
      }

    } catch (error) {
      console.error("Đăng ký thất bại:", error);
      toast.error("Đã xảy ra lỗi, vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <ToastContainer />
      {/* Left side - Image */}
      <div className="relative hidden w-0 flex-1 lg:block lg:w-1/2">
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070&auto=format&fit=crop"
            alt="Tech devices"
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
                <span className="text-sm uppercase tracking-wider">Bắt đầu trải nghiệm</span>
              </div>
              <h2 className="text-4xl font-bold leading-tight">Truy cập vào thế giới công nghệ</h2>
              <p className="mt-4 text-lg text-white/80">Đăng ký tài khoản để nhận được thông báo về sản phẩm mới và ưu đãi đặc biệt.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:w-1/2">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-6">
              <div className="w-12 h-12 bg-[#10375c] rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-2xl font-bold">ST</span>
              </div>
              <h1 className="text-2xl font-bold text-[#10375c]">ShopTech</h1>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Đăng ký tài khoản</h2>
            <p className="mt-2 text-sm text-gray-600">
              Hoặc{" "}
              <Link
                href="/main/sign-in"
                className="font-medium text-[#10375c] hover:text-[#1a4b7c]"
              >
                đăng nhập với tài khoản hiện có
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="ho_ten" className="block text-sm font-medium text-gray-700">
                    Họ và tên
                  </label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <FaUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="ho_ten"
                      name="ho_ten"
                      type="text"
                      autoComplete="name"
                      required
                      value={formData.ho_ten}
                      onChange={handleChange}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-3 pl-10 placeholder-gray-400 shadow-sm focus:border-[#10375c] focus:outline-none focus:ring-2 focus:ring-[#10375c]/30 sm:text-sm"
                      placeholder="Họ và tên của bạn"
                    />
                  </div>
                </div>

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
                  <label htmlFor="dien_thoai" className="block text-sm font-medium text-gray-700">
                    Số điện thoại
                  </label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <FaPhone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="dien_thoai"
                      name="dien_thoai"
                      type="text"
                      autoComplete="dien_thoai"
                      required
                      value={formData.dien_thoai}
                      onChange={handleChange}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-3 pl-10 placeholder-gray-400 shadow-sm focus:border-[#10375c] focus:outline-none focus:ring-2 focus:ring-[#10375c]/30 sm:text-sm"
                      placeholder="Số điện thoại của bạn"
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
                      autoComplete="new-password"
                      required
                      value={formData.mat_khau}
                      onChange={handleChange}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-3 pl-10 pr-10 placeholder-gray-400 shadow-sm focus:border-[#10375c] focus:outline-none focus:ring-2 focus:ring-[#10375c]/30 sm:text-sm"
                      placeholder="Mật khẩu"
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

                <div>
                  <label htmlFor="nhap_lai_mat_khau" className="block text-sm font-medium text-gray-700">
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="nhap_lai_mat_khau"
                      name="nhap_lai_mat_khau"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formData.nhap_lai_mat_khau}
                      onChange={handleChange}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-3 pl-10 pr-10 placeholder-gray-400 shadow-sm focus:border-[#10375c] focus:outline-none focus:ring-2 focus:ring-[#10375c]/30 sm:text-sm"
                      placeholder="Xác nhận mật khẩu"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash className="h-5 w-5 text-gray-400" />
                      ) : (
                        <FaEye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full justify-center rounded-lg bg-[#10375c] px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-[#1a4b7c] focus:outline-none focus:ring-2 focus:ring-[#10375c] focus:ring-offset-2"
                  >
                    {loading ? "Đang đăng ký..." : "Đăng ký"}
                  </button>
                </div>

                <div className="text-center text-sm text-gray-600">
                  Bằng cách đăng ký, bạn đồng ý với{" "}
                  <Link href="/terms" className="font-medium text-[#10375c] hover:text-[#1a4b7c]">
                    Điều khoản dịch vụ
                  </Link>{" "}
                  và{" "}
                  <Link href="/privacy" className="font-medium text-[#10375c] hover:text-[#1a4b7c]">
                    Chính sách bảo mật
                  </Link>{" "}
                  của chúng tôi.
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

