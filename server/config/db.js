const { Sequelize, DataTypes } = require('sequelize');
// Tạo đối tượng kết nối đến database
const sequelize = new Sequelize('laptop_node', 'root', '', {
    host: 'localhost', dialect: 'mysql'
});

// model mô tả table loai
const LoaiModel = sequelize.define('loai',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        ten_loai: { type: DataTypes.STRING, allowNull: false },
        slug: { type: DataTypes.STRING, allowNull: false },
        thu_tu: { type: DataTypes.INTEGER, defaultValue: 0 },
        an_hien: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    {
        timestamps: true,
        paranoid: true,
        tableName: "loai",
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    }
);

// model diễn tả cấu trúc 2 table san_pham 
const SanPhamModel = sequelize.define('san_pham',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        ten_sp: { type: DataTypes.STRING },
        ngay: { type: DataTypes.DATE },
        gia: { type: DataTypes.INTEGER },
        gia_km: { type: DataTypes.INTEGER },
        id_loai: { type: DataTypes.INTEGER },
        hot: { type: DataTypes.INTEGER },
        slug: { type: DataTypes.STRING },
        an_hien: { type: DataTypes.INTEGER },
        hinh: { type: DataTypes.STRING },
        mo_ta: { type: DataTypes.STRING },
        tinh_chat: { type: DataTypes.INTEGER, defaultValue: 0 },
        luot_xem: { type: DataTypes.INTEGER, defaultValue: 0 }
    },
    {
        timestamps: true,
        paranoid: true,
        tableName: "san_pham",
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    }
);

const AttributesProduct = sequelize.define('thuoc_tinh',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        id_sp: { type: DataTypes.INTEGER, foreignKey: true, allowNull: false },
        ram: { type: DataTypes.STRING },
        cpu: { type: DataTypes.STRING },
        dia_cung: { type: DataTypes.STRING },
        mau_sac: { type: DataTypes.STRING },
        can_nang: { type: DataTypes.STRING }
    },
    {
        timestamps: true,
        paranoid: true,
        tableName: "thuoc_tinh",
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    }
)

// model diễn tả cấu trúc 2 table don_hang 
const DonHangModel = sequelize.define('don_hang', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    thoi_diem_mua: { type: DataTypes.DATE, defaultValue: new Date },
    ho_ten: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    ghi_chu: { type: DataTypes.STRING, defaultValue: "" },
    dia_chi: { type: DataTypes.STRING },
    status: { type: DataTypes.TINYINT, defaultValue: 0 },
},
    {
        timestamps: true,
        paranoid: true,
        tableName: "don_hang",
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    }
);


const DonHangChiTietModel = sequelize.define('don_hang_chi_tiet', {
    id_ct: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_dh: { type: DataTypes.INTEGER },
    id_sp: { type: DataTypes.INTEGER },
    so_luong: { type: DataTypes.INTEGER },
},
    {
        timestamps: true,
        paranoid: true,
        tableName: "don_hang_chi_tiet",
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    }
);

const UserModel = sequelize.define('users', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ho_ten: { type: DataTypes.STRING, require: true },
    email: { type: DataTypes.STRING, require: true },
    mat_khau: { type: DataTypes.STRING, require: true },
    dia_chi: { type: DataTypes.STRING, require: true },
    dien_thoai: { type: DataTypes.STRING, require: true },
    vai_tro: { type: DataTypes.TINYINT, defaultValue: 0 },
    khoa: { type: DataTypes.TINYINT, defaultValue: 0 }
},
    {
        timestamps: true,
        paranoid: true,
        tableName: "users",
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    }
);

const TinTucModel = sequelize.define('tin_tuc', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    tieu_de: { type: DataTypes.STRING, require: true },
    slug: { type: DataTypes.STRING, require: true },
    mo_ta: { type: DataTypes.TEXT, require: true },
    hinh: { type: DataTypes.STRING, require: true },
    ngay: { type: DataTypes.DATE, require: true },
    noi_dung: { type: DataTypes.TEXT, require: true },
    id_loai: { type: DataTypes.INTEGER },
    luot_xem: { type: DataTypes.INTEGER, defaultValue: 0 },
    an_hien: { type: DataTypes.TINYINT, defaultValue: 0 },
},
    {
        timestamps: true,
        paranoid: true,
        tableName: "tin_tuc",
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    }
)

const LoaiTinModel = sequelize.define('loai_tin', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ten_loai: { type: DataTypes.STRING, require: true },
    slug: { type: DataTypes.STRING, require: true },
    thu_tu: { type: DataTypes.INTEGER, defaultValue: 0 },
    an_hien: { type: DataTypes.TINYINT, defaultValue: 0 },
},
    {
        timestamps: true,
        paranoid: true,
        tableName: "loai_tin",
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    }
)

module.exports = { SanPhamModel, LoaiModel, DonHangModel, DonHangChiTietModel, UserModel, TinTucModel, LoaiTinModel, AttributesProduct }
