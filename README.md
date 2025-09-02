📦 Inventory Management Dashboard (MERN Stack with Custom Drag & Drop)

A MERN-based Inventory & Sales Management Dashboard that enables businesses to manage products, invoices, and sales statistics efficiently.
Includes custom drag-and-drop (no external library), invoice management, search & pagination, and real-time stock tracking.

🚀 Live Demo

Frontend: [Your Netlify/Render link here]

Backend: [Your Render link here]

👤 Demo Credentials
Email: demo@example.com
Password: Demo@123

🛠️ Tech Stack

Frontend

React (Vite)

Vanilla Modular CSS

React Toastify (for notifications)

Chart.js / Recharts (for graphs)

Backend

Node.js + Express

MongoDB (Atlas)

JWT Authentication

Bcryptjs for password encryption

Node-cron for expiry cleanup

Hosting

Frontend → Netlify/Render

Backend → Render

📌 Features Implemented
🔹 Dashboard (Home)

Sales overview (Sales, Revenue, Profit, Cost)

Purchase overview (Purchases, Cost, Cancel, Return)

Inventory summary (Quantity in hand, To be received)

Product summary (Suppliers, Categories)

Sales & Purchase graphs (Weekly/Monthly/Yearly filters)

Top products list (based on sales)

Drag-and-drop support for reordering widgets/cards (persisted in DB)

🔹 Product Management

Add / Edit / Delete products

Product attributes: name, price, quantity, threshold, expiry date, unit

Auto-calculated availability (In Stock, Low Stock, Out of Stock, Expired)

CSV bulk upload (no images, productId required)

Daily cron job removes expired products & updates availability

Pagination & search handled in backend

Click on product row → modal to order product (quantity change)

🔹 Invoice Management

Generate invoices linked to products

Invoice list with Paid/Unpaid status

Update status → generates reference number automatically

Export invoice as PDF / Print option

Pagination & search supported

🔹 Statistics Module

Total revenue, products sold, products in stock

Monthly sales & purchase graphs

Top products with ranking & ratings

Drag-and-drop functionality applied in horizontal sections

🔹 Settings

User profile management

Reset dashboard layout

🔹 Authentication & Authorization

Secure JWT-based auth (no third-party auth libs)

Signup & Login flows

Password recovery via email OTP (backend email integration)

Passwords stored securely with bcryptjs

Session maintained via JWT tokens

🔹 Notifications & Feedback

Toast notifications for success & error events

Form validation & error handling on frontend & backend

⚡ Installation & Setup Instructions
1. Clone the repository
git clone https://github.com/<your-username>/inventory-dashboard.git

2. Backend Setup
cd backend
npm install


Create .env file:

PORT=8000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
EMAIL_USER=your_email
EMAIL_PASS=your_password


Run backend:

npm start

3. Frontend Setup
cd frontend/vite-project
npm install


Create .env file:

VITE_API_URL=https://your-backend.onrender.com


Run frontend:

npm run dev


Build for production:

npm run build

✅ Submission Checklist

 Pixel perfect UI with modular CSS

 JWT auth with password encryption

 CSV upload for multiple products

 Backend-driven search & pagination

 Invoice export as PDF

 Cron job for expired products

 Proper error handling (frontend + backend)

 Live deployment (frontend + backend)

📊 Evaluation Criteria

Coding standards & best practices followed

All checklist functionalities implemented

Edge cases & validations handled

Proper error handling

Secure authentication
