const express = require("express")
var app = express(); //tạo ứng dụng nodejs
const port = 3000;

app.use(express.json());  //cho phép đọc dữ liệu dạng json
const cors = require("cors")
app.use(cors()); //cho phép mọi nguồi bên ngoài request đến ứnd dụng

const { SanPhamModel, LoaiModel, TinTucModel, LoaiTinModel, DonHangModel, DonHangChiTietModel } = require("./config/db"); //các model lấy database
const { Op } = require("sequelize"); // Import Op từ Sequelize để sử dụng các toán tử như LIKE
const { literal } = require("sequelize");

//routes
app.get("/api/loai", async (req, res) => {
    const loai_arr = await LoaiModel.findAll({
        where: { an_hien: 1 },
        order: [['thu_tu', 'ASC']],
    })
    res.json(loai_arr);
})

// tin tức
app.get("/api/news/:limit/page/:page", async (req, res) => {
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
    // console.log(news_arr);
})

app.get("/api/news/loai/:id", async (req, res) => {
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

// loại tin
app.get("/api/news/loai_tin", async (req, res) => {
    const loai_tin_arr = await LoaiTinModel.findAll({
        where: { an_hien: 1 },
        order: [['thu_tu', 'ASC']],
    })
    res.json(loai_tin_arr);
})

// chi tiết tin tức
app.get("/api/news/:slug", async (req, res) => {
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

// tin tức liên quan 
app.get("/api/news/related/:id", async (req, res) => {
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

app.get("/api/sphot/:sosp?", async (req, res) => {
    const sosp = Number(req.params.sosp) || 12
    const sp_arr = await SanPhamModel.findAll({
        where: { an_hien: 1, hot: 1 },
        order: [['ngay', 'DESC'], ['gia', 'ASC']],
        offset: 0, limit: sosp,
    })
    res.json(sp_arr);
})

app.get("/api/spmoi/:sosp?", async (req, res) => {
    const sosp = Number(req.params.sosp) || 6
    const sp_arr = await SanPhamModel.findAll({
        where: { an_hien: 1 },
        order: [['ngay', 'DESC'], ['gia', 'ASC']],
        offset: 0, limit: sosp,
    })
    res.json(sp_arr);
})

// sản phẩm cùng loại
app.get("/api/products/same-category/:categoryId", async (req, res) => {
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

// API phân trang cho tất cả sản phẩm
app.get("/api/products/page/:page", async (req, res) => {
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

// API phân trang cho sản phẩm theo loại
app.get("/api/products/category/:categoryId/:sort/page/:page", async (req, res) => {
    try {
        const categoryId = Number(req.params.categoryId);
        const sort = req.params.sort.toLowerCase();
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

app.get("/api/products/category/:categoryId/hot/:hot/page/:page", async (req, res) => {
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

// API phân trang cho sản phẩm theo loại kết hợp với hot và sort
app.get("/api/products/category/:categoryId/page/:page", async (req, res) => {
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

// API lấy sản phẩm theo danh mục và sắp xếp giá
app.get("/api/products/category/:categoryId/sort/:sort/page/:page", async (req, res) => {
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

// API phân trang cho sản phẩm hot
app.get("/api/products/hot/page/:page", async (req, res) => {
    try {
        const page = Number(req.params.page) || 1;
        const limit = Number(req.query.limit) || 9;
        const offset = (page - 1) * limit;

        const totalProducts = await SanPhamModel.count({
            where: { an_hien: 1, hot: 1 }
        });

        const totalPages = Math.ceil(totalProducts / limit);

        // Lấy sản phẩm hot theo trang
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

// API phân trang cho sản phẩm hot
app.get("/api/products/sort/:sort/page/:page", async (req, res) => {
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

        // Lấy sản phẩm hot theo trang
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

// API tìm kiếm sản phẩm 
app.get("/api/search/:key/page/:page", async (req, res) => {
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

// app.get("/api/sp/:id", async (req, res) => {
//     const id = Number(req.params.id)
//     if (isNaN(id)) {
//         res.status(400).json({ error: "Invalid product ID" });
//         return;
//     }
//     const sp = await SanPhamModel.findOne({
//         where: { id: id },
//     })
//     if (!sp) {
//         res.status(404).json({ error: "Sản phẩm đã bị lỗi, vui lòng thử lại sau" });
//         return;
//     }
//     res.json(sp);
// })

app.get("/api/sp/:slug", async (req, res) => {
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

app.post("/api/sp/:slug", async (req, res) => {
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

// sản phẩm cùng loại
app.get("/api/products/same-category/:categoryId", async (req, res) => {
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

app.get("/api/sptrongloai/:id", async (req, res) => {
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

app.get("/api/loai/:id", async (req, res) => {
    const loai = await LoaiModel.findByPk(req.params.id)
    if (!loai) {
        res.status(404).json({ error: "Danh mục đã bị lỗi, vui lòng thử lại sau" });
        return;
    }
    res.json(loai);
})

// đặt hàng
app.post('/api/luudonhang', async (req, res) => {
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

// lưu giỏ hàng
app.post('/api/luugiohang', async (req, res) => {
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

app.listen(port, () => {
    console.log(`Ung dung dang chay o port ${port}`);
})
    .on('error', function (err) {
        console.log(`Loi xay ra khi chay ung dung ${err}`)
    });
