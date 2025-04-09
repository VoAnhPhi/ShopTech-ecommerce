'use client'

import Link from 'next/link'

export default function OrderConfirmation() {
    const orderDetails = {
        orderNumber: 'ORD-12345-ABC',
        orderDate: 'June 10, 2023',
        paymentMethod: 'Visa **** 1234',
        total: 432.95,
        shipping: {
            name: 'John Doe',
            address: '123 Main St',
            city: 'San Francisco',
            state: 'CA',
            zip: '94101',
            method: 'Standard Shipping (3-5 business days)'
        },
        items: [
            { id: 1, name: 'Product 1', price: 99.99, quantity: 2, total: 199.98 },
            { id: 2, name: 'Product 2', price: 149.99, quantity: 1, total: 149.99 },
            { id: 3, name: 'Product 3', price: 29.99, quantity: 3, total: 89.97 }
        ]
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 text-center">
                <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Cảm ơn bạn đã đặt hàng!</h1>
                <p className="text-lg text-gray-600 mb-4">
                    Đơn hàng của bạn đã được nhận và đang được xử lý.
                </p>
                <p className="text-gray-600">
                    Một email xác nhận đã được gửi đến email của bạn.
                </p>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-semibold mb-4">Thông tin đơn hàng</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-gray-600 mb-1">Mã đơn hàng</p>
                            <p className="font-medium">{orderDetails.orderNumber}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 mb-1">Ngày đặt hàng</p>
                            <p className="font-medium">{orderDetails.orderDate}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 mb-1">Phương thức thanh toán</p>
                            <p className="font-medium">{orderDetails.paymentMethod}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 mb-1">Tổng tiền</p>
                            <p className="font-medium">${orderDetails.total.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-semibold mb-4">Thông tin giao hàng</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-gray-600 mb-1">Địa chỉ giao hàng</p>
                            <p className="font-medium">{orderDetails.shipping.name}</p>
                            <p className="font-medium">{orderDetails.shipping.address}</p>
                            <p className="font-medium">{orderDetails.shipping.city}, {orderDetails.shipping.state} {orderDetails.shipping.zip}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 mb-1">Phương thức giao hàng</p>
                            <p className="font-medium">{orderDetails.shipping.method}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <h2 className="text-2xl font-semibold mb-4">Tóm tắt đơn hàng</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {orderDetails.items.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded"></div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            ${item.price.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.quantity}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            ${item.total.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="text-center">
                <Link 
                    href="/" 
                    className="inline-block bg-blue-600 text-white py-3 px-8 rounded-md font-medium hover:bg-blue-700"
                >
                    Tiếp tục mua hàng
                </Link>
            </div>
        </div>
    )
}
