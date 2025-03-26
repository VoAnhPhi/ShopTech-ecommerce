export interface iTinTuc {
    id: number;
    tieu_de: string;
    slug: string;
    mo_ta: string;
    ngay: string;
    noi_dung: string;
    luot_xem: number;
    id_loai: number;
    hinh: string;
    ten_loai: string;
}

export interface iLoaiTin {
    id: number;
    ten_loai: string;
    slug: string;
    thu_tu: number;
    an_hien: number;
}

export interface ILoai {
    id: number;
    ten_loai: string;
    thu_tu: number;
    an_hien: number;
}

export interface ICart {
    id : number 
    ten_sp: string;
    so_luong:number;
    gia_mua : number;
    hinh: string;
}

export interface ISanPham {
    id: number;
    ten_sp: string;
    gia: number;
    gia_km: number;
    ngay: string;
    hinh: string;
    id_loai: number;
    luot_xem: number;
    hot: string;
    an_hien: string;
    mo_ta: string;
    tinh_chat: string;
}

export interface User {
    id: number;
    ho_ten: string;
    email: string;
    so_dien_thoai: string;
    dia_chi: string;
    ghi_chu: string;
}

