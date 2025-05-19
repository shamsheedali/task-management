# TaskFlow

## About

TaskFlow is a modern task management application built with the **MERN stack** (MongoDB, Express.js, React, Node.js). Users can create task lists and manage individual tasks efficiently.

## ✨ Features

- User authentication and registration  
- Create, update, and delete task lists  
- Add, edit, and remove tasks within lists  
- Responsive UI for desktop and mobile

## Tech Stack

### **Frontend**
- React.js (TypeScript)
- Tailwind CSS & Desi UI for styling and components
- Zustand & React Query for state management and data fetching

### **Backend**
- Express.js (TypeScript)
- MongoDB with Mongoose for data storage
- Redis for OTP and caching
- JWT for authentication
- Linting (ESLint) and formatting (Prettier) for code quality

## Project Structure

```
task-management/
├── client/        # Frontend (React.js + TS)
├── server/        # Backend (Express.js + TS)
```

## Installation

### Prerequisites

- Node.js (>=18.x)
- MongoDB and Redis

### Steps to Run the Project

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/task-management.git
   cd task-management
   ```

2. **Set up environment variables:**
   - Create `.env` files in both `client/` and `server/` directories.
   - Add MongoDB URI, Redis URI, JWT secret, OAuth credentials, and any other required settings.

3. **Manual Start (for development):**

   - **Backend:**
     ```sh
     cd server
     npm install
     npm run dev
     ```
   - **Frontend:**
     ```sh
     cd client
     npm install
     npm run dev
     ```

4. **Linting & Formatting:**
   - **Frontend:**  
     ```sh
     npm run lint
     ```
   - **Backend:**  
     ```sh
     npm run lint
     npm run format
     ```

5. **Access the app:**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:5000](http://localhost:5000) (default ports, configurable)

## Example `.env` (Backend)

```
PORT=5000
NODE_ENV=development
LOG_LEVEL=info
MONGO_URI=your mongodb url
JWT_SECRET=your jwt secret
REFRESH_JWT_SECRET=your refresh jwt secret
REFRESH_JWT_MAX_AGE=7 * 24 * 60 * 60 * 1000
REDIS_URL=your redis url
REDIS_PASSWORD=your redis password
EMAIL_USER=your email for otp
EMAIL_PASS=email passoword for otp
```

## Example `.env` (Frontend)

```
VITE_API_URL=http://localhost:5000/api
```

## Scripts

| Location   | Script          | Purpose                    |
|------------|-----------------|----------------------------|
| client     | `npm run dev`   | Start frontend (React.js)   |
| client     | `npm run lint`  | Lint frontend code         |
| server     | `npm run dev`   | Start backend (Express.js) |
| server     | `npm run lint`  | Lint backend code          |
| server     | `npm run format`| Format backend code        |

## Contact

📧 Email: shamsheedali0786@gmail.com
📌 GitHub: [shamsheedali](https://github.com/shamsheedali)
