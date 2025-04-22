"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCreditCard,
  FaShoppingBag,
  FaKey,
  FaUserEdit,
  FaMapMarkerAlt,
  FaIdCard,
  FaRegBell,
  FaSignOutAlt,
  FaHeadset
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    ho_ten: "",
    email: "",
    dien_thoai: "",
    dia_chi: "",
  });

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      setProfileData(JSON.parse(user));
    }
  }, []);

  const [passwordData, setPasswordData] = useState({
    email: "",
    pass_old: "",
    pass_new1: "",
    pass_new2: "",
  });

  // Mock data for orders
  const orders = [
    { id: "ORD123456", date: "15/06/2023", status: "Đã giao", total: "1,299,000 ₫", image: "https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?q=80&w=1000&auto=format&fit=crop" },
    { id: "ORD123457", date: "22/05/2023", status: "Đang giao", total: "2,499,000 ₫", image: "https://images.unsplash.com/photo-1605170439002-90845e8c0137?q=80&w=1000&auto=format&fit=crop" },
    { id: "ORD123458", date: "10/04/2023", status: "Đã hủy", total: "899,000 ₫", image: "https://images.unsplash.com/photo-1533740566848-5f7d3e04e3d7?q=80&w=1000&auto=format&fit=crop" },
  ];

  // Mock data for payment methods
  const paymentMethods = [
    { id: 1, type: "Visa", last4: "4242", expiry: "12/24", icon: "visa" },
    { id: 2, type: "MasterCard", last4: "5555", expiry: "10/25", icon: "mastercard" },
  ];

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle profile update submission
    const response = await fetch("http://localhost:3000/api/capnhat", {
      method: "POST",
      body: JSON.stringify(profileData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      toast.success("Cập nhật thông tin thành công!");
      sessionStorage.setItem("user", JSON.stringify(profileData));
    } else {
      const data = await response.json();
      toast.error(data.thong_bao);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate passwords match
    if (passwordData.pass_new1 !== passwordData.pass_new2) {
      toast.error("Mật khẩu mới không khớp!");
      return;
    }
    // Handle password update submission
    const response = await fetch("http://localhost:3000/api/doipass", {
      method: "POST",
      body: JSON.stringify({ email: profileData.email, pass_old: passwordData.pass_old, pass_new1: passwordData.pass_new1, pass_new2: passwordData.pass_new2 }),
      headers: {
        "authorization": `Bearer ${sessionStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      toast.success("Đổi mật khẩu thành công!");
    } else {
      const data = await response.json();
      toast.error(data.thong_bao);
    }
  };  

  const handleForgotPassword = () => {
    // Handle forgot password logic
    console.log("Forgot password requested");
  };

  const logout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("expiresIn");
    sessionStorage.removeItem("email");
    window.location.href = "/";
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <ToastContainer />
            <div className="flex flex-col sm:flex-row items-center">
              <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-[#10375c]/20">
                <Image
                  src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2080&auto=format&fit=crop"
                  alt="User profile"
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 flex items-center justify-center transition-all opacity-0 hover:opacity-100">
                  <button className="text-white text-xs font-medium">Thay đổi</button>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                <h3 className="text-lg font-medium">{profileData.ho_ten}</h3>
                <p className="text-sm text-gray-500">{profileData.email}</p>
                <p className="text-xs text-[#10375c] mt-1">Khách hàng thành viên</p>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4 mt-8">
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
                    value={profileData.ho_ten}
                    onChange={handleProfileChange}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-3 pl-10 focus:border-[#10375c] focus:ring-[#10375c] sm:text-sm"
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
                    value={profileData.email}
                    onChange={handleProfileChange}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-3 pl-10 focus:border-[#10375c] focus:ring-[#10375c] sm:text-sm"
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
                    type="tel"
                    value={profileData.dien_thoai}
                    onChange={handleProfileChange}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-3 pl-10 focus:border-[#10375c] focus:ring-[#10375c] sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="dia_chi" className="block text-sm font-medium text-gray-700">
                  Địa chỉ
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute top-3 left-3">
                    <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    id="dia_chi"
                    name="dia_chi"
                    rows={3}
                    value={profileData.dia_chi || ""}
                    onChange={handleProfileChange}
                    className="block w-full rounded-lg border border-gray-300 py-2 px-3 pl-10 focus:border-[#10375c] focus:ring-[#10375c] sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full rounded-lg border border-transparent bg-[#10375c] px-4 py-3 text-sm font-medium text-white hover:bg-[#1a4b7c] focus:outline-none focus:ring-2 focus:ring-[#10375c] focus:ring-offset-2"
                >
                  Cập nhật thông tin
                </button>
              </div>
            </form>
          </div>
        );

      case "password":
        return (
          <div className="space-y-6">
            <ToastContainer />
            <div className="bg-[#10375c]/10 rounded-lg p-4 flex items-start mb-6">
              <div className="text-[#10375c] mt-1 mr-3">
                <FaKey className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-[#10375c]">Bảo mật tài khoản</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Để bảo vệ tài khoản, vui lòng không chia sẻ mật khẩu với người khác
                </p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="pass_old" className="block text-sm font-medium text-gray-700">
                  Mật khẩu hiện tại
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="pass_old"
                    name="pass_old"
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.pass_old}
                    onChange={handlePasswordChange}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-3 pl-10 pr-10 focus:border-[#10375c] focus:ring-[#10375c] sm:text-sm"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FaEye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="pass_new1" className="block text-sm font-medium text-gray-700">
                  Mật khẩu mới
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="pass_new1"
                    name="pass_new1"
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.pass_new1}
                    onChange={handlePasswordChange}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-3 pl-10 pr-10 focus:border-[#10375c] focus:ring-[#10375c] sm:text-sm"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FaEye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="pass_new2" className="block text-sm font-medium text-gray-700">
                  Xác nhận mật khẩu mới
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="pass_new2"
                    name="pass_new2"
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.pass_new2}
                    onChange={handlePasswordChange}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-3 pl-10 pr-10 focus:border-[#10375c] focus:ring-[#10375c] sm:text-sm"
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
                  className="w-full rounded-lg border border-transparent bg-[#10375c] px-4 py-3 text-sm font-medium text-white hover:bg-[#1a4b7c] focus:outline-none focus:ring-2 focus:ring-[#10375c] focus:ring-offset-2"
                >
                  Đổi mật khẩu
                </button>
              </div>
            </form>

            <div className="border-t border-gray-200 pt-4">
              <button
                onClick={handleForgotPassword}
                className="text-sm text-[#10375c] hover:text-[#1a4b7c]"
              >
                Quên mật khẩu?
              </button>
            </div>
          </div>
        );

      case "payments":
        return (
          <div className="space-y-6">
            <ToastContainer />
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Phương thức thanh toán</h3>
              <button className="inline-flex items-center rounded-lg border border-[#10375c] bg-white px-3 py-2 text-xs font-medium text-[#10375c] hover:bg-[#10375c]/5">
                <span className="mr-1">+</span> Thêm mới
              </button>
            </div>

            <div className="space-y-4 mt-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:border-[#10375c]/30 hover:bg-[#10375c]/5 transition-colors">
                  <div className="flex items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#10375c]/10">
                      {method.icon === "visa" ? (
                        <Image
                          src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                          alt="Visa"
                          width={34}
                          height={34}
                        />
                      ) : (
                        <Image
                          src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg"
                          alt="MasterCard"
                          width={34}
                          height={34}
                        />
                      )}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{method.type} •••• {method.last4}</p>
                      <p className="text-sm text-gray-500">Hết hạn: {method.expiry}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded-md border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50">
                      Chỉnh sửa
                    </button>
                    <button className="rounded-md border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50">
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-[#10375c]/5 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#10375c]/10 mr-3">
                  <FaCreditCard className="h-5 w-5 text-[#10375c]" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Thanh toán an toàn</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Mọi thông tin thanh toán của bạn đều được mã hóa và bảo vệ.
                    Chúng tôi cam kết không chia sẻ thông tin với bên thứ ba.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "orders":
        return (
          <div className="space-y-6">
            <ToastContainer />
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Đơn hàng của bạn</h3>
              <div className="text-sm text-gray-500">
                Tổng đơn hàng: <span className="font-medium text-[#10375c]">{orders.length}</span>
              </div>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {orders.map((order) => (
                <div key={order.id} className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative h-36 w-full">
                    <Image
                      src={order.image}
                      alt={`Order ${order.id}`}
                      width={300}
                      height={150}
                      className="h-full w-full object-cover"
                    />
                    <div className={`absolute top-2 right-2 rounded-full px-2 py-1 text-xs font-medium ${order.status === "Đã giao"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Đang giao"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                      {order.status}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">Mã đơn: {order.id}</span>
                      <span className="text-sm font-bold text-[#10375c]">{order.total}</span>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Ngày đặt: {order.date}
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                      <Link href={`/main/user/orders/${order.id}`} className="text-xs font-medium text-[#10375c] hover:text-[#1a4b7c]">
                        Xem chi tiết
                      </Link>
                      <button className="text-xs bg-[#10375c]/10 text-[#10375c] px-3 py-1 rounded-full hover:bg-[#10375c]/20">
                        Mua lại
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link href="/main/products" className="inline-flex items-center rounded-lg border border-transparent bg-[#10375c] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#1a4b7c] focus:outline-none focus:ring-2 focus:ring-[#10375c] focus:ring-offset-2">
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6 text-[#10375c]">Tài khoản của tôi</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar / Tab Navigation */}
          <div className="w-full md:w-64 shrink-0">
            <div className="sticky top-8 rounded-lg border border-gray-200 overflow-hidden bg-white shadow-sm">
              <div className="bg-[#10375c] px-4 py-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-white p-1">
                    <FaUser className="h-full w-full text-[#10375c]" />
                  </div>
                  <div className="ml-3 text-white">
                    <p className="text-sm font-medium">Xin chào!</p>
                    <p className="text-xs">{profileData.ho_ten}</p>
                  </div>
                </div>
              </div>
              <nav className="divide-y divide-gray-200">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex w-full items-center px-4 py-4 text-left transition-colors ${activeTab === "profile" ? "bg-[#10375c]/10 text-[#10375c]" : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  <FaUserEdit className="mr-3 h-5 w-5" />
                  <span className="font-medium">Thông tin cá nhân</span>
                </button>
                <button
                  onClick={() => setActiveTab("password")}
                  className={`flex w-full items-center px-4 py-4 text-left transition-colors ${activeTab === "password" ? "bg-[#10375c]/10 text-[#10375c]" : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  <FaKey className="mr-3 h-5 w-5" />
                  <span className="font-medium">Đổi mật khẩu</span>
                </button>
                <button
                  onClick={() => setActiveTab("payments")}
                  className={`flex w-full items-center px-4 py-4 text-left transition-colors ${activeTab === "payments" ? "bg-[#10375c]/10 text-[#10375c]" : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  <FaCreditCard className="mr-3 h-5 w-5" />
                  <span className="font-medium">Quản lý thanh toán</span>
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`flex w-full items-center px-4 py-4 text-left transition-colors ${activeTab === "orders" ? "bg-[#10375c]/10 text-[#10375c]" : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  <FaShoppingBag className="mr-3 h-5 w-5" />
                  <span className="font-medium">Đơn hàng của tôi</span>
                </button>

                <div className="px-4 py-4">
                  <button className="flex w-full items-center text-left text-gray-700 hover:text-[#10375c] py-2">
                    <FaRegBell className="mr-3 h-5 w-5" />
                    <span className="font-medium">Thông báo</span>
                  </button>
                  <button className="flex w-full items-center text-left text-gray-700 hover:text-[#10375c] py-2">
                    <FaHeadset className="mr-3 h-5 w-5" />
                    <span className="font-medium">Hỗ trợ</span>
                  </button>
                  <button className="flex w-full items-center text-left text-gray-700 hover:text-red-600 py-2">
                    <FaSignOutAlt className="mr-3 h-5 w-5" />
                    <span className="font-medium" onClick={logout}>Đăng xuất</span>
                  </button>
                </div>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="pb-4 text-xl font-bold text-gray-900 border-b border-gray-200 mb-6">
                {activeTab === "profile" && "Thông tin cá nhân"}
                {activeTab === "password" && "Quản lý mật khẩu"}
                {activeTab === "payments" && "Quản lý thanh toán"}
                {activeTab === "orders" && "Đơn hàng của tôi"}
              </h2>
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
