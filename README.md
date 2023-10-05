# Next Marketplace

a Marketplace inspired by Tokopedia.

It is a simple shopping website like tokopedia, you can sign in and then you can start select the products that you want to add to the shopping cart.

## Features

### User

- Sign in / Sign out (Google only)
- Add products to shopping cart
- Search for products based on the product name
- Change the amount of items in shopping cart and you can delete them
- Checkout, but the checkout action only removed the cart items from the cart and then add a new transaction record in the database. So no real payment integrated.

### Admin

- Sign in / Sign (Credentials only)
- CRUD in categories, products
- Update Order Status
- And there's a simple chart in the admin dashboard (on proccess)

## Tech

- Next js
- Tailwind
- Typescript
- react-toastify
- Framer motion
- Next Auth
- Uploadthing
- Axios
- Zod
- Prisma
- React hook form
- Swiper
- Radix ui

## Installation

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
