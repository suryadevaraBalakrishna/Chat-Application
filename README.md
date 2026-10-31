# 💬 Chat Application

A full-stack real-time chat application built using the **MERN Stack**. Users can register, log in, view other users, send real-time messages, see online users, and manage their profiles.

## 🚀 Live Demo

🔗 **Frontend:** https://chat-application-front-end-two.vercel.app/login

🔗 **Backend API:** https://chat-application-worm.onrender.com/

---

## 📸 Features

### 🔐 Authentication

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Authentication token stored using Cookies
- User Logout

### 💬 Real-Time Chat

- Send messages between users
- Receive messages in real time
- Messages stored in MongoDB
- Conversation-based messaging
- Chat history loading
- Real-time communication using Socket.IO

### 🟢 Online User Status

- Shows users when they come online
- Shows users when they go offline
- Supports multiple connections for the same user
- Online users are managed using Socket.IO rooms

### 👤 User Profile

- View user profile
- Profile image
- Full name
- Username
- Email address
- Phone number
- WhatsApp-inspired profile UI

### 🎨 User Interface

- WhatsApp-inspired chat design
- Responsive layout
- User sidebar
- Chat window
- Message input box
- Profile page
- Online/offline indicators

---

# 🛠️ Technologies Used

## Frontend

- React.js
- Vite
- React Router
- Redux Toolkit
- React Redux
- Axios
- Socket.IO Client
- Tailwind CSS
- DaisyUI
- Font Awesome
- js-cookie

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- JSON Web Token (JWT)
- bcrypt
- CORS
- dotenv

---

# 📂 Project Structure

```text
Chat Application
│
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── models
│   │   ├── routes
│   │   ├── socket
│   │   └── middleware
│   │
│   ├── uploads
│   │   └── user
│   │
│   ├── index.js
│   └── package.json
│
├── frontend
│   ├── src
│   │   ├── components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── MessageBox.jsx
│   │   │   └── MyProfile.jsx
│   │   │
│   │   ├── slice
│   │   │   └── loginSlice.js
│   │   │
│   │   ├── socket
│   │   │   └── socket.js
│   │   │
│   │   ├── store
│   │   │   └── store.js
│   │   │
│   │   ├── App.jsx
│   │   │
│   │   └── main.jsx
│   │
│   └── package.json
│
└── README.md
```

---

# ⚙️ Installation

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/suryadevaraBalakrishna/Chat-Application.git
```

Move into the project:

```bash
cd Chat-Application
```

---

# 🖥️ Backend Setup

Go to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=8000

DB=your_mongodb_connection_string

KEY_VALUE=your_jwt_secret

origin=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
```

or:

```bash
node index.js
```

The backend will run on:

```text
http://localhost:8000
```

---

# 💻 Frontend Setup

Go to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_BASE_URL=http://localhost:8000
```

Start the frontend:

```bash
npm run dev
```

The application will run on:

```text
http://localhost:5173
```

---

# 🔌 Socket.IO Implementation

Socket.IO is used for:

- Real-time messages
- Online user status
- Offline user status
- User-specific Socket.IO rooms

Each logged-in user joins a room using their user ID.

Example:

```javascript
socket.emit('join', userId)
```

Messages are emitted to the sender and receiver:

```javascript
io.to(String(receiverId)).emit('newMessage', newMessage)
io.to(String(senderId)).emit('newMessage', newMessage)
```

---

# 🟢 Online User System

The application tracks online users using a `Map`.

```javascript
const onlineUsers = new Map()
```

Each user can have multiple active connections.

A user is marked offline only when their final socket connection is disconnected.

---

# 🔐 Authentication Flow

1. User registers an account.
2. User logs in.
3. Backend generates a JWT token.
4. Token is stored in Cookies.
5. Redux stores the user and token.
6. Protected routes check whether the token exists.
7. User can access the chat application.

---

# 📡 Deployment

## Frontend

The frontend is deployed on **Vercel**.

🔗 https://chat-application-front-end-two.vercel.app/login

## Backend

The backend is deployed on **Render**.

🔗 https://chat-application-worm.onrender.com/

---

# 📌 Future Improvements

- ✏️ Edit profile
- 📷 Upload/change profile image
- 😊 Emoji support
- 📎 File sharing
- 🖼️ Image messaging
- 🔔 Message notifications
- ✔️ Message delivered status
- 👁️ Message read status
- 🔍 Search users
- 🗑️ Delete messages
- 🌙 Dark mode
- 👥 Group chat
- 🎥 Audio and video calling

---

# 👨‍💻 Developer

**Suryadevara Balakrishna**
