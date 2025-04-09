'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface ProductFormData {
    ten_sp: string;
    gia: number;
    gia_km: number;
    ngay: string;
    slug: string;
    hinh: string;
    tinh_chat: number;
    id_loai: number;
    luot_xem: number;
    hot: string;
    an_hien: number;
    mo_ta: string;
    attributes: Attribute;
}

interface Category {
    id: string;
    ten_loai: string;
    slug: string;
}

interface Attribute {
    can_nang: string;
    cpu: string;
    dia_cung: string;
    mau_sac: string;
    ram: string;
}

const ProductForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const isEditMode = !!id;


    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mock categories data
    const [categories, setCategories] = useState<Category[]>([]);
    const [attributes, setAttributes] = useState<Attribute[]>([]);
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`http://localhost:3000/admin/loai`)
                const data = await response.json();
                setCategories(data);
            } catch (err: any) {
                console.log(err);
            }
        }
        fetchCategories();
    }, []);


    const [formData, setFormData] = useState<ProductFormData>({
        ten_sp: '',
        gia: 0,
        gia_km: 0,
        ngay: '',
        slug: '',
        hinh: '',
        id_loai: 0,
        luot_xem: 0,
        hot: '',
        an_hien: 0,
        tinh_chat: 0,
        mo_ta: '',
        attributes: {
            can_nang: '',
            cpu: '',
            dia_cung: '',
            mau_sac: '',
            ram: ''
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (['can_nang', 'cpu', 'dia_cung', 'mau_sac', 'ram'].includes(name)) {
            setFormData((prev) => ({
                ...prev,
                attributes: {
                    ...prev.attributes,
                    [name]: value,
                },
            }));
            console.log(formData);
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        const form = new FormData();
        form.append('ten_sp', formData.ten_sp);
        form.append('gia', formData.gia.toString());
        form.append('gia_km', formData.gia_km.toString());
        form.append('id_loai', formData.id_loai.toString());
        form.append('hot', formData.hot);
        form.append('slug', formData.slug);
        form.append('an_hien', formData.an_hien.toString());
        form.append('mo_ta', formData.mo_ta);
        form.append('tinh_chat', formData.tinh_chat.toString());

        const fileInput = document.getElementById("hinh") as HTMLInputElement;
        if (fileInput?.files?.[0]) {
            form.append("hinh", fileInput.files[0]);
        }

        form.append("attributes", JSON.stringify(formData.attributes) || '{}');

        try {
            const response = await fetch(`http://localhost:3000/admin/product`, {
                method: 'POST',
                body: form
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Lỗi khi thêm sản phẩm');
            }

            toast.success('Thêm sản phẩm thành công');

            setTimeout(() => {
                router.push('/admin/products');
            }, 2000)

        } catch (err: any) {
            toast.error(err.message || "Lỗi thêm");
            console.error(err);
        
            if (err.message.includes("Thiếu dữ liệu")) {
                setIsSubmitting(false);
            }
        } finally {
            setIsSubmitting(true);
        }
    }

    return (
        <div className="container mx-auto">
            <ToastContainer />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                    {isEditMode ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                </h1>
                <Link
                    href="/admin/products"
                    className="flex items-center px-4 py-2 border bg-green-600 text-white rounded-md text-gray-700 hover:bg-green-700"
                >
                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                    Quay lại
                </Link>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="col-span-2">
                            <label htmlFor="ten_sp" className="block text-sm font-medium text-gray-700 mb-1">
                                Tên sản phẩm
                            </label>
                            <input
                                type="text"
                                id="ten_sp"
                                name="ten_sp"
                                value={formData.ten_sp}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div className="col-span-2">
                            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                                Slug
                            </label>
                            <input
                                type="text"
                                id="slug"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="id_loai" className="block text-sm font-medium text-gray-700 mb-1">
                                Danh mục
                            </label>
                            <select
                                id="id_loai"
                                name="id_loai"
                                value={formData.id_loai}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="">Chọn danh mục</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.ten_loai}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="an_hien" className="block text-sm font-medium text-gray-700 mb-1">
                                Ẩn hiện
                            </label>
                            <select
                                id="an_hien"
                                name="an_hien"
                                value={formData.an_hien}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="1">Hiện</option>
                                <option value="0">Ẩn</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="hot" className="block text-sm font-medium text-gray-700 mb-1">
                                Trạng thái hot
                            </label>
                            <select
                                id="hot"
                                name="hot"
                                value={formData.hot}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="1">Hot</option>
                                <option value="0">Không</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="gia" className="block text-sm font-medium text-gray-700 mb-1">
                                Giá (VNĐ)
                            </label>
                            <input
                                type="number"
                                id="gia"
                                name="gia"
                                value={formData.gia}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                                min="0"
                            />
                        </div>

                        <div>
                            <label htmlFor="gia_km" className="block text-sm font-medium text-gray-700 mb-1">
                                Giá khuyến mãi (VNĐ)
                            </label>
                            <input
                                type="number"
                                id="gia_km"
                                name="gia_km"
                                value={formData.gia_km}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                                min="0"
                            />
                        </div>

                        <div className="col-span-2">
                            <h1 className="text-xl font-medium text-gray-700 mb-8 mt-10">
                                Thông số sản phẩm
                            </h1>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="can_nang" className="block text-sm font-medium text-gray-700 mb-1">
                                        Cân nặng
                                    </label>
                                    <input
                                        type="text"
                                        id="can_nang"
                                        name="can_nang"
                                        value={formData.attributes.can_nang}
                                        onChange={handleChange}
                                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500' />
                                </div>
                                <div>
                                    <label htmlFor="cpu" className="block text-sm font-medium text-gray-700 mb-1">
                                        CPU
                                    </label>
                                    <input type="text" id="cpu" name="cpu" value={formData.attributes.cpu} onChange={handleChange} className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500' />
                                </div>
                                <div>
                                    <label htmlFor="dia_cung" className="block text-sm font-medium text-gray-700 mb-1">
                                        Đĩa cứng
                                    </label>
                                    <input type="text" id="dia_cung" name="dia_cung" value={formData.attributes.dia_cung} onChange={handleChange} className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500' />
                                </div>
                                <div>
                                    <label htmlFor="mau_sac" className="block text-sm font-medium text-gray-700 mb-1">
                                        Màu sắc
                                    </label>
                                    <input type="text" id="mau_sac" name="mau_sac" value={formData.attributes.mau_sac} onChange={handleChange} className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500' />
                                </div>
                                <div>
                                    <label htmlFor="ram" className="block text-sm font-medium text-gray-700 mb-1">
                                        RAM
                                    </label>
                                    <input type="text" id="ram" name="ram" value={formData.attributes.ram} onChange={handleChange} className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500' />
                                </div>
                            </div>
                        </div>

                        <div className="col-span-2">
                            <label htmlFor="mo_ta" className="block text-sm font-medium text-gray-700 mb-1">
                                Mô tả sản phẩm
                            </label>
                            <textarea
                                id="mo_ta"
                                name="mo_ta"
                                value={formData.mo_ta}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div className="col-span-2">
                            <label htmlFor="hinh" className="block text-sm font-medium text-gray-700 mb-1">
                                URL Hình ảnh
                            </label>
                            <input
                                type="file"
                                id="hinh"
                                name="hinh"
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <Link
                            href="/admin/products"
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Hủy
                        </Link>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Đang thêm...' : isEditMode ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm; 