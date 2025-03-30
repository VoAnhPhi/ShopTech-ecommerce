# ShopTech-ecommerce

ShopTech-ecommerce is an e-commerce website built with **React.js and Next.js**, allowing users to shop for electronic products easily and conveniently.

##  Features
- **User Authentication**: Users can register and log in for a personalized experience.
- **Product Listing**: Display products by category and type.
- **Product Details**: Show detailed product information, including descriptions, prices, and images.
- **Shopping Cart**: Users can add products to the cart, update quantities, and remove items.
- **Checkout**: Allows users to place orders and proceed with payment.
- **News Section**: Display articles about technology and new products.
- **About Us**: Information about the store and services.

##  Project Structure
```
ShopTech-ecommerce/
│── client/
│   ├── .next/                     # Next.js build output
│   ├── app/                        # Next.js App Router
│   │   ├── about-page/
│   │   │   ├── page.tsx           # About Us page
│   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   │   ├── page.tsx       # Checkout page
│   │   │   ├── order-confirmation/
│   │   │   │   ├── page.tsx       # Order confirmation
│   │   │   ├── page.tsx           # Cart page
│   │   ├── news-page/
│   │   │   ├── [slug]/
│   │   │   │   ├── page.tsx       # News details page
│   │   │   ├── search/
│   │   │   │   ├── page.tsx       # News search page
│   │   │   ├── page.tsx           # News main page
│   │   ├── product/
│   │   │   ├── bycategory/[id]/
│   │   │   │   ├── page.tsx       # Products by category
│   │   │   ├── detail/[id]/
│   │   │   │   ├── page.tsx       # Product detail page
│   │   │   ├── page.tsx           # Product listing page
│   │   ├── search/
│   │   │   ├── page.tsx           # Search results page
│   ├── components/                 # UI components
│   │   ├── category.tsx
│   │   ├── footer.tsx
│   │   ├── header.tsx
│   │   ├── homeProduct.tsx
│   │   ├── Pagination.tsx
│   │   ├── product.tsx
│   │   ├── SearchBar.tsx
│   ├── styles/                     # CSS and related files
│   │   ├── globals.css
│   ├── data.tsx                     # Sample data
│   ├── favicon.ico
│   ├── layout.tsx                   # Main layout
│   ├── useDebounce.ts                # Custom debounce hook
│   ├── lib/                          # Utility functions
│── public/                           # Static assets
│── server/                           # Backend
│   ├── config/
│   │   ├── db.js                     # Database connection
│   ├── server.js                     # Backend API
│── .gitignore
│── eslint.config.mjs
│── next-env.d.ts
│── next.config.js
│── package.json
│── tsconfig.json
│── README.md
```

