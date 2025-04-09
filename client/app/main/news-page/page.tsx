'use client'
import Link from 'next/link';
import Image from 'next/image';
import { iTinTuc, iLoaiTin } from '../../data';
import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Pagination from '../../components/Pagination';

interface PaginationData {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export default function NewsPage() {
  const searchParams = useSearchParams();
  const newRef = useRef<HTMLDivElement>(null);
  const [loai_tin, setLoaiTin] = useState<iLoaiTin[]>([]);
  const [tin, setTin] = useState<iTinTuc[]>([]);

  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 0,
  });

  useEffect(() => {
    const currentPage = searchParams.get('page') ? parseInt(searchParams.get('page') as string) : 1;
    console.log(currentPage);
    const limit = 10;
    const offset = (currentPage - 1) * limit;

    fetch('http://localhost:3000/api/news/loai_tin')
      .then(res => res.json())
      .then(data => setLoaiTin(data))
      .catch(err => console.log(err));

    fetch(`http://localhost:3000/api/news/${limit}/page/${currentPage}`)
      .then(res => res.json())
      .then(data => {
        setTin(data.news);
        setPagination(data.pagination);
        if (currentPage > 1) {
          setTimeout(() => {
            newRef.current?.scrollIntoView({ behavior: 'smooth' })
          }, 100)
        }
      })
      .catch(err => console.log(err));
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="w-full h-64 bg-blue-600 text-white flex items-center justify-center relative">
        <Image
          src="https://images.unsplash.com/photo-1503694978374-8a2fa686963a?q=80&w=2669&auto=format&fit=crop"
          alt="news-banner"
          fill
          className="absolute object-cover z-0"
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/20 z-0" />
        <div className="max-w-[1400px] mx-auto px-4 text-center z-10">
          <h1 className="text-4xl font-bold mb-4">Tin Tức & Bài Viết</h1>
          <p className="text-xl">Cập nhật những thông tin mới nhất về công nghệ và sản phẩm</p>
        </div>
      </div>


      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="w-full md:w-1/2">

              <form action="/main/news-page/search" method="GET" className="bg-white p-6 rounded-lg">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="w-full md:flex-1">
                    <input
                      type="text"
                      name="key"
                      placeholder="Tìm kiếm bài viết..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="w-full md:w-auto">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Tìm kiếm
                    </button>
                  </div>
                </div>
              </form>

            </div>
            <div className="w-full md:w-1/2 flex flex-wrap gap-2">
              <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Tất cả</button>
              {loai_tin.map((category: iLoaiTin, index: number) => (
                <button
                  key={index}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  {category.ten_loai}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">Tin Tức Nổi Bật</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="relative h-80">

                {tin.map((news: iTinTuc) =>
                  <div key={news.id} className="relative h-80">
                    <Image src={news.hinh} alt={news.tieu_de} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-blue-600 font-medium">{news.ten_loai}</span>
                        <span className="text-sm text-gray-500">{news.ngay}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2 hover:text-blue-600">
                        {news.tieu_de}
                      </h3>
                      <p className="text-gray-600 mb-4">{news.mo_ta}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Tác giả: {news.noi_dung}</span>
                        <Link href={`/main/news-page/${news.slug}`} className="text-blue-600 hover:underline">Đọc tiếp</Link>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {tin.slice(2, 5).map((news: iTinTuc) => (
                <div key={news.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow flex">
                  <div className="relative w-1/3 min-h-[150px]">
                    <Image
                      src={news.hinh}
                      alt={news.tieu_de}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="p-4 w-2/3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-blue-600 font-medium">{news.ten_loai}</span>
                      <span className="text-xs text-gray-500">{news.ngay}</span>
                    </div>
                    <h3 className="text-lg font-bold mb-2 hover:text-blue-600">
                      {news.tieu_de}
                    </h3>
                    <Link href={`/main/news-page/${news.slug}`} className="text-blue-600 text-sm hover:underline">Đọc tiếp</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div ref={newRef} className='pt-26'>
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">Tất Cả Tin Tức</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tin.map((news: iTinTuc) => (
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
                    <Link href={`/main/news-page/${news.slug}`}>{news.tieu_de}</Link>
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{news.mo_ta}</p>
                  <div className="flex justify-between items-center">
                    {/* <span className="text-sm text-gray-500">{news.noi_dung}</span> */}
                    <Link href={`/main/news-page/${news.slug}`} className="text-blue-600 hover:underline">Đọc tiếp</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* <div className="flex justify-center mt-10"> */}
          <Pagination
            totalPages={pagination.totalPages}
            currentPage={pagination.currentPage}
            baseUrl="/main/news-page"
          />
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}
