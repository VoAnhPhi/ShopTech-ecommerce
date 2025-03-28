import Link from "next/link";
import { ISanPham } from "../data";
import { useDispatch } from "react-redux";
import { addToCart } from "@/lib/cartSlice";

export default function HomeProduct(props: any) {
    let sp = props.sp as ISanPham;
    const dispatch = useDispatch();

    return (
        <div className="bg-white p-4 shadow rounded max-w-screen-lg mx-auto">
            <img src={sp.hinh} alt="Product" className="w-full h-52 object-cover rounded mb-4 transition-transform duration-300 hover:scale-105"/>
            <h3 className="text-base font-bold mt-2 mb-4 hover:text-[#10375C] text-center line-clamp-1">
                <Link href={`/product/detail/${sp.id}`}>{sp.ten_sp}</Link>
            </h3>
            <div className="flex items-center justify-between mb-4">
                <p className="text-base font-bold">Giá: <span className="text-[#10375C]">{sp.gia_km.toLocaleString("vi-VN")} VNĐ</span></p>
                <p className="text-base font-bold line-through text-gray-500">{sp.gia.toLocaleString("vi-VN")} VNĐ</p>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
                <p className="font-semibold">Cập Nhật: {sp.ngay}</p>
                <p className="font-semibold">Lượt xem: {sp.luot_xem}</p>
            </div>
            <div className="flex justify-between mt-4">
                <button className="bg-[#10375C] text-white px-4 py-2 rounded hover:bg-[#F3C623] hover:text-[#10375C] transition-colors duration-200">Mua hàng</button>
                <button className="bg-[#F3C623] text-[#10375C] px-4 py-2 rounded hover:bg-[#10375C] hover:text-white transition-colors duration-200" onClick={() => dispatch(addToCart(sp))}>Thêm vào giỏ hàng</button>
            </div>
        </div>
    );
}
