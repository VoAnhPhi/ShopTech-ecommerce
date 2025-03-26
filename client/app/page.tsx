'use client'
import Show1SP from "./components/product";
import { ILoai, ISanPham } from "./data";
import ShowCategory from "./components/category";
import HomeProduct from "./components/homeProuct";
import Pagination from "./components/Pagination";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
// Interface cho dữ liệu phân trang
interface PaginationData {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export default function HomePage() {
  const searchParams = useSearchParams();
  const productRef = useRef<HTMLDivElement>(null);

  const [sp_hot, setSpHot] = useState<ISanPham[]>([]);
  const [sp_moi, setSpMoi] = useState<ISanPham[]>([]);
  const [category_arr, setCategoryArr] = useState<ILoai[]>([]);

  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 0,
  });

  useEffect(() => {
    const currentPage = searchParams.get('page') ? parseInt(searchParams.get('page') as string) : 1;
    const limit = 9;
    const offset = (currentPage - 1) * limit;

    fetch(`http://localhost:3000/api/sphot/3`)
      .then(res => res.json())
      .then(data => setSpHot(data));

    fetch(`http://localhost:3000/api/products/page/${currentPage}`)
      .then(res => res.json())
      .then(data => {
        setSpMoi(data.products);
        setPagination(data.pagination);

        if (currentPage > 1) {
          setTimeout(() => {
            productRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      });

    fetch(`http://localhost:3000/api/loai`)
      .then(res => res.json())
      .then(data => setCategoryArr(data));
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Enhanced Hero Banner Section */}
        <div className="w-full h-[500px] relative rounded-xl overflow-hidden my-6">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 z-10"></div>
          <Image
            src="https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
            alt="Latest technology devices"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="absolute inset-0 flex flex-col justify-center items-start z-20 p-16">
            <h1 className="text-5xl font-bold text-white mb-4 max-w-xl">Khám Phá Công Nghệ Mới Nhất</h1>
            <p className="text-xl text-white mb-8 max-w-xl">Ưu đãi hấp dẫn với giảm giá lên đến 50% cho tất cả sản phẩm mới.</p>
            <div className="flex gap-4">
              <Link href="/product" className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors">
                Mua Ngay
              </Link>
              <Link href="/product?hot=1" className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors">
                Khám Phá Thêm
              </Link>
            </div>
          </div>
        </div>

        <section className="py-8 px-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold mb-4">Sản phẩm nổi bật</h2>
            <div className="mt-4 text-right">
              <Link
                href="/product?hot=1"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Xem tất cả sản phẩm nổi bật
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sp_hot.map((sp: ISanPham) => <Show1SP key={sp.id} sp={sp}></Show1SP>)}
          </div>
        </section>

        <section className="py-8 px-4 flex gap-6 pt-26" ref={productRef}>
          <aside className="bg-white p-4 shadow-md w-1/4 rounded">
            <h3 className="text-xl font-semibold mb-4">Lọc sản phẩm</h3>
            <div className="mb-4">
              <h4 className="font-medium mb-4">Theo danh mục</h4>
              <ul className="grid grid-cols-2 gap-2">
                {category_arr.map((category: ILoai) => <ShowCategory key={category.id} category={category}></ShowCategory>)}
              </ul>
            </div>
            <div className="mb-4">
              <h4 className="font-medium">Theo giá</h4>
              <input type="range" min="0" max="50000000" className="w-full" />
              <div className="flex justify-between text-sm text-gray-600">
                <span>0 VNĐ</span>
                <span>50,000,000 VNĐ</span>
              </div>
            </div>
            <div className="mb-4">
              <h4 className="font-medium mb-4">Sản phẩm mới</h4>
              <Link href="/product" className="text-blue-500 hover:underline">Xem ngay</Link>
            </div>
            <div>
              <h4 className="font-medium mb-4">Mua nhiều</h4>
              <Link href="/product?sort=popular" className="text-blue-500 hover:underline">Xem ngay</Link>
            </div>
          </aside>

          <div className="w-3/4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Tất cả sản phẩm</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Hiển thị {sp_moi.length} / {pagination.total} sản phẩm
                </span>
                <Link
                  href="/page-product"
                  className="text-blue-600 text-sm hover:underline"
                >
                  Xem tất cả
                </Link>
              </div>
            </div>

            {sp_moi.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sp_moi.map((sp: ISanPham) => <HomeProduct key={sp.id} sp={sp}></HomeProduct>)}
              </div>
            ) : (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <p className="text-yellow-700">Không tìm thấy sản phẩm nào.</p>
              </div>
            )}

            <Pagination
              totalPages={pagination.totalPages}
              currentPage={pagination.currentPage}
              baseUrl="/?"
            />
          </div>
        </section>

        {/* Device Showcase Section */}
        <section className="py-16 px-4 bg-white rounded-xl my-8 shadow-sm">
          <h2 className="text-3xl font-bold text-center mb-12">Khám Phá Thiết Bị Công Nghệ</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center">
              <div className="h-52 w-52 relative mb-4">
                <Image
                  src="https://images.unsplash.com/photo-1585060544812-6b45742d762f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1481&q=80"
                  alt="Smartphone"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Điện Thoại</h3>
              <p className="text-gray-600 text-center">Khám phá các điện thoại thông minh mới nhất với công nghệ tiên tiến</p>
              <Link href="/product?category=phone" className="mt-4 text-blue-600 font-medium hover:underline">
                Xem Điện Thoại
              </Link>
            </div>

            <div className="flex flex-col items-center">
              <div className="h-52 w-52 relative mb-4">
                <Image
                  src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
                  alt="Laptop"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Laptop</h3>
              <p className="text-gray-600 text-center">Hiệu suất mạnh mẽ với thiết kế hiện đại cho công việc và giải trí</p>
              <Link href="/product?category=laptop" className="mt-4 text-blue-600 font-medium hover:underline">
                Xem Laptop
              </Link>
            </div>

            <div className="flex flex-col items-center">
              <div className="h-52 w-52 relative mb-4">
                <Image
                  src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80"
                  alt="Smartwatch"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Đồng Hồ Thông Minh</h3>
              <p className="text-gray-600 text-center">Theo dõi sức khỏe và kết nối mọi lúc mọi nơi</p>
              <Link href="/product?category=watch" className="mt-4 text-blue-600 font-medium hover:underline">
                Xem Đồng Hồ
              </Link>
            </div>

            <div className="flex flex-col items-center">
              <div className="h-52 w-52 relative mb-4">
                <Image
                  src="https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=2670&auto=format&fit=crop"
                  alt="Headphones"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Tai Nghe</h3>
              <p className="text-gray-600 text-center">Trải nghiệm âm thanh hoàn hảo với công nghệ khử tiếng ồn</p>
              <Link href="/product?category=headphone" className="mt-4 text-blue-600 font-medium hover:underline">
                Xem Tai Nghe
              </Link>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link href="/product" className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors">
              Xem Tất Cả Sản Phẩm
            </Link>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-12 px-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mb-8 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Đăng Ký Nhận Thông Tin</h2>
            <p className="text-lg mb-8">Nhận thông tin về sản phẩm mới và ưu đãi đặc biệt</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="px-6 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white w-full sm:w-96"
              />
              <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-50">
                Đăng Ký
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

