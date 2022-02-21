<!-- ABOUT THE PROJECT -->

## About The Project

This project consists of a fully fledged ecommerce store. Containing both a client for the store and an admin console.

## Features:

# Client:

- Responsive Layout
- SEO optimization
- N levels of categories and subcategories
- Smart searching
- Product sorting and filtering
- Products pagination
- Categories page
- All products page
- Breadcrumbs
- Image lazyloading blured placeholders
- Skeleton placeholders while fetching data
- Discounts and variable prices
- Product page
- Product attributes selection
- Price and stocks based on the selected variations
- Product images carousel with zooming and panning
- Product description and specifications
- Related products
- Cart page with add subtract remove products
- Checkout page with card and cash checkout
- and more ...

# Admin:

- View orders
- Modify order status
- View add and remove images
- View add and remove categories or subcategories
- View add edit or delete products
- Product variations generation based on attributes
- and more ...

# Server:

- Cookie auth
- Loadbalancing
- Redis cluster
- and more ...

### Built With

Those are the frameworks/libraries used to build this project.

- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.com/)
- [TypeORM](https://typeorm.io/#/)
- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Chakra-UI](https://chakra-ui.com/)

For a full list please check package.jsons situated in project folders

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

To run this project you will need to do the following:

- yarn
  ```sh
  npm install --global yarn
  ```
- Install redis for [Windows](https://github.com/microsoftarchive/redis/releases/tag/win-3.0.504) or for [other operating systems](https://redis.io/download)
- Install [PostgreSQL](https://www.postgresql.org/download/)

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/CristianCiubancan/reddit-server
   ```
2. Install packages for each and every folder
   ```sh
   yarn install
   ```
3. Edit the `.env` files in all of the folders
4. build the js version or watch for changes on the server
   ```sh
   yarn watch
   ```
5. Run the server
   ```sh
   yarn dev
   ```
6. run client and admin
   ```sh
   yarn dev
   ```
