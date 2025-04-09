# ShopTech-ecommerce

**ShopTech-ecommerce** is a modern e-commerce website built with **React.js** and **Next.js**, allowing users to shop for electronic products easily and conveniently.

---

## ✨ Features

ShopTech-ecommerce provides a seamless shopping experience with a wide range of features for both users and administrators.

### 🏢 User Features

- **User Authentication**: Sign up, log in, and manage personal accounts.
- **Product Browsing**: Explore products by category with filters and search.
- **Product Details**: View comprehensive product info including images, prices, and descriptions.
- **Shopping Cart**: Add, update, or remove items from the cart in real-time.
- **Checkout**: Place orders and receive confirmation.
- **News Section**: Stay informed with technology-related articles.
- **About Us**: Learn about the store and its services.

---

## 🛠️ Admin Panel Features

The admin panel allows administrators to fully manage the platform through standard **CRUD operations**, with soft-delete support (`deleteSoft`) where applicable.

### 👤 User Management
- **Create**: Add new user accounts.
- **Read**: View a list of all users.
- **Update**: Edit user information.
- **Soft Delete**: Temporarily disable users without permanent deletion.

### 📦 Product Management
- **Create**: Add new products with full details.
- **Read**: View and search product listings.
- **Update**: Edit product info such as name, price, image, description.
- **Soft Delete**: Move products to trash instead of permanent deletion.

### 🗃️ Category Management
- **Create**: Define new product categories.
- **Read**: List all active categories.
- **Update**: Modify category names or settings.
- **Soft Delete**: Hide categories while retaining them in the database.

### 📰 News Management
- **Create**: Post new news articles or blog content.
- **Read**: Browse and manage existing posts.
- **Update**: Edit published articles.
- **Delete**: Remove articles (can be extended with soft-delete if needed).

### 📟 Order Management
- **Read Only**: View and track all customer orders with full details (user, products, total, status).

### 🗭 Admin Layout
- Custom layout for administrators.
- Sidebar navigation with clear separation of admin modules.
- Modular and scalable structure inside `app/admin`.

---

## 📂 Project Structure

```
ShopTech-ecommerce/
│
├── client/
│   ├── app/
│   │   ├── admin/                    # Admin dashboard routes
│   │   │   ├── categories/           # Manage product categories
│   │   │   │   ├── add/page.tsx      # Add new category
│   │   │   │   ├── edit/[id]/        # Edit specific category
│   │   │   │   ├── trash/page.tsx    # View deleted categories
│   │   │   │   └── page.tsx          # Category list
│   │   │   ├── news/                 # Manage news/articles
│   │   │   │   ├── add/page.tsx
│   │   │   │   ├── edit/[id]/page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── orders/page.tsx       # View orders
│   │   │   ├── products/             # Manage products
│   │   │   │   ├── add/page.tsx
│   │   │   │   ├── edit/[id]/page.tsx
│   │   │   │   ├── trash/page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── users/                # Manage user accounts
│   │   │   │   ├── add/page.tsx
│   │   │   │   ├── edit/[id]/page.tsx
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx            # Admin layout wrapper
│   │
│   │   ├── main/                     # Public facing pages
│   │   │   ├── about-page/page.tsx   # About us
│   │   │   ├── cart/                 # Shopping cart
│   │   │   │   ├── checkout/page.tsx
│   │   │   │   ├── order-confirmation/page.tsx
│   │   │   │   └── page.tsx
│   │
│   │   ├── news-page/                # News article section
│   │   │   ├── [slug]/page.tsx       # Article details
│   │   │   ├── search/page.tsx       # Search news
│   │   │   └── page.tsx              # News home
│   │
│   │   ├── product/                  # Product browsing
│   │   │   ├── bycategory/[id]/page.tsx # Products by category
│   │   │   ├── detail/[slug]/page.tsx   # Product detail
│   │   │   └── page.tsx              # All products
│   │
│   │   ├── search/page.tsx           # Product search results
│   │   ├── layout.tsx                # Main layout
│   │   └── page.tsx                  # Homepage
│
│   ├── components/                   # Reusable UI components
│   │   ├── admin_side/sidebar.tsx    # Sidebar for admin layout
│   │   ├── category.tsx              # Render product category
│   │   ├── footer.tsx
│   │   ├── header.tsx
│   │   ├── homeProduct.tsx
│   │   ├── Pagination.tsx
│   │   ├── product.tsx
│   │   └── SearchBar.tsx
│
│   ├── lib/                          # Store + cart logic
│   │   ├── cartSlice.ts
│   │   └── store.ts
│
│   ├── styles/
│   │   └── data.tsx                  # Style-related configs or constants
│
│   ├── useDebounce.ts               # Debounce hook for search, etc.
│   ├── favicon.ico
│   └── layout.tsx
│
├── public/                          # Static assets (images, etc.)
│
├── server/                          # Backend API server
│   ├── config/db.js                 # MongoDB (or other) connection
│   └── server.js                    # Express or custom backend
│
├── .gitignore
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.js
├── postcss.config.js
├── tailwind.config.js
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

