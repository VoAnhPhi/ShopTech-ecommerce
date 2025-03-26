import Link from 'next/link';
import Image from 'next/image';
import { TinTucModel } from '../../data';
import Pagination from "../../components/Pagination";
import HomeProduct from "../../components/homeProuct";
import { Op } from 'sequelize';

interface PaginationData {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
}

export default async function SearchPage(
    { searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }
) {
    const limit = 6;
    let currentPage = searchParams.page ? Number(searchParams.page) : 1;
    let key = searchParams.key ? String(searchParams.key).trim() : "";
    const totalNews = await TinTucModel.count({
        where: { an_hien: 1, tieu_de: { [Op.like]: `%${key}%` } }
    });
    const totalPages = Math.ceil(totalNews / limit);
    const newsData = await TinTucModel.findAll({
        where: { an_hien: 1, tieu_de: { [Op.like]: `%${key}%` } },
        order: [['ngay', 'DESC']],
        offset: (currentPage - 1) * limit,
        limit: limit
    });

    let pagination: PaginationData = {
        total: totalNews,
        totalPages: totalPages,
        currentPage: currentPage,
        limit: limit
    }

    if (!key) {
        return (
            <div className="min-h-screen bg-gray-100">
                <div className="max-w-[1400px] mx-auto px-4 py-8">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                        <p className="text-yellow-700">Vui lòng nhập từ khóa tìm kiếm.</p>
                    </div>
                    <div className="mt-4">
                        <Link href="/" className="text-blue-600 hover:underline">
                            ← Quay lại trang chủ
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Banner */}
            <div className="w-full h-64 bg-blue-600 text-white flex items-center justify-center">
                <div className="max-w-[1400px] mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-4">Tin Tức & Bài Viết</h1>
                    <p className="text-xl">Cập nhật những thông tin mới nhất về công nghệ và sản phẩm</p>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 py-8">
                {/* Phần lọc và tìm kiếm */}

                {/* Tin tức nổi bật */}

                {/* Tất cả tin tức */}
                <div>
                    <h2 className="text-2xl font-bold mb-6 border-b pb-2">Tất Cả Tin Tức</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {newsData.map((news) => (
                            <div key={news.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                                <div className="relative h-48">
                                    <Image
                                        src={news.hinh}
                                        alt={news.tieu_de}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-2">
                                        {/* <span className="text-sm text-blue-600 font-medium">{news.ten_loai}</span> */}
                                        {/* <span className="text-sm text-gray-500">{news.ngay}</span> */}
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 hover:text-blue-600">
                                        <Link href={`/news-page/${news.id}`}>{news.tieu_de}</Link>
                                    </h3>
                                    <p className="text-gray-600 mb-4 line-clamp-2">{news.mo_ta}</p>
                                    <div className="flex justify-between items-center">
                                        {/* <span className="text-sm text-gray-500">{news.noi_dung}</span> */}
                                        <Link href={`/news-page/${news.id}`} className="text-blue-600 hover:underline">Đọc tiếp</Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Phân trang */}
                    <div className="flex justify-center mt-10">
                        <div className="flex space-x-2">
                            <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">Trước</button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
                            <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">2</button>
                            <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">3</button>
                            <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">Sau</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
