# MERN Social Media App

A full-stack social media application built using the MERN stack.  
This project was developed as a rapid prototype to demonstrate full-stack architecture, authentication flows, media uploads, and scalable structure.

---

## Features Implemented

### Authentication & Users
- User registration & login
- JWT-based authentication
- Protected routes with middleware
- Profile view & edit

### Posts
- Create / delete posts
- Image upload (Cloudinary integration)
- Like & comment system
- Feed rendering

### Chat (Schema Designed)
- Chat and message models structured
- Backend groundwork prepared for real-time messaging

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- Redux Toolkit
- Tailwind CSS
- Custom hooks for data fetching

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Multer (file handling)
- Cloudinary (media storage)

---

## Project Structure

### Backend
```
controllers/
middleware/
models/
routes/
utils/
index.js
```

### Frontend
```
components/
hooks/
redux/
views/
App.jsx
```

The architecture follows a clear separation of concerns:
- Controllers handle logic
- Routes define endpoints
- Middleware manages auth & uploads
- Models define database schema

---

## Authentication Flow

1. User logs in
2. Server validates credentials
3. JWT token generated
4. Token stored client-side
5. Auth middleware protects private routes

---

## Media Upload Flow

1. Frontend sends file via form-data
2. Multer processes file
3. File converted to Data URI
4. Uploaded to Cloudinary
5. Image URL stored in database

---

## Setup Instructions

### Backend

```bash
cd backend
npm install
npm run dev
```

Create a `.env` file with:

```
PORT=
MONGO_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Purpose

This project demonstrates:
- Full-stack MERN architecture
- Authentication & middleware handling
- File upload integration
- State management with Redux
- Modular and scalable code structure

---

## Notes

Messaging and notifications modules are structured at the schema level and are planned for real-time implementation in future iterations.
