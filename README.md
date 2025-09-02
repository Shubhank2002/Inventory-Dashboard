📦 Inventory Management Dashboard (MERN Stack with Custom Drag & Drop)

A MERN-based Inventory & Sales Management Dashboard that enables businesses to manage products, invoices, and sales statistics efficiently.
Includes custom drag-and-drop (no external library), invoice management, search & pagination, and real-time stock tracking.

🚀 Live Demo

Frontend: https://inventory-dashboard-mtp3.onrender.com

Backend: https://inventory-dashboard-backend-hxjm.onrender.com

👤 Demo Credentials
Email: maheshwarishubhank2002@gmail.com

Password: shubhank123

Note : Please wait for 10-20 seconds initially after clicking on frontend link, as render takes this much time to fetch data  from backend.


🛠️ Tech Stack

Frontend

React (Vite)

Vanilla Modular CSS

React Toastify (for notifications)

 Recharts (for graphs)
 

Backend

Node.js + Express

MongoDB (Atlas)

JWT Authentication

Bcryptjs for password encryption

Node-cron for expiry cleanup


Hosting

Frontend → Render

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

Add / Delete products

Product attributes: name, price, quantity, threshold, expiry date, unit, productid (mandatory!)

Auto-calculated availability (In Stock, Low Stock, Out of Stock, Expired)

CSV bulk upload (no images, productId required)

Daily cron job removes expired products & updates availability

Pagination & search handled in backend

Click on product row → modal to order product (quantity change)


🔹 Invoice Management


Generate invoices linked to products

Invoice list with Paid/Unpaid status

Update status → generates reference number automatically

Download invoice as PDF 

Pagination & search supported


🔹 Statistics Module


Total revenue, products sold, products in stock

Monthly sales & purchase graphs

Top products with ranking & ratings

Drag-and-drop functionality applied in horizontal sections


🔹 Settings


User profile management


🔹 Authentication & Authorization


Secure JWT-based auth (no third-party auth libs)

Signup & Login flows

Password recovery via email OTP (backend email integration)

Passwords stored securely with bcryptjs

Session maintained via JWT tokens



🔹 Notifications & Feedback


Toast notifications for success & error events

Form validation & error handling on frontend & backend


⚠️ Precautions & Notes

While creating a product, the user must provide a unique productId (per owner).

For CSV bulk uploads, the CSV file must contain a productId column; otherwise, rows will be skipped.

The system uses a cron job to automatically mark products as Expired and set their quantity to 0 once past expiry date.

Search & pagination are handled in the backend; frontend should not attempt filtering large lists.

Passwords are always stored encrypted; never use plain text.

The invoiceId is generated automatically — users should not try to override it.


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


Run frontend:

npm run dev



