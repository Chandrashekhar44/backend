# 🚀 Blog Authentication & Content Management API (Backend Only)

A **highly scalable, feature-rich backend** built with the MERN stack.  
This project demonstrates **professional backend architecture** with **JWT authentication, advanced content management, and analytics**, designed to showcase **real-world production-level backend skills**.  


## ✨ Key Highlights

- 🔐 **Secure JWT Authentication & Authorization** – Login, register, refresh tokens, and role-based access  
- 🔹 **RESTful API design** – Clean endpoints following REST principles 
- 📝 **Complete CRUD System** – Blogs, videos, tweets, comments, playlists  
- ❤️ **Social Features** – Likes, subscriptions, and watch history  
- 🎥 **Media Management** – Upload images and videos using Multer + Cloudinary  
- 📊 **Advanced Analytics** – MongoDB aggregation pipelines for:
  - Channel stats (total views, likes, subscribers)  
  - Trending content & top-performing videos/tweets  
  - Personalized watch history analysis  
- ⚡ **Professional Middleware** – Error handling, JWT verification, file upload, CORS  
- 🌐 **Production-ready Architecture** – Modular folder structure and reusable components  
- 💡 **Forward-thinking Design** – Easily extendable for features like password recovery and admin dashboards  

> This is not just a backend; it’s a **demonstration of building a production-ready API**, simulating real-world applications like YouTube or Medium.

---

## 🛠️ Tech Stack

- **Backend Framework:** Node.js + Express.js  (REST API)  
- **Database:** MongoDB (Mongoose ODM)  
- **Authentication:** JWT (JSON Web Tokens)  
- **File Storage:** Cloudinary via Multer  
- **API Testing:** Postman  
- **Deployment:** Render  

---

## 📂 Project Structure

backend/
│── controllers/ # Business logic for routes
│── models/ # MongoDB schemas
│── routes/ # API endpoints
│── middlewares/ # Authentication, error handling, file uploads
│── utils/ # Helpers & aggregation utilities
│── db/ # Database connection
│── public/ # Static files
│── index.js # Entry point
│── app.js # Express app setup
│── .env.sample # Example environment variables
│── README.md # Documentation

## 🚀 Getting Started


1️⃣ Clone the repository
```bash
git clone https://github.com/Chandrashekhar44/backend.git
cd backend 
```

2️⃣ Install dependencies
```bash
 npm install
```


3️⃣ Configure environment variables
Create a `.env` file in the root directory:


.env
```bash
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=http://localhost:8000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 🛠️ Test the API

Test all endpoints using this Postman collection:  
[Open in Postman](https://banothuchandu77-1301270.postman.co/workspace/BlackBox~498f53dc-2dc6-4ffe-8daa-3d3a80c7e0f8/collection/48031684-fcf1d478-9277-4663-952a-cc9af9e96bda?action=share&source=copy-link&creator=48031684)

Start by registering a user and logging in to get a JWT token.

All endpoints are JWT-protected; start with /api/v1/users/register and /api/v1/users/login.



📡 API Routes

👤 Users

| Method    | Route                           | Description                                          |
| --------- | ------------------------------- | ---------------------------------------------------- |
| **POST**  | `/api/v1/users/register`        | Register a new user (supports avatar & cover images) |
| **POST**  | `/api/v1/users/login`           | Login and receive JWT token                          |
| **POST**  | `/api/v1/users/refresh-token`   | Refresh JWT token                                    |
| **POST**  | `/api/v1/users/change-password` | Change password                                      |
| **POST**  | `/api/v1/users/logout`          | Logout user                                          |
| **GET**   | `/api/v1/users/current-user`    | Get current user info                                |
| **PATCH** | `/api/v1/users/update-account`  | Update account info                                  |
| **PATCH** | `/api/v1/users/avatar`          | Update avatar                                        |
| **PATCH** | `/api/v1/users/cover-image`     | Update cover image                                   |
| **GET**   | `/api/v1/users/c/:username`     | Get channel profile by username                      |
| **GET**   | `/api/v1/users/history`         | Get watch history                                    |


📝 Tweets

| Method     | Route                         | Description              |
| ---------- | ----------------------------- | ------------------------ |
| **POST**   | `/api/v1/tweets`              | Add a new tweet          |
| **GET**    | `/api/v1/tweets/user/:userId` | Get all tweets by a user |
| **PATCH**  | `/api/v1/tweets/:tweetId`     | Update tweet             |
| **DELETE** | `/api/v1/tweets/:tweetId`     | Delete tweet             |

💬 Comments

| Method             | Route                           | Description                   |
| ------------------ | ------------------------------- | ----------------------------- |
| **GET / POST**     | `/api/v1/comments/:videoId`     | Get / Add comment for a video |
| **PATCH / DELETE** | `/api/v1/comments/c/:commentId` | Update / Delete comment       |

❤️ Likes

| Method   | Route                               | Description             |
| -------- | ----------------------------------- | ----------------------- |
| **POST** | `/api/v1/likes/toggle/v/:videoId`   | Toggle like for video   |
| **POST** | `/api/v1/likes/toggle/c/:commentId` | Toggle like for comment |
| **POST** | `/api/v1/likes/toggle/t/:tweetId`   | Toggle like for tweet   |
| **GET**  | `/api/v1/likes/videos`              | Get liked videos        |


🔔 Subscriptions

| Method         | Route                                   | Description                                   |
| -------------- | --------------------------------------- | --------------------------------------------- |
| **POST / GET** | `/api/v1/subscriptions/c/:channelId`    | Toggle subscription / Get channel subscribers |
| **GET**        | `/api/v1/subscriptions/u/:subscriberId` | Get subscribed channels                       |

📊 Dashboard

| Method  | Route                       | Description                               |
| ------- | --------------------------- | ----------------------------------------- |
| **GET** | `/api/v1/dashboards/stats`  | Get channel stats (aggregation pipelines) |
| **GET** | `/api/v1/dashboards/videos` | Get user videos                           |


🎵 Playlists

| Method                   | Route                                           | Description                    |
| ------------------------ | ----------------------------------------------- | ------------------------------ |
| **POST**                 | `/api/v1/playlists`                             | Create playlist                |
| **GET / PATCH / DELETE** | `/api/v1/playlists/:playlistId`                 | Get / Update / Delete playlist |
| **PATCH**                | `/api/v1/playlists/add/:videoId/:playlistId`    | Add video to playlist          |
| **PATCH**                | `/api/v1/playlists/delete/:videoId/:playlistId` | Remove video from playlist     |
| **GET**                  | `/api/v1/playlists/user/:userId`                | Get user playlists             |


🎥 Videos

| Method                   | Route                                    | Description                 |
| ------------------------ | ---------------------------------------- | --------------------------- |
| **GET / POST**           | `/api/v1/videos`                         | Get all / Publish video     |
| **GET / PATCH / DELETE** | `/api/v1/videos/:videoId`                | Get / Update / Delete video |
| **PATCH**                | `/api/v1/videos/toggle/publish/:videoId` | Toggle publish status       |
| **PATCH**                | `/api/v1/videos/view/increment/:videoId` | Increment view count        |


🌐 Deployment

This backend is **already deployed** and live at:  
[https://blog-auth-api.onrender.com](https://blog-auth-api.onrender.com)

Database hosted on: MongoDB Atlas  
Media storage: Cloudinary

> All endpoints are accessible via the live API URL. Use Postman  to test.

📌 Future Enhancements

🔄 Forgot Password & Password Reset via Email
- Will include a **frontend interface** in the future for a complete user experience.  
 🌐 Improve user experience with **frontend integration** for authentication flows.  
 📦 Additional features and optimizations based on user feedback.

⚠️ Disclaimer

This project is for educational and portfolio purposes only.
Unauthorized commercial use, copying, or redistribution without permission is not allowed.


👤 Author

Chandrashekhar

GitHub: https://github.com/Chandrashekhar44
LinkedIn: https://www.linkedin.com/in/chandra-shekhar-89152131b
LiveAPI: [https://blog-auth-api.onrender.com](https://blog-auth-api.onrender.com)

## 📜 License

This project is licensed under the **MIT License**.  

- You can use, copy, or modify this project freely, as long as you give credit to the author.  
- The author is **not responsible** if anything goes wrong while using this code.  

See the [LICENSE](./LICENSE) file for full details.
