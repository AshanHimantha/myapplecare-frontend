# My Apple Care - Frontend 🖥️


[![React](https://img.shields.io/badge/React-17.0.2-61DAFB.svg?logo=react)](https://reactjs.org/)


<img width="1087" height="224" alt="Screenshot 2025-03-31 121354" src="https://github.com/user-attachments/assets/0fa7cfb7-da4c-468a-98ba-3a74b718894e" />


This is the React.js frontend for "My Apple Care," a web application designed for managing Apple product repairs and services. It provides a user-friendly interface for both customers and administrators.

**⚙️ Backend Repository:** [[Link to Backend Repo]](https://github.com/AshanHimantha/myapplecare-backend) 

---

## ✨ Features

- **Role-Based Authentication:** Separate login and dashboard experiences for regular users and administrators.
- **Admin Dashboard:** A comprehensive view for administrators to manage users, view all repair requests, and update repair statuses.
- **User Dashboard:** A personalized space for users to view their registered products and track the status of their repair requests.
- **Repair Request Management:** Users can submit new repair requests, and admins can process them.
- **Responsive UI:** The interface is built with Tailwind CSS to ensure a seamless experience on both desktop and mobile devices.

---


## 📸 Screenshots

| Sales Outlet | Service Center | Admin Dashboard |
| :----------: | :------------: | :-------------: |
| <img src="https://github.com/user-attachments/assets/00169948-6603-4251-9bde-5509bc652912" alt="Sales Outlet" width="450"/> | <img src="https://github.com/user-attachments/assets/385185c4-a3eb-4978-85d7-e404aa98d462" alt="Service Center" width="450"/> | <img src="https://github.com/user-attachments/assets/23e0337c-727f-4159-b0b4-6641e7e1cef4" alt="Admin Dashboard" width="450"/> |

---

## 🛠️ Tech Stack

- **Core Library:** [React.js](https://reactjs.org/)
- **UI Component Library:** [Material-UI v4](https://v4.mui.com/)
- **Routing:** [React Router](https://reactrouter.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) & [React Hooks](https://reactjs.org/docs/hooks-intro.html)
- **API Communication:** [Axios](https://axios-http.com/)
- **Authentication Handling:** [JWT (JSON Web Tokens)](https://jwt.io/)

---

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

You need to have Node.js and npm (or yarn) installed on your system.
- [Node.js](https://nodejs.org/) (which includes npm)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/AshanHimantha/myapplecare-frontend.git
    cd myapplecare-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    -   This project requires a connection to a backend API. Create a `.env` file in the root of the project directory.
        ```bash
        touch .env
        ```
    -   Add the following line to the `.env` file, replacing the URL with the actual address of your running backend server.
        ```env
        REACT_APP_API_URL=http://localhost:5000/api
        ```
        > **Note:** The `REACT_APP_` prefix is required by Create React App. The port `5000` is an example; use the port your backend is running on.

4.  **Run the application:**
    ```bash
    npm start
    ```
    The application will open in your default browser at `http://localhost:3000`.

---

## 📜 Available Scripts

In the project directory, you can run:

-   `npm start`
    -   Runs the app in development mode.

-   `npm test`
    -   Launches the test runner in interactive watch mode.

-   `npm run build`
    -   Builds the app for production to the `build` folder.

---

