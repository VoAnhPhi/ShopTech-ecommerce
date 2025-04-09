const express = require("express");
const router = express.Router();
const { LoaiModel, TinTucModel, LoaiTinModel, SanPhamModel, DonHangModel, DonHangChiTietModel, UserModel, AttributesProduct } = require("../config/db");
const { Op } = require("sequelize");
const { literal } = require("sequelize");

require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const upload = require("../utils/upload");
const cloudinary = require("../utils/cloudinary");


//routes
router.get("/", async (req, res) => {
    res.json({ message: "Hello World" });
})

// LOẠI {
router.get("/loai", async (req, res) => {
    try {
        const loai_arr = await LoaiModel.findAll();

        // Đếm sản phẩm theo loại
        const counts = await SanPhamModel.findAll({
            attributes: ["id_loai", [literal('COUNT(*)'), "count"]],
            group: ["id_loai"],
            raw: true
        });

        // Map lại dữ liệu
        const result = loai_arr.map(loai => {
            const found = counts.find(c => c.id_loai === loai.id);
            return {
                ...loai.toJSON(),
                product_count: found ? +found.count : 0
            };
        });

        res.json(result);
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});

router.get("/loai-da-xoa", async (req, res) => {
    try {
        const loai_arr = await LoaiModel.findAll({
            where: {
                deleted_at: { [Op.ne]: null }
            },
            paranoid: false // quan trọng
        });

        res.json(loai_arr);
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});

router.get("/loai/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const loai = await LoaiModel.findByPk(id);
        if (!loai) {
            return res.status(404).json({ message: "Không tìm thấy loại sản phẩm" });
        }
        res.json(loai);
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
})

router.post("/loai", async (req, res) => {
    try {
        const { ten_loai, slug, thu_tu, an_hien } = req.body;

        if (!ten_loai || ten_loai.trim() === "") {
            return res.status(400).json({ message: "Tên loại không được để trống" });
        }

        if (!slug || slug.trim() === "") {
            return res.status(400).json({ message: "Slug không được để trống" });
        }

        // Kiểm tra ẩn hiện hợp lệ (chỉ 0 hoặc 1)
        if (an_hien !== 0 && an_hien !== 1) {
            return res.status(400).json({ message: "Trạng thái ẩn/hiện không hợp lệ" });
        }

        // Kiểm tra thứ tự không âm
        if (thu_tu < 0) {
            return res.status(400).json({ message: "Thứ tự không hợp lệ" });
        }

        // Slug ít nhất 3 ký tự
        if (slug.length < 3) {
            return res.status(400).json({ message: "Slug phải có ít nhất 3 ký tự" });
        }

        // Kiểm tra trùng tên loại
        const ten_loai_exists = await LoaiModel.findOne({ where: { ten_loai } });
        if (ten_loai_exists) {
            return res.status(400).json({ message: "Tên loại đã tồn tại" });
        }

        // Kiểm tra trùng slug
        const slug_exists = await LoaiModel.findOne({ where: { slug } });
        if (slug_exists) {
            return res.status(400).json({ message: "Slug đã tồn tại" });
        }

        // Sau khi đã kiểm tra hết → mới tạo
        const loai = await LoaiModel.create({ ten_loai, slug, thu_tu, an_hien });

        res.json({
            status: 200,
            message: "Tạo loại sản phẩm thành công",
            loai: loai
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});

router.put("/loai/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { ten_loai, slug, thu_tu, an_hien } = req.body;

        const loai = await LoaiModel.findByPk(id);
        if (!loai) {
            return res.status(404).json({ message: "Không tìm thấy loại sản phẩm" });
        }
        if (thu_tu < 0) {
            return res.status(400).json({ message: "Thứ tự không hợp lệ" });
        }

        if (ten_loai !== undefined) {
            const ten_loai_exists = await LoaiModel.findOne({
                where: {
                    ten_loai,
                    id: { [Op.ne]: id }
                }
            });
            if (ten_loai_exists) {
                return res.status(400).json({ message: "Tên loại đã tồn tại" });
            }
        }

        if (slug !== undefined) {
            const slug_exists = await LoaiModel.findOne({
                where: {
                    slug,
                    id: { [Op.ne]: id }
                }
            });
            if (slug_exists) {
                return res.status(400).json({ message: "Slug đã tồn tại" });
            }
        }

        if (thu_tu !== undefined && thu_tu >= 0) {
            loai.thu_tu = thu_tu;
        } else {
            return res.status(400).json({ message: "Thứ tự không hợp lệ" });
        }

        if (an_hien !== undefined) loai.an_hien = an_hien;
        await loai.save();
        res.json({
            status: 200,
            message: "Cập nhật loại sản phẩm thành công",
            loai: loai
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});

router.patch("/loai/khoi-phuc/:id", async (req, res) => {
    try {
        const id = req.params.id;

        // Lấy luôn cả loại đã xóa (vì mặc định paranoid sẽ ẩn đi)
        const loai = await LoaiModel.findByPk(id, { paranoid: false });

        if (!loai || loai.deleted_at === null) {
            return res.status(404).json({ message: "Không có loại nào để khôi phục" });
        }

        await loai.restore(); // Khôi phục lại deleted_at = null

        res.json({ status: 200, message: "Khôi phục thành công" });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});

router.delete("/loai/:id", async (req, res) => {
    try {
        const id = req.params.id;

        // Tìm loại (mặc định Sequelize sẽ bỏ qua deleted_at ≠ NULL)
        const loai = await LoaiModel.findByPk(id);
        if (!loai) {
            return res.status(404).json({ message: "Không tìm thấy loại sản phẩm hoặc đã bị xóa" });
        }

        const count = await SanPhamModel.count({ where: { id_loai: id } });

        if (count > 0) {
            return res.status(400).json({
                message: `Không thể xóa loại: có ${count} sản phẩm thuộc loại này`
            })
        }

        // Gọi destroy() sẽ chỉ cập nhật deleted_at (do paranoid: true)
        await loai.destroy();

        res.json({
            status: 200,
            message: "Xóa mềm loại sản phẩm thành công"
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});

router.delete("/loai/xoa-vinh-vien/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const loai = await LoaiModel.findByPk(id, { paranoid: false });

        if (!loai) {
            return res.status(404).json({ message: "Không tìm thấy loại sản phẩm ( kể cả khi đã xóa mềm )" })
        }

        if (loai.deleted_at === null) {
            return res.status(400).json({ message: "Chỉ được xóa vĩnh viễn loại đã bị xóa mềm" });
        }

        await loai.destroy({ force: true });

        res.json({
            status: 200,
            message: "Đã xóa vĩnh viễn loại sản phẩm này"
        })
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
})
// }

// SAN PHAM {
router.get("/product/page/:page", async (req, res) => {
    try {
        const page = Number(req.params.page) || 1;
        const limit = Number(req.query.limit) || 12;
        const offset = (page - 1) * limit;
        const total = await SanPhamModel.count();
        const totalPages = Math.ceil(total / limit);

        const product_arr = await SanPhamModel.findAll({
            limit: limit,
            offset: offset,
            order: [['id', 'DESC']],
        });

        const categories = await LoaiModel.findAll({
            attributes: ["id", "ten_loai"]
        });

        const attributes = await AttributesProduct.findAll({
            where: {
                id_sp: { [Op.in]: product_arr.map(product => product.id) }
            }
        })

        const categoryMap = new Map();
        categories.forEach(category => {
            categoryMap.set(category.id, category.ten_loai);
        });

        const attrMap = new Map();
        attributes.forEach(attr => {
            attrMap.set(attr.id_sp, attr.toJSON());
        });

        const productWithCategoryAndAttributes = product_arr.map(product => {
            const category = categoryMap.get(product.id_loai);
            const attributes = attrMap.get(product.id);
            return {
                ...product.toJSON(),
                category: category || null,
                attributes: attributes || null
            };
        });

        if (product_arr.length === 0) {
            return res.status(404).json({ message: "Không có sản phẩm nào." });
        }
        res.json({
            products: productWithCategoryAndAttributes,
            pagination: {
                total: total,
                totalPages: totalPages,
                currentPage: page,
                limit: limit
            }
        });

    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});

router.get("/product/category/:id/page/:page", async (req, res) => {
    try {
        const id = req.params.id;
        const page = Number(req.params.page) || 1;
        const limit = Number(req.query.limit) || 9;
        const offset = (page - 1) * limit;

        const total = await SanPhamModel.count({
            where: {
                id_loai: id
            }
        });

        const totalPages = Math.ceil(total / limit);

        const product_arr = await SanPhamModel.findAll({
            where: {
                id_loai: id
            },
            limit: limit,
            offset: offset,
            order: [['id', 'DESC']],
        });

        if (product_arr.length === 0) {
            return res.status(404).json({ message: "Không có sản phẩm nào." });
        }

        const categories = await LoaiModel.findAll({
            attributes: ["id", "ten_loai"]
        });

        const attributes = await AttributesProduct.findAll({
            where: {
                id_sp: { [Op.in]: product_arr.map(product => product.id) }
            }
        })

        const categoryMap = new Map();
        categories.forEach(category => {
            categoryMap.set(category.id, category.ten_loai);
        });

        const attrMap = new Map();
        attributes.forEach(attr => {
            attrMap.set(attr.id_sp, attr.toJSON());
        });

        const productWithCategoryAndAttributes = product_arr.map(product => {
            const category = categoryMap.get(product.id_loai);
            const attributes = attrMap.get(product.id);
            return {
                ...product.toJSON(),
                category: category || null,
                attributes: attributes || null
            };
        });

        res.json({
            products: productWithCategoryAndAttributes,
            pagination: {
                total: total,
                totalPages: totalPages,
                currentPage: page,
                limit: limit
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});


router.get("/product-da-xoa/page/:page", async (req, res) => {
    try {
        const page = Number(req.params.page) || 1;
        const limit = Number(req.query.limit) || 12;
        const offset = (page - 1) * limit;
        const total = await SanPhamModel.count({
            where: {
                deleted_at: { [Op.ne]: null }
            },
            paranoid: false
        })

        const totalPages = Math.ceil(total / limit);

        const product_arr = await SanPhamModel.findAll({
            where: {
                deleted_at: { [Op.ne]: null }
            },
            limit: limit,
            offset: offset,
            order: [['id', 'DESC']],
            paranoid: false
        })

        const categories = await LoaiModel.findAll({
            attributes: ["id", "ten_loai"]
        });

        const attributes = await AttributesProduct.findAll({
            where: {
                id_sp: { [Op.in]: product_arr.map(product => product.id) }
            },
            paranoid: false
        })

        const categoryMap = new Map();
        categories.forEach(category => {
            categoryMap.set(category.id, category.ten_loai);
        });

        const attrMap = new Map();
        attributes.forEach(attr => {
            attrMap.set(attr.id_sp, attr.toJSON());
        });

        const productWithCategoryAndAttributes = product_arr.map(product => {
            const category = categoryMap.get(product.id_loai);
            const attributes = attrMap.get(product.id);
            return {
                ...product.toJSON(),
                category: category || null,
                attributes: attributes || null
            };
        });

        res.json({
            products: productWithCategoryAndAttributes,
            pagination: {
                total: total,
                totalPages: totalPages,
                currentPage: page,
                limit: limit
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message })
    }
})

router.get("/product/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const product = await SanPhamModel.findByPk(id);

        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }

        const attributes = await AttributesProduct.findOne({
            where: {
                id_sp: id
            }
        })

        const result = {
            ...product.toJSON(),
            attributes: attributes
        }

        res.json(result);
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});

router.post("/product", upload.single("hinh"), async (req, res) => {
    try {
        const {
            ten_sp, gia, gia_km, id_loai, hot,
            slug, an_hien, mo_ta, tinh_chat
        } = req.body;

        const existed = await SanPhamModel.findOne({ where: { slug } });
        if (existed) {
            return res.status(400).json({ message: "Sản phẩm đã tồn tại (slug trùng)" });
        }

        if (!ten_sp || !gia || !id_loai || !slug) {
            return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc" });
        }

        const loai = await LoaiModel.findByPk(id_loai);
        if (!loai) {
            return res.status(400).json({ message: "Loại sản phẩm không tồn tại" });
        }

        // Upload image to Cloudinary if file exists
        let hinh_url = "";
        if (req.file) {
            hinh_url = req.file.path || req.file.filename || req.file.originalname || '';
        }

        const product = await SanPhamModel.create({
            ten_sp,
            ngay: new Date(),
            gia,
            gia_km: gia_km || 0,
            id_loai,
            hot: hot || 0,
            slug,
            an_hien: an_hien || 0,
            mo_ta: mo_ta || "",
            tinh_chat: tinh_chat || 0,
            hinh: hinh_url
        });

        let attributes = {};
        try {
            attributes = JSON.parse(req.body.attributes);
        } catch (err) {
            return res.status(400).json({ message: "Lỗi định dạng attributes", error: err.message });
        }

        const create_attributes = await AttributesProduct.create({
            id_sp: product.id,
            ...attributes
        });

        res.status(200).json({
            message: "Tạo sản phẩm thành công",
            product: {
                ...product.toJSON(),
                attributes: create_attributes.toJSON()
            }
        });
    } catch (err) {
        console.error("Lỗi server:", err);
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});


router.put("/product/:id", upload.single("hinh"), async (req, res) => {
    try {
        const id = req.params.id;
        const { ten_sp, gia, gia_km, id_loai, hot, slug, an_hien, mo_ta, tinh_chat, attributes } = req.body;

        const product = await SanPhamModel.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }

        // Nếu cập nhật slug, kiểm tra trùng
        if (slug && slug !== product.slug) {
            const slug_exists = await SanPhamModel.findOne({
                where: {
                    slug,
                    id: { [Op.ne]: id }
                }
            });
            if (slug_exists) {
                return res.status(400).json({ message: "Slug đã tồn tại" });
            }
        }

        if (attributes) {
            const existingAttr = await AttributesProduct.findOne({ where: { id_sp: id } });

            if (existingAttr) {
                await existingAttr.update({ ...attributes });
            } else {
                await AttributesProduct.create({
                    id_sp: id,
                    ...attributes
                });
            }
        }

        // Nếu cập nhật id_loai, kiểm tra loại tồn tại
        if (id_loai && id_loai !== product.id_loai) {
            const loai = await LoaiModel.findByPk(id_loai);
            if (!loai) {
                return res.status(400).json({ message: "Loại sản phẩm không tồn tại" });
            }
        }

        // Upload image to Cloudinary if file exists
        let hinh_url = "";
        if (req.file) {
            hinh_url = req.file.path;
        }

        // Cập nhật các trường
        if (ten_sp !== undefined) product.ten_sp = ten_sp;
        if (gia !== undefined) product.gia = gia;
        if (gia_km !== undefined) product.gia_km = gia_km;
        if (id_loai !== undefined) product.id_loai = id_loai;
        if (hot !== undefined) product.hot = hot;
        if (slug !== undefined) product.slug = slug;
        if (an_hien !== undefined) product.an_hien = an_hien;
        if (mo_ta !== undefined) product.mo_ta = mo_ta;
        if (tinh_chat !== undefined) product.tinh_chat = tinh_chat;

        await product.save();

        res.json({
            status: 200,
            message: "Cập nhật sản phẩm thành công",
            product: {
                ...product.toJSON(),
                attributes: attributes
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});

router.delete("/product/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const product = await SanPhamModel.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }

        const attributes = await AttributesProduct.findOne({ where: { id_sp: id } });
        if (attributes) {
            await attributes.destroy();
        }

        await product.destroy();

        res.json({
            status: 200,
            message: "Xóa sản phẩm thành công",
            product: {
                ...product.toJSON(),
                attributes: attributes
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});

router.patch("/product/khoi-phuc/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const product = await SanPhamModel.findByPk(id, { paranoid: false });
        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }

        const attributes = await AttributesProduct.findOne({ where: { id_sp: id }, paranoid: false });
        if (attributes) {
            await attributes.restore();
        }

        if (product.deleted_at === null) {
            return res.status(400).json({ message: "Chỉ được khôi phục sản phẩm đã bị xóa mềm" });
        }

        await product.restore();

        res.json({
            status: 200,
            message: "Khôi phục sản phẩm thành công",
            product: {
                ...product.toJSON(),
                attributes: attributes
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
})

router.delete("/product/xoa-vinh-vien/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const product = await SanPhamModel.findByPk(id, { paranoid: false });
        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }

        if (product.deleted_at === null) {
            return res.status(400).json({ message: "Chỉ được xóa vĩnh viễn sản phẩm đã bị xóa mềm" });
        }

        const attributes = await AttributesProduct.findOne({ where: { id_sp: id }, paranoid: false });

        if (attributes) {
            await attributes.destroy({
                force: true
            });
        }

        await product.destroy({ force: true });

        res.json({
            status: 200,
            message: "Xóa vĩnh viễn sản phẩm thành công"
        });
    } catch (err) {
        console.error('Lỗi khi xóa sản phẩm:', err);
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});
// }

// TIN TỨC {
router.get("/news/page/:page", async (req, res) => {
    try {
        const page = Number(req.params.page) || 1;
        const limit = Number(req.query.limit) || 12;
        const offset = (page - 1) * limit;
        const total = await TinTucModel.count();
        const totalPages = Math.ceil(total / limit);

        const news_arr = await TinTucModel.findAll({
            limit: limit,
            offset: offset,
            order: [['id', 'DESC']]
        });

        if (news_arr.length === 0) {
            return res.status(404).json({ message: "Không có tin tức nào." });
        }

        const news_category_arr = await LoaiTinModel.findAll({
            order: [['id', 'DESC']]
        });

        const news_category = new Map();
        news_category_arr.forEach(item => {
            news_category.set(item.id, item.ten_loai);
        });

        const news_with_category = news_arr.map(item => {
            return {
                ...item.toJSON(),
                category: news_category.get(item.id_loai)
            }
        });

        res.json({
            news: news_with_category,
            news_category: news_category_arr,
            pagination: {
                total: total,
                totalPages: totalPages,
                currentPage: page,
                limit: limit
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});

router.get("/news/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const news = await TinTucModel.findByPk(id);
        const news_category_arr = await LoaiTinModel.findAll({
            order: [['id', 'DESC']]
        });

        const news_category = new Map();
        news_category_arr.forEach(item => {
            news_category.set(item.id, item.ten_loai);
        });

        if (!news) {
            return res.status(404).json({ message: "Không tìm thấy tin tức" });
        }

        res.json({
            news: {
                ...news.toJSON(),
                category: news_category.get(news.id_loai)
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});

router.post("/news", upload.single("hinh"), async (req, res) => {
    try {
        const { tieu_de, slug, mo_ta, noi_dung, id_loai, an_hien } = req.body;

        // Kiểm tra dữ liệu bắt buộc
        if (!tieu_de || !slug || !mo_ta || !noi_dung || !id_loai) {
            return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc" });
        }

        // Kiểm tra slug đã tồn tại chưa
        const slug_exists = await TinTucModel.findOne({ where: { slug } });
        if (slug_exists) {
            return res.status(400).json({ message: "Slug đã tồn tại" });
        }

        // Kiểm tra loại tin có tồn tại không
        const loaiTin = await LoaiTinModel.findByPk(id_loai);
        if (!loaiTin) {
            return res.status(400).json({ message: "Loại tin tức không tồn tại" });
        }

        // Upload image to Cloudinary if file exists
        let hinh_url = "";
        if (req.file) {
            hinh_url = req.file.path;
        }

        const news = await TinTucModel.create({
            tieu_de,
            slug,
            mo_ta,
            hinh: hinh_url,
            ngay: new Date(),
            noi_dung,
            id_loai,
            luot_xem: 0,
            an_hien: an_hien || 0
        });

        res.json({
            status: 200,
            message: "Tạo tin tức thành công",
            news
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});

router.put("/news/:id", upload.single("hinh"), async (req, res) => {
    try {
        const id = req.params.id;
        const { tieu_de, slug, mo_ta, noi_dung, id_loai, an_hien } = req.body;

        const news = await TinTucModel.findByPk(id);
        if (!news) {
            return res.status(404).json({ message: "Không tìm thấy tin tức" });
        }

        // Nếu cập nhật slug, kiểm tra trùng
        if (slug && slug !== news.slug) {
            const slug_exists = await TinTucModel.findOne({
                where: {
                    slug,
                    id: { [Op.ne]: id }
                }
            });
            if (slug_exists) {
                return res.status(400).json({ message: "Slug đã tồn tại" });
            }
        }

        // Nếu cập nhật id_loai, kiểm tra loại tồn tại
        if (id_loai && id_loai !== news.id_loai) {
            const loaiTin = await LoaiTinModel.findByPk(id_loai);
            if (!loaiTin) {
                return res.status(400).json({ message: "Loại tin tức không tồn tại" });
            }
        }

        // Upload image to Cloudinary if file exists
        let hinh_url = "";
        if (req.file) {
            hinh_url = req.file.path;
        }

        // Cập nhật các trường
        if (tieu_de !== undefined) news.tieu_de = tieu_de;
        if (slug !== undefined) news.slug = slug;
        if (mo_ta !== undefined) news.mo_ta = mo_ta;
        if (noi_dung !== undefined) news.noi_dung = noi_dung;
        if (id_loai !== undefined) news.id_loai = id_loai;
        if (an_hien !== undefined) news.an_hien = an_hien;

        await news.save();

        res.json({
            status: 200,
            message: "Cập nhật tin tức thành công",
            news
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});

router.patch("/news/khoi-phuc/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const news = await TinTucModel.findByPk(id, { paranoid: false });
        if (!news) {
            return res.status(404).json({ message: "Không tìm thấy tin tức" });
        }

        if (news.deleted_at === null) {
            return res.status(400).json({ message: "Chỉ được khôi phục tin tức đã bị xóa mềm" });
        }

        await news.restore();

        res.json({
            status: 200,
            message: "Khôi phục tin tức thành công",
            news
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});

router.delete("/news/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const news = await TinTucModel.findByPk(id);
        if (!news) {
            return res.status(404).json({ message: "Không tìm thấy tin tức" });
        }

        await news.destroy();

        res.json({
            status: 200,
            message: "Xóa tin tức thành công"
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});

router.delete("/news/xoa-vinh-vien/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const news = await TinTucModel.findByPk(id, { paranoid: false });
        if (!news) {
            return res.status(404).json({ message: "Không tìm thấy tin tức" });
        }

        if (news.deleted_at === null) {
            return res.status(400).json({ message: "Chỉ được xóa vĩnh viễn tin tức đã bị xóa mềm" });
        }

        await news.destroy({ force: true });

        res.json({
            status: 200,
            message: "Xóa vĩnh viễn tin tức thành công"
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});

router.get("/news_category/page/:page", async (req, res) => {
    try {
        const page = Number(req.params.page) || 1;
        const limit = Number(req.query.limit) || 12;
        const offset = (page - 1) * limit;

        const total = await LoaiTinModel.count();
        const totalPages = Math.ceil(total / limit);

        const news_category_arr = await LoaiTinModel.findAll({
            limit: limit,
            offset: offset,
            order: [['id', 'DESC']]
        });

        if (news_category_arr.length === 0) {
            return res.status(404).json({ message: "Không có danh mục tin tức nào" });
        }

        const countNews = await TinTucModel.findAll({
            attributes: ['id_loai', [literal('COUNT(*)'), 'count']],
            group: ['id_loai'],
            raw: true
        });

        const news_category_with_count = news_category_arr.map(item => {
            const countObj = countNews.find(c => c.id_loai === item.id); // dùng ==
            return {
                ...item.toJSON(),
                count: countObj ? parseInt(countObj.count) : 0
            };
        });

        res.json({
            news_category: news_category_with_count,
            pagination: {
                total: total,
                totalPages: totalPages,
                currentPage: page,
                limit: limit,
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});


router.get("/news_category/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const category = await LoaiTinModel.findByPk(id);

        if (!category) {
            return res.status(404).json({ message: "Không tìm thấy danh mục tin tức" });
        }

        res.json(category);
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});

router.post("/news_category", async (req, res) => {
    try {
        const { ten_loai, slug, thu_tu, an_hien } = req.body;

        if (!ten_loai) {
            return res.status(400).json({ message: "Tên danh mục tin tức không được trống" });
        }

        const slug_exists = await LoaiTinModel.findOne({ where: { slug } });
        if (slug_exists) {
            return res.status(400).json({ message: "Slug danh mục tin tức đã tồn tại" });
        }

        if (an_hien !== 0 && an_hien !== 1) {
            return res.status(400).json({ message: "Trạng thái không hợp lệ" });
        }

        // Kiểm tra trùng tên danh mục
        const exists = await LoaiTinModel.findOne({ where: { ten_loai } });
        if (exists) {
            return res.status(400).json({ message: "Tên danh mục tin tức đã tồn tại" });
        }

        const category = await LoaiTinModel.create({ ten_loai, slug, thu_tu, an_hien });

        res.json({
            status: 200,
            message: "Tạo danh mục tin tức thành công",
            category
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});

router.put("/news_category/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { ten_loai, slug, thu_tu, an_hien } = req.body;

        if (!ten_loai) {
            return res.status(400).json({ message: "Tên danh mục tin tức không được trống" });
        }

        const slug_exists = await LoaiTinModel.findOne({ where: { slug, id: { [Op.ne]: id } } });
        if (slug_exists) {
            return res.status(400).json({ message: "Slug danh mục tin tức đã tồn tại" });
        }

        if (an_hien !== 0 && an_hien !== 1) {
            return res.status(400).json({ message: "Trạng thái không hợp lệ" });
        }

        const category = await LoaiTinModel.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: "Không tìm thấy danh mục tin tức" });
        }

        // Kiểm tra trùng tên danh mục với danh mục khác
        const exists = await LoaiTinModel.findOne({
            where: {
                ten_loai,
                id: { [Op.ne]: id }
            }
        });
        if (exists) {
            return res.status(400).json({ message: "Tên danh mục tin tức đã tồn tại" });
        }

        category.ten_loai = ten_loai;
        category.slug = slug;
        category.thu_tu = thu_tu;
        category.an_hien = an_hien;
        await category.save();

        res.json({
            status: 200,
            message: "Cập nhật danh mục tin tức thành công",
            category
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});

router.delete("/news_category/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const category = await LoaiTinModel.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: "Không tìm thấy danh mục tin tức" });
        }

        // Kiểm tra xem có tin tức nào thuộc danh mục này không
        const newsCount = await TinTucModel.count({ where: { id_loai: id } });
        if (newsCount > 0) {
            return res.status(400).json({
                message: `Không thể xóa danh mục: có ${newsCount} tin tức thuộc danh mục này`
            });
        }

        await category.destroy();

        res.json({
            status: 200,
            message: "Xóa danh mục tin tức thành công"
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});

router.patch("/news_category/khoi-phuc/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const category = await LoaiTinModel.findByPk(id, { paranoid: false });
        if (!category) {
            return res.status(404).json({ message: "Không tìm thấy danh mục tin tức" });
        }

        if (category.deleted_at === null) {
            return res.status(400).json({ message: "Chỉ được khôi phục danh mục tin tức đã bị xóa mềm" });
        }

        await category.restore();

        res.json({
            status: 200,
            message: "Khôi phục danh mục tin tức thành công",
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});

router.delete("/news_category/xoa-vinh-vien/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const category = await LoaiTinModel.findByPk(id, { paranoid: false });
        if (!category) {
            return res.status(404).json({ message: "Không tìm thấy danh mục tin tức" });
        }

        if (category.deleted_at === null) {
            return res.status(400).json({ message: "Chỉ được xóa vĩnh viễn danh mục tin tức đã bị xóa mềm" });
        }

        await category.destroy({ force: true });

        res.json({
            status: 200,
            message: "Xóa vĩnh viễn danh mục tin tức thành công"
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});
// }

// USER {
router.get("/user/page/:page", async (req, res) => {
    try {
        const page = Number(req.params.page) || 1;
        const limit = Number(req.query.limit) || 12;
        const offset = (page - 1) * limit;
        const total = await UserModel.count();
        const totalPages = Math.ceil(total / limit);

        const user_arr = await UserModel.findAll({
            limit: limit,
            offset: offset,
            order: [['id', 'DESC']]
        });

        if (user_arr.length === 0) {
            return res.status(404).json({ message: "Không có tài khoản nào" })
        }
        res.json({
            user: user_arr,
            pagination: {
                total: total,
                totalPages: totalPages,
                currentPage: page,
                limit: limit
            }
        })
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});

router.get("/user/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const user = await UserModel.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }

        // Không trả về mật khẩu
        const { mat_khau, ...userInfo } = user.toJSON();

        res.json(userInfo);
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});

router.post("/user", async (req, res) => {
    try {
        const { ho_ten, email, mat_khau, dia_chi, dien_thoai, vai_tro, khoa } = req.body;

        // Kiểm tra dữ liệu bắt buộc
        if (!ho_ten || !email || !mat_khau || !dien_thoai) {
            return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc" });
        }

        // Kiểm tra email đã tồn tại chưa
        const email_exists = await UserModel.findOne({ where: { email } });
        if (email_exists) {
            return res.status(400).json({ message: "Email đã tồn tại" });
        }

        // Kiểm tra định dạng email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Email không hợp lệ" });
        }

        // Kiểm tra định dạng số điện thoại
        const phoneRegex = /^0(3|5|7|8|9)[0-9]{8}$/;
        if (!phoneRegex.test(dien_thoai)) {
            return res.status(400).json({ message: "Số điện thoại không hợp lệ" });
        }

        // Mã hóa mật khẩu
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(mat_khau, salt);

        const user = await UserModel.create({
            ho_ten,
            email,
            mat_khau: hashedPassword,
            dia_chi: dia_chi || "",
            dien_thoai,
            vai_tro: vai_tro !== undefined ? vai_tro : 0,
            khoa: khoa !== undefined ? khoa : 0
        });

        // Không trả về mật khẩu
        const { mat_khau: pw, ...userInfo } = user.toJSON();

        res.json({
            status: 200,
            message: "Tạo người dùng thành công",
            user: userInfo
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});

router.put("/user/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { ho_ten, email, mat_khau, dia_chi, dien_thoai, vai_tro, khoa } = req.body;

        const user = await UserModel.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }

        // Nếu cập nhật email, kiểm tra trùng và định dạng
        if (email && email !== user.email) {
            const email_exists = await UserModel.findOne({
                where: {
                    email,
                    id: { [Op.ne]: id }
                }
            });

            if (email_exists) {
                return res.status(400).json({ message: "Email đã tồn tại" });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: "Email không hợp lệ" });
            }
        }

        // Nếu cập nhật số điện thoại, kiểm tra định dạng
        if (dien_thoai && dien_thoai !== user.dien_thoai) {
            const phoneRegex = /^0(3|5|7|8|9)[0-9]{8}$/;
            if (!phoneRegex.test(dien_thoai)) {
                return res.status(400).json({ message: "Số điện thoại không hợp lệ" });
            }
        }

        // Cập nhật các trường
        if (ho_ten !== undefined) user.ho_ten = ho_ten;
        if (email !== undefined) user.email = email;
        if (dia_chi !== undefined) user.dia_chi = dia_chi;
        if (dien_thoai !== undefined) user.dien_thoai = dien_thoai;
        if (vai_tro !== undefined) user.vai_tro = vai_tro;
        if (khoa !== undefined) user.khoa = khoa;

        // Mã hóa mật khẩu nếu có cập nhật
        if (mat_khau) {
            const salt = bcrypt.genSaltSync(10);
            user.mat_khau = bcrypt.hashSync(mat_khau, salt);
        }

        await user.save();

        // Không trả về mật khẩu
        const { mat_khau: pw, ...userInfo } = user.toJSON();

        res.json({
            status: 200,
            message: "Cập nhật người dùng thành công",
            user: userInfo
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});

router.delete("/user/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const user = await UserModel.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }

        if (user.vai_tro === 1) {
            return res.status(400).json({ message: "Không thể xóa người dùng có vai trò là admin" });
        }

        // Kiểm tra xem người dùng có đơn hàng không
        const orderCount = await DonHangModel.count({ where: { email: user.email } });
        if (orderCount > 0) {
            return res.status(400).json({
                message: `Không thể xóa người dùng: có ${orderCount} đơn hàng liên quan`
            });
        }

        await user.destroy();

        res.json({
            status: 200,
            message: "Xóa người dùng thành công"
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});

router.patch("/user/khoi-phuc/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const user = await UserModel.findByPk(id, { paranoid: false });
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }
        if (user.deleted_at === null) {
            return res.status(400).json({ message: "Chỉ được khôi phục người dùng đã bị xóa mềm" });
        }
        await user.restore();
        res.json({
            status: 200,
            message: "Khôi phục người dùng thành công",
            user
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});

router.delete("/user/xoa-vinh-vien/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const user = await UserModel.findByPk(id, { paranoid: false });

        if (user.vai_tro === 1) {
            return res.status(400).json({ message: "Không thể xóa người dùng có vai trò là admin" });
        }

        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }
        if (user.deleted_at === null) {
            return res.status(400).json({ message: "Chỉ được xóa vĩnh viễn người dùng đã bị xóa mềm" });
        }
        await user.destroy({ force: true });
        res.json({
            status: 200,
            message: "Xóa vĩnh viễn người dùng thành công"
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});

// }

// ĐƠN HÀNG {
router.get("/order/page/:page", async (req, res) => {
    try {
        const page = Number(req.params.page) || 1;
        const limit = Number(req.query.limit) || 12;
        const offset = (page - 1) * limit;
        const total = await DonHangModel.count();
        const totalPages = Math.ceil(total / limit);

        const order_arr = await DonHangModel.findAll({
            limit: limit,
            offset: offset,
            order: [['id', 'DESC']]
        });
        if (order_arr.length === 0) {
            return res.status(404).json({ message: "Không có đơn hàng nào." });
        }
        res.json({
            orders: order_arr,
            pagination: {
                total: total,
                totalPages: totalPages,
                currentPage: page,
                limit: limit
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});

router.get("/order/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const order = await DonHangModel.findByPk(id);

        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        // Lấy chi tiết đơn hàng
        const orderDetails = await DonHangChiTietModel.findAll({
            where: { id_dh: id }
        });

        // Nếu có chi tiết đơn hàng, thêm thông tin sản phẩm cho mỗi chi tiết
        let orderDetailsWithProducts = [];
        if (orderDetails.length > 0) {
            // Lấy danh sách id sản phẩm
            const productIds = orderDetails.map(detail => detail.id_sp);

            // Lấy thông tin các sản phẩm
            const products = await SanPhamModel.findAll({
                where: { id: { [Op.in]: productIds } },
                attributes: ['id', 'ten_sp', 'gia', 'hinh', 'slug']
            });

            // Map sản phẩm theo id để dễ tìm kiếm
            const productMap = new Map();
            products.forEach(product => {
                productMap.set(product.id, product);
            });

            // Thêm thông tin sản phẩm vào chi tiết đơn hàng
            orderDetailsWithProducts = orderDetails.map(detail => {
                const product = productMap.get(detail.id_sp);
                return {
                    ...detail.toJSON(),
                    product: product || null
                };
            });
        }

        res.json({
            order,
            orderDetails: orderDetailsWithProducts
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});

router.put("/order/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { ho_ten, email, ghi_chu, dia_chi, status } = req.body;

        const order = await DonHangModel.findByPk(id);
        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        if (status !== undefined && status !== 0 && status !== 1) {
            return res.status(400).json({ message: "Trạng thái không hợp lệ" });
        }

        // Cập nhật các trường
        if (ho_ten !== undefined) order.ho_ten = ho_ten;
        if (email !== undefined) order.email = email;
        if (ghi_chu !== undefined) order.ghi_chu = ghi_chu;
        if (dia_chi !== undefined) order.dia_chi = dia_chi;
        if (status !== undefined) order.status = status;

        await order.save();

        res.json({
            status: 200,
            message: "Cập nhật đơn hàng thành công",
            order
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});

router.delete("/order/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const order = await DonHangModel.findByPk(id);
        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        // Xóa chi tiết đơn hàng trước
        await DonHangChiTietModel.destroy({ where: { id_dh: id } });

        // Xóa đơn hàng
        await order.destroy();

        res.json({
            status: 200,
            message: "Xóa đơn hàng và chi tiết đơn hàng thành công"
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});

router.patch("/order/khoi-phuc/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const order = await DonHangModel.findByPk(id, { paranoid: false });
        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }
        if (order.deleted_at === null) {
            return res.status(400).json({ message: "Chỉ được khôi phục đơn hàng đã bị xóa mềm" });
        }
        await order.restore();
        res.json({
            status: 200,
            message: "Khôi phục đơn hàng thành công",
            order
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});

router.delete("/order/xoa-vinh-vien/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const order = await DonHangModel.findByPk(id, { paranoid: false });
        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }
        if (order.status === 0) {
            return res.status(400).json({ message: "Không thể xóa đơn hàng chưa hoàn thành" });
        }
        if (order.deleted_at === null) {
            return res.status(400).json({ message: "Chỉ được xóa vĩnh viễn đơn hàng đã bị xóa mềm" });
        }
        await order.destroy({ force: true });
        res.json({
            status: 200,
            message: "Xóa vĩnh viễn đơn hàng thành công"
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});

// API cho chi tiết đơn hàng
router.get("/order_detail/:id_dh", async (req, res) => {
    try {
        const id_dh = req.params.id_dh;

        const orderDetails = await DonHangChiTietModel.findAll({ where: { id_dh } });

        if (orderDetails.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy chi tiết đơn hàng" });
        }

        const productIds = orderDetails.map(detail => detail.id_sp);
        console.log("ID sản phẩm cần lấy:", productIds);

        const products = await SanPhamModel.findAll({
            where: { id: { [Op.in]: productIds } },
            attributes: ['id', 'ten_sp', 'gia', 'hinh', 'slug']
        });

        const productMap = new Map();
        products.forEach(product => {
            productMap.set(product.id, product);
        });

        const orderDetailsWithProducts = orderDetails.map(detail => {
            const product = productMap.get(detail.id_sp);
            return {
                ...detail.toJSON(),
                product: product || null
            };
        });

        res.json(orderDetailsWithProducts);
    } catch (err) {
        console.error("Lỗi lấy chi tiết đơn hàng:", err);
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});

router.delete("/order_detail/:id_ct", async (req, res) => {
    try {
        const id_ct = req.params.id_ct;

        const orderDetail = await DonHangChiTietModel.findByPk(id_ct);
        if (!orderDetail) {
            return res.status(404).json({ message: "Không tìm thấy chi tiết đơn hàng" });
        }

        await orderDetail.destroy();

        res.json({
            status: 200,
            message: "Xóa chi tiết đơn hàng thành công"
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});
// }

module.exports = router;
