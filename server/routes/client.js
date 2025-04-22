const express = require("express");
const router = express.Router();
const { LoaiModel, TinTucModel, LoaiTinModel, SanPhamModel, DonHangModel, DonHangChiTietModel, UserModel } = require("../config/db");
const { Op } = require("sequelize");
const { literal } = require("sequelize");

const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const sendMail = async (to, subject, html) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });

    await transporter.sendMail({
        from: `"ShopTech" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    });
}

// loại sản phẩm {
router.get("/loai/:id", async (req, res) => {
    const loai = await LoaiModel.findByPk(req.params.id)
    if (!loai) {
        res.status(404).json({ error: "Danh mục đã bị lỗi, vui lòng thử lại sau" });
        return;
    }
    res.json(loai);
})
router.get("/loai", async (req, res) => {
    const loai_arr = await LoaiModel.findAll({
        where: { an_hien: 1 },
        order: [['thu_tu', 'ASC']],
    })
    res.json(loai_arr);
})

// loại sản phẩm }

// sản phẩm {

router.get("/products/page/:page", async (req, res) => {
    try {
        const page = Number(req.params.page) || 1;
        const limit = Number(req.query.limit) || 9;
        const offset = (page - 1) * limit;

        // Lấy tổng số sản phẩm để tính tổng số trang
        const totalProducts = await SanPhamModel.count({
            where: { an_hien: 1 }
        });

        const totalPages = Math.ceil(totalProducts / limit);

        // Lấy sản phẩm theo trang
        const products = await SanPhamModel.findAll({
            where: { an_hien: 1 },
            order: [['ngay', 'DESC'], ['gia', 'ASC']],
            offset: offset,
            limit: limit
        });

        res.json({
            products,
            pagination: {
                total: totalProducts,
                totalPages,
                currentPage: page,
                limit
            }
        });
    } catch (error) {
        console.error("Error fetching paginated products:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/products/hot/page/:page", async (req, res) => {
    try {
        const page = Number(req.params.page) || 1;
        const limit = Number(req.query.limit) || 9;
        const offset = (page - 1) * limit;

        const totalProducts = await SanPhamModel.count({
            where: { an_hien: 1, hot: 1 }
        });

        const totalPages = Math.ceil(totalProducts / limit);

        const products = await SanPhamModel.findAll({
            where: { an_hien: 1, hot: 1 },
            order: [['ngay', 'DESC'], ['gia', 'ASC']],
            offset: offset,
            limit: limit
        });

        res.json({
            products,
            pagination: {
                total: totalProducts,
                totalPages,
                currentPage: page,
                limit
            }
        });
    } catch (error) {
        console.error("Error fetching paginated hot products:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/products/sort/:sort/page/:page", async (req, res) => {
    try {
        const page = Number(req.params.page) || 1;
        const limit = Number(req.query.limit) || 9;
        const offset = (page - 1) * limit;
        const sort = req.params.sort.toLowerCase();

        let orderBy = [];

        if (sort === "asc") {
            orderBy.push(['gia', 'ASC']);
        } else if (sort === "desc") {
            orderBy.push(['gia', 'DESC']);
        } else {
            return res.status(400).json({ error: "Invalid sort parameter" });
        }

        const totalProducts = await SanPhamModel.count({
            where: { an_hien: 1 }
        });

        const totalPages = Math.ceil(totalProducts / limit);

        const products = await SanPhamModel.findAll({
            where: { an_hien: 1 },
            order: orderBy,
            offset: offset,
            limit: limit
        });

        res.json({
            products,
            pagination: {
                total: totalProducts,
                totalPages,
                currentPage: page,
                limit
            }
        });
    } catch (error) {
        console.error("Error fetching paginated hot products:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/products/category/:categoryId/:sort/page/:page", async (req, res) => {
    try {
        const categoryId = Number(req.params.categoryId);
        const page = Number(req.params.page) || 1;
        const limit = Number(req.query.limit) || 9;
        const offset = (page - 1) * limit;

        // Lấy tổng số sản phẩm trong loại để tính tổng số trang
        const totalProducts = await SanPhamModel.count({
            where: { an_hien: 1, id_loai: categoryId }
        });

        const totalPages = Math.ceil(totalProducts / limit);

        // Lấy sản phẩm theo loại và trang
        const products = await SanPhamModel.findAll({
            where: { an_hien: 1, id_loai: categoryId },
            order: [['ngay', 'DESC'], ['gia', 'ASC']],
            offset: offset,
            limit: limit
        });

        // Lấy thông tin loại
        const category = await LoaiModel.findByPk(categoryId);

        res.json({
            products,
            category,
            pagination: {
                total: totalProducts,
                totalPages,
                currentPage: page,
                limit
            }
        });
    } catch (error) {
        console.error("Error fetching paginated products by category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/products/category/:categoryId/hot/:hot/page/:page", async (req, res) => {
    try {
        const categoryId = Number(req.params.categoryId);
        const hot = req.params.hot;
        const page = Number(req.params.page) || 1;
        const limit = Number(req.query.limit) || 9;
        const offset = (page - 1) * limit;

        // Lấy tổng số sản phẩm trong loại để tính tổng số trang
        const totalProducts = await SanPhamModel.count({
            where: { an_hien: 1, id_loai: categoryId }
        });

        const totalPages = Math.ceil(totalProducts / limit);

        // Lấy sản phẩm theo loại và trang
        const products = await SanPhamModel.findAll({
            where: { an_hien: 1, id_loai: categoryId },
            order: [['ngay', 'DESC'], ['gia', 'ASC']],
            offset: offset,
            limit: limit
        });

        // Lấy thông tin loại
        const category = await LoaiModel.findByPk(categoryId);

        res.json({
            products,
            category,
            pagination: {
                total: totalProducts,
                totalPages,
                currentPage: page,
                limit
            }
        });
    } catch (error) {
        console.error("Error fetching paginated products by category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/products/category/:categoryId/page/:page", async (req, res) => {
    try {
        const categoryId = Number(req.params.categoryId);
        const page = Number(req.params.page) || 1;
        const limit = Number(req.query.limit) || 9;
        const offset = (page - 1) * limit;
        const sortOption = req.query.sort;
        const isHot = req.query.hot;

        // Xây dựng điều kiện where
        const whereCondition = {
            an_hien: 1,
            id_loai: categoryId
        };

        // Nếu có tham số hot, thêm điều kiện hot
        if (isHot === '1') {
            whereCondition.hot = 1;
        }

        // Xác định cách sắp xếp
        let orderOptions = [['ngay', 'DESC']];

        if (sortOption === 'asc') {
            orderOptions = [['gia', 'ASC']];
        } else if (sortOption === 'desc') {
            orderOptions = [['gia', 'DESC']];
        }

        // Lấy tổng số sản phẩm để tính tổng số trang
        const totalProducts = await SanPhamModel.count({
            where: whereCondition
        });

        const totalPages = Math.ceil(totalProducts / limit);

        // Lấy sản phẩm theo điều kiện
        const products = await SanPhamModel.findAll({
            where: whereCondition,
            order: orderOptions,
            offset: offset,
            limit: limit
        });

        // Lấy thông tin loại
        const category = await LoaiModel.findByPk(categoryId);

        res.json({
            products,
            category,
            pagination: {
                total: totalProducts,
                totalPages,
                currentPage: page,
                limit
            }
        });
    } catch (error) {
        console.error("Error fetching products by category with options:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/products/category/:categoryId/sort/:sort/page/:page", async (req, res) => {
    try {
        const categoryId = Number(req.params.categoryId);
        const sort = req.params.sort.toLowerCase();
        const page = Number(req.params.page) || 1;
        const limit = Number(req.query.limit) || 9;
        const offset = (page - 1) * limit;

        let orderBy = [];

        if (sort === "asc") {
            orderBy.push(['gia', 'ASC']);
        } else if (sort === "desc") {
            orderBy.push(['gia', 'DESC']);
        } else {
            return res.status(400).json({ error: "Invalid sort parameter" });
        }

        // Lấy tổng số sản phẩm để tính tổng số trang
        const totalProducts = await SanPhamModel.count({
            where: { an_hien: 1, id_loai: categoryId }
        });

        const totalPages = Math.ceil(totalProducts / limit);

        // Lấy sản phẩm theo điều kiện
        const products = await SanPhamModel.findAll({
            where: { an_hien: 1, id_loai: categoryId },
            order: orderBy,
            offset: offset,
            limit: limit
        });

        // Lấy thông tin loại
        const category = await LoaiModel.findByPk(categoryId);

        res.json({
            products,
            category,
            pagination: {
                total: totalProducts,
                totalPages,
                currentPage: page,
                limit
            }
        });
    } catch (error) {
        console.error("Error fetching sorted products by category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// API tìm kiếm sản phẩm 
router.get("/search/:key/page/:page", async (req, res) => {
    try {
        const key = req.params.key;
        const page = Number(req.params.page) || 1;
        const limit = Number(req.query.limit) || 9;
        const offset = (page - 1) * limit;

        if (!key) {
            return res.status(400).json({ error: "Search key cannot be empty" });
        }

        const totalProducts = await SanPhamModel.count({
            where: {
                an_hien: 1,
                ten_sp: { [Op.like]: `%${key}%` }
            }
        });

        const totalPages = Math.ceil(totalProducts / limit);

        const products = await SanPhamModel.findAll({
            where: {
                an_hien: 1,
                ten_sp: { [Op.like]: `%${key}%` }
            },
            order: [['ngay', 'DESC'], ['gia', 'ASC']],
            offset: offset,
            limit: limit
        });

        res.json({
            products,
            pagination: {
                total: totalProducts,
                totalPages,
                currentPage: page,
                limit
            }
        });
    } catch (error) {
        console.error("Error fetching search products:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/sp/:slug", async (req, res) => {
    const slug = req.params.slug
    if (!slug) {
        res.status(400).json({ error: "Invalid product slug" });
        return;
    }
    const sp = await SanPhamModel.findOne({
        where: { slug: slug },
    })
    if (!sp) {
        res.status(404).json({ error: "Sản phẩm đã bị lỗi, vui lòng thử lại sau" });
        return;
    }
    res.json(sp);
})


router.post("/sp/:slug", async (req, res) => {
    const slug = req.params.slug
    const sp = await SanPhamModel.findOne({ where: { slug } });
    if (!sp) {
        res.status(400).json({ error: "Invalid product slug" });
        return;
    }
    const currentLuotXem = sp.luot_xem ?? 0;
    const newLuotXem = currentLuotXem + 1;

    await SanPhamModel.update({ luot_xem: newLuotXem }, { where: { slug } });
    res.json({ thong_bao: "Đã cập nhật lượt xem", luot_xem: newLuotXem });
})

router.get("/products/same-category/:categoryId", async (req, res) => {
    try {
        const categoryId = Number(req.params.categoryId);
        const limit = Number(req.query.limit) || 4;
        const offset = Number(req.query.offset) || 0;

        const products = await SanPhamModel.findAll({
            where: { id_loai: categoryId, an_hien: 1 },
            order: [literal('RAND()')],
            offset: offset,
            limit: limit
        });

        res.json(products);
    } catch (error) {
        console.error("Error fetching products by category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/sptrongloai/:id", async (req, res) => {
    const id_loai = Number(req.params.id)
    if (isNaN(id_loai)) {
        res.status(400).json({ error: "Invalid category ID" });
        return;
    }
    const sp_arr = await SanPhamModel.findAll({
        where: { id_loai: id_loai, an_hien: 1 },
        order: [['ngay', 'DESC'], ['gia', 'ASC']],
    })
    res.json(sp_arr);
})

router.get("/sphot/:sosp?", async (req, res) => {
    const sosp = Number(req.params.sosp) || 12
    const sp_arr = await SanPhamModel.findAll({
        where: { an_hien: 1, hot: 1 },
        order: [['ngay', 'DESC'], ['gia', 'ASC']],
        offset: 0, limit: sosp,
    })
    res.json(sp_arr);
})

router.get("/spmoi/:sosp?", async (req, res) => {
    const sosp = Number(req.params.sosp) || 6
    const sp_arr = await SanPhamModel.findAll({
        where: { an_hien: 1 },
        order: [['ngay', 'DESC'], ['gia', 'ASC']],
        offset: 0, limit: sosp,
    })
    res.json(sp_arr);
})

router.get("/products/same-category/:categoryId", async (req, res) => {
    try {
        const categoryId = Number(req.params.categoryId);
        const limit = Number(req.query.limit) || 4;
        const offset = Number(req.query.offset) || 0;

        const products = await SanPhamModel.findAll({
            where: { id_loai: categoryId, an_hien: 1 },
            order: [literal('RAND()')],
            offset: offset,
            limit: limit
        });

        res.json(products);
    } catch (error) {
        console.error("Error fetching products by category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// sản phẩm }

// đơn hàng và chi tiết đơn hàng {
router.post('/luudonhang', async (req, res) => {
    try {
        let { ho_ten, email, ghi_chu, dia_chi } = req.body

        if (!ho_ten || !email || !dia_chi) {
            res.status(400).json({ error: "Missing required fields" });
            return;
        }

        const don_hang = await DonHangModel.create({
            ho_ten: ho_ten, email: email, ghi_chu: ghi_chu, dia_chi: dia_chi,
        })

        return res.json({
            thong_bao: 'Đã tạo đơn hàng',
            dh: don_hang
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/luugiohang', async (req, res) => {
    let { id_dh, id_sp, so_luong } = req.body
    await DonHangChiTietModel.create({
        id_dh: id_dh, id_sp: id_sp, so_luong: so_luong
    })
        .then(function (item) {
            res.json({ "thong_bao": "Đã lưu giỏ hàng", "sp": item });
        })
        .catch(function (err) {
            res.json({ "thong_bao": "Lỗi lưu giỏ hàng ", err })
        });
});

// đơn hàng và chi tiết đơn hàng }


// tin tức {
router.get("/news/loai_tin", async (req, res) => {
    const loai_tin_arr = await LoaiTinModel.findAll({
        where: { an_hien: 1 },
        order: [['thu_tu', 'ASC']],
    })
    res.json(loai_tin_arr);
})

router.get("/news/:limit/page/:page", async (req, res) => {
    const limit = Number(req.params.limit) || 10;
    const page = Number(req.params.page) || 1;
    const offset = (page - 1) * limit;

    const total = await TinTucModel.count({
        where: { an_hien: 1 }
    });

    const totalPages = Math.ceil(total / limit);
    const news_arr = await TinTucModel.findAll({
        where: { an_hien: 1 },
        order: [['ngay', 'DESC']],
        offset: offset,
        limit: limit
    })

    res.json({
        news: news_arr,
        pagination: {
            total: total,
            totalPages: totalPages,
            currentPage: page,
            limit: limit
        }
    });
})

router.get("/news/:slug", async (req, res) => {
    const slug = req.params.slug
    if (!slug) {
        res.status(400).json({ error: "Invalid news slug" });
        return;
    }
    const news = await TinTucModel.findOne({
        where: { slug: slug },
    })
    if (!news) {
        res.status(404).json({ error: "News not found" });
        return;
    }
    res.json(news);
})

router.get("/news/related/:id", async (req, res) => {
    const id = Number(req.params.id)
    if (isNaN(id)) {
        res.status(400).json({ error: "Invalid news ID" });
        return;
    }
    const relatedNews = await TinTucModel.findAll({
        where: { id_loai: id },
        order: [['ngay', 'DESC']],
        limit: 3,
    })
    if (relatedNews.length === 0) {
        res.status(404).json({ error: "No related news found" });
        return;
    }
    res.json(relatedNews);
})

router.get("/news/loai/:id", async (req, res) => {
    const id = Number(req.params.id)
    if (isNaN(id)) {
        res.status(400).json({ error: "Invalid news ID" });
        return;
    }
    const news_arr = await TinTucModel.findAll({
        where: { id_loai: id },
        order: [['ngay', 'DESC']],
    })
    res.json(news_arr);
})
// tin tức }


//  User {
router.post("/dangky", async (req, res) => {
    let { ho_ten, email, mat_khau, dien_thoai, nhap_lai_mat_khau } = req.body
    const phoneRegex = /^(0(3|5|7|8|9))[0-9]{8}$/;

    // kiểm tra xem email đã tồn tại trong database chưa
    let  user = await UserModel.findOne({ where: { email: email } })
    if (user) {
        res.json({ "thong_bao": "Email đã tồn tại" })
        return;
    }

    if (!ho_ten || !email || !mat_khau || !dien_thoai || !nhap_lai_mat_khau) {
        res.json({ "thong_bao": "Vui lòng nhập đầy đủ thông tin" })
        return;
    } else if (mat_khau.length < 6) {
        res.json({ "thong_bao": "Mật khẩu phải có ít nhất 6 ký tự" })
        return;
    } else if (!phoneRegex.test(dien_thoai)) {
        res.json({ "thong_bao": "Số điện thoại không hợp lệ (Ví dụ: 0909090909) và có 10 số" })
        return;
    } else if (nhap_lai_mat_khau !== mat_khau) {
        res.json({ "thong_bao": "Mật khẩu không khớp" })
        return;
    }

    const salt = bcrypt.genSaltSync(10);
    const mat_khau_hash = await bcrypt.hash(mat_khau, salt)

    const { v4: uuidv4 } = require('uuid');
    const token = uuidv4();
    const link = `http://localhost:3000/api/submit-email/${token}`

    try {
        await sendMail(
            email,
            "Xác nhận đăng ký",
            `<h3>Chào ${ho_ten}, bạn đã đăng ký thành công.</h3>
             <p>Vui lòng click vào link sau để xác nhận email: <a href="${link}">Xác nhận email</a></p>`
        );
    } catch (err) {
        console.error("Lỗi gửi mail:", err);
        return res.status(500).json({ thong_bao: "Gửi email thất bại, vui lòng thử lại sau." });
    }


    user = await UserModel.create({ email: email, mat_khau: mat_khau_hash, ho_ten: ho_ten, dien_thoai: dien_thoai, remember_token: token })
    console.log("Tạo user thành công:", email);
    res.status(200).json({
        thong_bao: "Đã tạo tài khoản",
        user: user
    })
})

router.get("/submit-email/:token", async (req, res) => {
    const token = req.params.token
    const user = await UserModel.findOne({ where: { remember_token: token } })
    if (!user) {
        return res.status(404).json({ thong_bao: "Token không hợp lệ" })
    }
    await UserModel.update({
        email_verified_at: new Date(),
        remember_token: null
    }, { where: { remember_token: token } })
    return res.status(200).json({ thong_bao: "Email đã được xác nhận" })
})

router.post("/dangnhap", async (req, res) => {
    let { email, mat_khau } = req.body

    const user = await UserModel.findOne({ where: { email: email } })
    if (!user) {
        return res.status(404).json({ thong_bao: "Email không tồn tại" });
    }

    let mat_khau_hash = user.mat_khau
    let isMatch = bcrypt.compareSync(mat_khau, mat_khau_hash)
    if (!isMatch) {
        return res.status(403).json({ thong_bao: "Mật khẩu không chính xác" });
    }

    const privateKey = process.env.JWT_SECRET;
    if (!privateKey) {
        return res.status(500).json({ thong_bao: "Không tìm thấy khóa bí mật" });
    }

    const payload = { id: user.id, email: user.email }
    const expiresIn = "1h"
    const bearerToken = jwt.sign(payload, privateKey, {
        expiresIn: expiresIn,
        subject: user.id.toString()
    });


    sendMail(email, "Xác nhận đăng nhập", `<h3>Chào ${user.ho_ten}, bạn đã đăng nhập thành công.</h3>`);

    res.status(200).json({
        "status": 200,
        "thong_bao": "Đăng nhập thành công",
        "token": bearerToken,
        "expiresIn": expiresIn,
        "user": user
    })
})

// cập nhật thông tin tài khoản
router.post("/capnhat", async (req, res) => {
    let { email, ho_ten, dien_thoai, dia_chi } = req.body;

    const updateData = {};
    if (ho_ten && ho_ten.trim() !== "") {
        updateData.ho_ten = ho_ten;
    }

    if (dien_thoai && dien_thoai.trim() !== "") {
        const phoneRegex = /^0(3|5|7|8|9)[0-9]{8}$/;
        if (!phoneRegex.test(dien_thoai)) {
            return res.json({ thong_bao: "Số điện thoại không hợp lệ (Ví dụ: 0909090909)" });
        }
        updateData.dien_thoai = dien_thoai;
    }

    if (dia_chi && dia_chi.trim() !== "") {
        updateData.dia_chi = dia_chi;
    }

    if (Object.keys(updateData).length === 0) {
        return res.json({ thong_bao: "Không có trường nào được gửi để cập nhật" });
    }

    const user = await UserModel.findOne({ where: { email: email } })
    if (!user) {
        res.json({ "thong_bao": "Không tìm thấy tài khoản" })
        return;
    }

    await UserModel.update(updateData, { where: { email } });
    sendMail(email, "Xác nhận cập nhật thông tin tài khoản", `<h3>Chào ${user.ho_ten}, bạn đã cập nhật thông tin tài khoản thành công.</h3>`);
    res.json({ thong_bao: "Đã cập nhật thông tin tài khoản", cap_nhat: updateData });
})

router.post("/doipass", async (req, res) => {
    const { email, pass_old, pass_new1, pass_new2 } = req.body;
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(403).json({ thong_bao: "Token không hợp lệ" });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
        const privateKey = process.env.JWT_SECRET;
        decoded = jwt.verify(token, privateKey);
    } catch (err) {
        return res.status(403).json({ thong_bao: "Token hết hạn hoặc không hợp lệ" });
    }

    // Kiểm tra email trong token có trùng với email từ client
    if (decoded.email !== email) {
        return res.status(403).json({ thong_bao: "Email không trùng khớp với token" });
    }

    // Tìm người dùng theo email
    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
        return res.status(404).json({ thong_bao: "Không tìm thấy người dùng" });
    }

    const mk_trongdb = user.mat_khau;
    const match = bcrypt.compareSync(pass_old, mk_trongdb);
    if (!match) {
        return res.status(403).json({ thong_bao: "Mật khẩu cũ không đúng" });
    }

    if (!pass_new1 || pass_new1 !== pass_new2) {
        return res.status(400).json({ thong_bao: "2 mật khẩu mới không khớp" });
    }

    const salt = bcrypt.genSaltSync(10);
    const mk_mahoa = bcrypt.hashSync(pass_new1, salt);

    await UserModel.update({ mat_khau: mk_mahoa }, { where: { email } });
    sendMail(email, "Xác nhận đổi mật khẩu", `<h3>Chào ${user.ho_ten}, bạn đã đổi mật khẩu thành công.</h3>`);

    return res.status(200).json({ thong_bao: "Đổi mật khẩu thành công" });
});

router.post("/quenpass", async (req, res) => {
    let { email } = req.body;
    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
        return res.status(404).json({ thong_bao: "Không tìm thấy người dùng" });
    }

    const pass = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const salt = bcrypt.genSaltSync(10);
    const mk_mahoa = bcrypt.hashSync(pass, salt);
    await UserModel.update({ mat_khau: mk_mahoa }, { where: { email } });

    sendMail(email, "Xác nhận quên mật khẩu", `<h3>Chào ${user.ho_ten}, bạn đã quên mật khẩu.</h3>
    <p>Mật khẩu mới của bạn là: ${pass}</p>
    <p>Vui lòng đổi mật khẩu sau khi đăng nhập</p>
    <a href="http://localhost:3000/quenpass/${pass}">Đổi mật khẩu</a>
    `);
    return res.status(200).json({
        status: 200,
        thong_bao: "Đã gửi email xác nhận quên mật khẩu"
    });
})
// user }


module.exports = router;
