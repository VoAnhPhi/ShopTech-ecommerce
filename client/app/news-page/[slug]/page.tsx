'use client'
import Image from 'next/image';
import Link from 'next/link';
import { iTinTuc } from '../../data';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function NewsDetail() {
  const params = useParams();
  const slug = params.slug as string;
  const [news, setNews] = useState<iTinTuc>();
  const [news_related, setNewsRelated] = useState<iTinTuc[]>([]);


  useEffect(() => {
    fetch(`http://localhost:3000/api/news/${slug}`)
      .then(res => res.json())
      .then(data => {
        setNews(data)
        const id_loai = data.id_loai
        fetch(`http://localhost:3000/api/news/related/${data.id_loai}`)
          .then(res => res.json())
          .then(data => setNewsRelated(data))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));


  }, [slug]);

  if (!news) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Đang tải bài viết...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
            <span>/</span>
            <Link href="/news-page" className="hover:text-blue-600">Tin tức</Link>
            <span>/</span>
            <span className="text-gray-400">{news?.tieu_de}</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="relative h-[400px] w-full">
            {news?.hinh && (
              <Image
                src={news.hinh}
                alt={news.tieu_de}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            )}
          </div>

          <div className="p-8">
            {/* Meta information */}
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                {news?.tieu_de}
              </span>
              <span>{news?.ngay}</span>
              <span>•</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold mb-6">{news?.tieu_de}</h1>

            {/* Summary */}
            <div className="text-xl text-gray-600 mb-8 border-l-4 border-blue-500 pl-4">
              {news?.mo_ta}
            </div>

            {/* Content */}
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: news?.noi_dung || "" }}
            />

            {/* Share buttons */}
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-lg font-semibold mb-4">Chia sẻ bài viết</h3>
              <div className="flex space-x-4">
                <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900">
                  Facebook
                </button>
                <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900">
                  Twitter
                </button>
                <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900">
                  WhatsApp
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Related articles */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Bài viết liên quan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news_related.map((i: iTinTuc) => (
              <div key={i.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={i.hinh}
                    alt="Related article"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold mb-2 hover:text-blue-600">
                    <Link href={`/news-page/${i.slug}`}>
                      Bài viết liên quan {i.tieu_de}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-600">Ngày đăng: 2023-06-15</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
