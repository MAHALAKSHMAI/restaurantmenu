# RestoPOS - Modern Restaurant Management System

A professional, full-stack Restaurant Point of Sale (POS) system built with React, Node.js, and MongoDB. Designed for efficiency, ease of use, and real-time operations.

## Features

- **Role-Based Access**: Specialized dashboards for Admin, Cashier, and Kitchen.
- **Modern POS Interface**: Touch-friendly menu grid with category filtering and beautiful food images.
- **Kitchen Display System (KDS)**: Real-time order tracking using Socket.io.
- **Admin Management**: Full CRUD operations for menu items, availability toggles, and sales performance overview.
- **Professional Receipts**: Integrated receipt generation and order success confirmation.
- **Indian Localized**: Prices in INR (₹) and a pre-configured Indian menu.

## Tech Stack

- **Frontend**: React, Tailwind CSS, Context API, React Router, Axios.
- **Backend**: Node.js, Express, Socket.io, JWT Authentication.
- **Database**: MongoDB (via Mongoose).

## Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally.

## Installation & Setup

### 1. Clone the project
```bash
git clone <repository-url>
cd restaurantmenu
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/restaurant_pos
JWT_SECRET=your_jwt_secret_key
```

### 3. Database Seeding
Initialize the database with default users and menu items:
```bash
npm run seed
```

### 4. Frontend Setup
```bash
cd ../frontend
npm install
```

## Running the Application

### Start Backend
```bash
cd backend
npm run dev
```

### Start Frontend
```bash
cd frontend
npm start
```

## Default Login Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@pos.com` | `admin123` |
| **Cashier** | `cashier@pos.com` | `cashier123` |
| **Kitchen** | `kitchen@pos.com` | `kitchen123` |
