# Store Reviews Platform

A web application for managing store reviews, built with **React** (frontend) and **Node.js/Express** (backend). This platform allows users to rate stores, store owners to manage their stores, and admins to oversee the system.

## Features

### User Features
- Sign up and log in.
- Rate stores.
- Update password after logging in.

### Store Owner Features
- Log in to the platform.
- View ratings submitted for their store.
- See the average rating of their store.
- Update password after logging in.

### Admin Features
- Log in to the admin dashboard.
- View statistics (total users, stores, ratings).
- Manage users and stores (add/edit/delete).
- Update password after logging in.

---

## Tech Stack

### Frontend
- **React.js**: For building the user interface.
- **Bootstrap**: For styling components.

### Backend
- **Node.js**: Server-side runtime.
- **Express.js**: Web framework for building APIs.
- **PostgreSQL**: Database for storing user, store, and rating data.

---

## Installation

### Prerequisites
1. Install [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/).
2. Install [PostgreSQL](https://www.postgresql.org/).

### Clone the Repository
```bash
git clone https://github.com/Bhanukaushik/storeReview.git
cd store-reviews
```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```bash
   touch .env
   ```
   Add the following environment variables:
   ```
   PORT=5000
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```bash
   touch .env.local
   ```
   Add the following environment variables:
   ```
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

---

## Deployment

### Frontend Deployment (Vercel)
1. Push your frontend code to GitHub.
2. Deploy it on [Vercel](https://vercel.com/):
    - Import your repository.
    - Set `VITE_API_BASE_URL` as an environment variable pointing to your backend URL.

### Backend Deployment (Vercel or Render)
1. Push your backend code to GitHub.
2. Deploy it on [Vercel](https://vercel.com/) or [Render](https://render.com/):
    - Import your repository.
    - Set environment variables (`DATABASE_URL`, `JWT_SECRET`, etc.).

---

## API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint           | Description                 |
|--------|--------------------|-----------------------------|
| POST   | `/signup`          | Register a new user         |
| POST   | `/login`           | Log in                      |
| PUT    | `/update-password` | Update user password        |

### Admin (`/api/admin`)
| Method | Endpoint       | Description                 |
|--------|----------------|-----------------------------|
| GET    | `/stats`       | Get system statistics       |
| POST   | `/add-user`    | Add a new user              |
| POST   | `/add-store`   | Add a new store             |

### Store Owner (`/api/store-owner`)
| Method | Endpoint            | Description                          |
|--------|---------------------|--------------------------------------|
| GET    | `/ratings`          | Get ratings for owned stores         |
| GET    | `/average-rating`   | Get average rating of owned stores  |

---


Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m "Added feature"`).
4. Push to your branch (`git push origin feature-name`).
5. Open a pull request.

---

## License

This project is licensed under the MIT License.

---

Feel free to adapt this README to suit your project's specific needs!
