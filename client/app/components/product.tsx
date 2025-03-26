import Link from "next/link";
import { ISanPham } from "../data";
import { useDispatch } from "react-redux";
import { addToCart } from "@/lib/cartSlice";

export default function Show1SP(props: any) {
    let sp = props.sp as ISanPham;
    const dispatch = useDispatch();

    return (
        <div className="bg-white p-4 shadow rounded max-w-screen-xl mx-auto">
            <img src={sp.hinh} alt="Product" className="w-full h-80 object-cover rounded mb-4 transition-transform duration-300 hover:scale-105" />
            <h3 className="text-lg font-bold mt-2 mb-4 hover:text-blue-500 text-center">
                <Link href={`/product/detail/${sp.id}`}>{sp.ten_sp}</Link>
            </h3>
            <div className="flex items-center justify-between mb-4">
                <p className="text-lg font-bold">Giá: <span className="text-red-500">{sp.gia_km.toLocaleString("vi-VN")} VNĐ</span></p>
                <p className="text-lg font-bold line-through text-gray-500">{sp.gia.toLocaleString("vi-VN")} VNĐ</p>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
                <p className="font-semibold">Cập Nhật: {sp.ngay}</p>
                <p className="font-semibold">Lượt xem: {sp.luot_xem}</p>
            </div>
            <div className="flex justify-between mt-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Mua hàng</button>
                <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700" onClick={() => dispatch(addToCart(sp))}>Thêm vào giỏ hàng</button>
            </div>
        </div>
    );
}
