# ChronoCare

## Overview

ChronoCare is a web application designed to help users monitor and record their blood pressure and blood sugar levels. Built with TypeScript, React, and Vite, it offers a user-friendly interface, real-time data visualization, and secure authentication to ensure your health data is always accessible and safe.

## Features

- **User Authentication:** Secure sign-up and login functionalities.
- **Data Recording:** Easily record blood pressure and blood sugar readings.
- **History Tracking:** View and manage your health records over time.
- **Data Visualization:** Interactive charts and graphs to visualize your health data.
- **Responsive Design:** Accessible on both desktop and mobile devices.
- **Real-time Updates:** Instant feedback and updates with Hot Module Replacement (HMR).

## Technologies Used

- **Frontend:**
  - [React](https://reactjs.org/) with TypeScript
  - [Vite](https://vitejs.dev/) for fast development and build
  - [Material-UI (MUI)](https://mui.com/) for UI components
  - [Formik & Yup](https://formik.org/, https://github.com/jquense/yup) for form handling and validation
  - [Firebase](https://firebase.google.com/) for authentication and backend services
- **Charting:**
  - [Chart.js](https://www.chartjs.org/) and [Recharts](https://recharts.org/) for data visualization
- **State Management & Routing:**
  - [React Router](https://reactrouter.com/) for navigation
  - Custom hooks and context for state management

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

### Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/chronocare.git
   ```
2. **Navigate to the Project Directory**
   ```bash
   cd chronocare
   ```
3. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```
4. **Configure Environment Variables**

   - Create a `.env` file in the root directory.
   - Add your Firebase configuration and other necessary environment variables as per `.env.example`.

5. **Run the Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The app will be available at `http://localhost:5173`.

## Scripts

- **Start Development Server**
  ```bash
  npm run dev
  ```
- **Build for Production**
  ```bash
  npm run build
  ```
- **Preview Production Build**
  ```bash
  npm run preview
  ```
- **Lint Code**
  ```bash
  npm run lint
  ```

## Usage

1. **Sign Up / Log In**

   - Create an account or log in with existing credentials.

2. **Record Health Data**

   - Navigate to the Record Page to input your blood pressure and blood sugar levels.

3. **View History**

   - Access the History Page to view your past records in a table format.

4. **Visualize Data**
   - Visit the Dashboard to see charts and trends related to your health data.

## Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to get started.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [Material-UI](https://mui.com/)
- [Firebase](https://firebase.google.com/)
- [Chart.js](https://www.chartjs.org/)
- [Recharts](https://recharts.org/)

## Contact

For any inquiries or feedback, please reach out to [kunsorei5@gmail.com](mailto:kunsorei5@gmail.com).
