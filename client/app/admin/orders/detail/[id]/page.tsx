'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeftIcon, 
  PrinterIcon, 
  PaperAirplaneIcon,
  TruckIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

// Định nghĩa kiểu dữ liệu sản phẩm trong đơn hàng
interface OrderItem {
  id: number;
  productName: string;
  sku: string;
  price: number;
  quantity: number;
  total: number;
  image: string;
}

// Định nghĩa kiểu dữ liệu đơn hàng
interface OrderDetail {
  id: number;
  orderCode: string;
  customerName: string;
  orderDate: string;
  total: number;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  paymentMethod: 'cod' | 'bank_transfer' | 'credit_card';
  paymentStatus: 'pending' | 'paid' | 'failed';
  shippingAddress: string;
  phone: string;
  email: string;
  shippingFee: number;
  discount: number;
  note: string;
  items: OrderItem[];
}

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusUpdate, setStatusUpdate] = useState<string>('');

  useEffect(() => {
    // Giả lập việc tải dữ liệu từ API
    setTimeout(() => {
      const mockOrder: OrderDetail = {
        id: parseInt(id || '1'),
        orderCode: `DH0000${id}`,
        customerName: 'Nguyễn Văn A',
        orderDate: '2024-05-15T10:30:00',
        total: 2490000,
        status: 'processing',
        paymentMethod: 'bank_transfer',
        paymentStatus: 'paid',
        shippingAddress: '123 Đường ABC, Phường XYZ, Quận 1, TP.HCM',
        phone: '0901234567',
        email: 'nguyenvana@example.com',
        shippingFee: 30000,
        discount: 50000,
        note: 'Giao hàng trong giờ hành chính, gọi trước khi giao',
        items: [
          {
            id: 1,
            productName: 'iPhone 14 Pro Max',
            sku: 'IP14PM-256-GRAY',
            price: 1790000,
            quantity: 1,
            total: 1790000,
            image: 'https://via.placeholder.com/80',
          },
          {
            id: 2,
            productName: 'Ốp lưng iPhone 14 Pro Max',
            sku: 'CASE-IP14PM-CLEAR',
            price: 250000,
            quantity: 2,
            total: 500000,
            image: 'https://via.placeholder.com/80',
          },
          {
            id: 3,
            productName: 'Cáp sạc Lightning',
            sku: 'CABLE-LIGHTNING-1M',
            price: 220000,
            quantity: 1,
            total: 220000,
            image: 'https://via.placeholder.com/80',
          },
        ],
      };
      
      setOrder(mockOrder);
      setStatusUpdate(mockOrder.status);
      setLoading(false);
    }, 500);
  }, [id]);

  // Format số tiền
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Format ngày giờ
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Hiển thị trạng thái đơn hàng
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

  // Hiển thị trạng thái thanh toán
  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: 'Chờ thanh toán', color: 'bg-yellow-100 text-yellow-800' };
      case 'paid':
        return { label: 'Đã thanh toán', color: 'bg-green-100 text-green-800' };
      case 'failed':
        return { label: 'Thanh toán thất bại', color: 'bg-red-100 text-red-800' };
      default:
        return { label: 'Không xác định', color: 'bg-gray-100 text-gray-800' };
    }
  };

  // Hiển thị phương thức thanh toán
  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'cod':
        return 'Thanh toán khi nhận hàng';
      case 'bank_transfer':
        return 'Chuyển khoản ngân hàng';
      case 'credit_card':
        return 'Thẻ tín dụng';
      default:
        return 'Không xác định';
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusUpdate(e.target.value);
  };

  const handleUpdateStatus = () => {
    // Giả lập cập nhật trạng thái
    if (order) {
      const updatedOrder = { ...order, status: statusUpdate as any };
      setOrder(updatedOrder);
      alert('Cập nhật trạng thái đơn hàng thành công!');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-600">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center py-12">
          <p className="text-lg text-red-500">Không tìm thấy thông tin đơn hàng!</p>
          <Link href="/admin/orders" className="mt-4 inline-flex items-center text-blue-500 hover:text-blue-700">
            <ArrowLeftIcon className="w-5 h-5 mr-1" />
            Quay lại danh sách đơn hàng
          </Link>
        </div>
      </div>
    );
  }

  const orderStatus = getStatusLabel(order.status);
  const paymentStatus = getPaymentStatusLabel(order.paymentStatus);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header section */}
      <div className="mb-6 flex flex-wrap justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/admin/orders" className="text-gray-500 hover:text-gray-700">
            <ArrowLeftIcon className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-800">
            Chi tiết đơn hàng <span className="text-blue-600">#{order.orderCode}</span>
          </h1>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${orderStatus.color}`}>
            {orderStatus.label}
          </span>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 flex items-center"
          >
            <PrinterIcon className="w-5 h-5 mr-1" />
            In đơn hàng
          </button>
          <button
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 flex items-center"
          >
            <PaperAirplaneIcon className="w-5 h-5 mr-1" />
            Gửi email
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Left column - Order details */}
        <div className="col-span-2 space-y-6">
          {/* Order information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Thông tin đơn hàng</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Mã đơn hàng</p>
                <p className="font-medium">{order.orderCode}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ngày đặt hàng</p>
                <p className="font-medium">{formatDateTime(order.orderDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Trạng thái đơn hàng</p>
                <p className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${orderStatus.color}`}>
                  {orderStatus.label}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phương thức thanh toán</p>
                <p className="font-medium">{getPaymentMethodLabel(order.paymentMethod)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Trạng thái thanh toán</p>
                <p className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${paymentStatus.color}`}>
                  {paymentStatus.label}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ghi chú</p>
                <p className="text-gray-700">{order.note || 'Không có'}</p>
              </div>
            </div>
          </div>

          {/* Products table */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Sản phẩm</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đơn giá
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số lượng
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thành tiền
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img src={item.image} alt={item.productName} className="w-12 h-12 object-cover rounded" />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                          <div className="text-xs text-gray-500">SKU: {item.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column - Customer and totals */}
        <div className="col-span-1 space-y-6">
          {/* Update status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Cập nhật trạng thái</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái đơn hàng
                </label>
                <select
                  id="status"
                  value={statusUpdate}
                  onChange={handleStatusChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pending">Chờ xác nhận</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="delivered">Đã giao hàng</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
              <button
                onClick={handleUpdateStatus}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Cập nhật
              </button>
            </div>
          </div>

          {/* Customer information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Thông tin khách hàng</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Khách hàng</p>
                <p className="font-medium">{order.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{order.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Số điện thoại</p>
                <p className="font-medium">{order.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Địa chỉ giao hàng</p>
                <p className="text-gray-700">{order.shippingAddress}</p>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Tổng cộng</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính:</span>
                <span className="font-medium">{formatCurrency(order.total - order.shippingFee + order.discount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Giảm giá:</span>
                <span className="font-medium">-{formatCurrency(order.discount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phí vận chuyển:</span>
                <span className="font-medium">{formatCurrency(order.shippingFee)}</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-bold">
                  <span>Tổng cộng:</span>
                  <span className="text-blue-600">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Lịch sử đơn hàng</h2>
            <div className="space-y-4">
              <div className="relative pl-8 pb-4 border-l-2 border-blue-500">
                <div className="absolute -left-2 top-0 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <TruckIcon className="w-3 h-3 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium">Đang xử lý</p>
                  <p className="text-xs text-gray-500">16/05/2024 14:30</p>
                  <p className="text-sm text-gray-600">Đơn hàng đang được chuẩn bị</p>
                </div>
              </div>
              <div className="relative pl-8 pb-4 border-l-2 border-blue-500">
                <div className="absolute -left-2 top-0 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <CurrencyDollarIcon className="w-3 h-3 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium">Thanh toán thành công</p>
                  <p className="text-xs text-gray-500">15/05/2024 10:45</p>
                  <p className="text-sm text-gray-600">Đã nhận thanh toán qua chuyển khoản</p>
                </div>
              </div>
              <div className="relative pl-8">
                <div className="absolute -left-2 top-0 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <PaperAirplaneIcon className="w-3 h-3 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium">Đơn hàng đã tạo</p>
                  <p className="text-xs text-gray-500">15/05/2024 10:30</p>
                  <p className="text-sm text-gray-600">Đơn hàng đã được tạo thành công</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail; 