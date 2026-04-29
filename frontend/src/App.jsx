import {createBrowserRouter, RouterProvider} from 'react-router-dom';
// import HomePage from './components/Homepage/HomePage';
import Report from './components/Report/Report';
import Dashboard from './components/Dashboard/Dashboard';
// import FieldOfficerLogin from './components/FieldOfficer/FieldOfficerLogin';
import FieldOfficerDashboard from './components/FieldOfficer/FieldOfficerDashboard';
import FieldReportDetail from './components/FieldOfficer/FieldReportDetail';
// import SupervisorLogin from './components/Supervisor/SupervisorLogin';
import SupervisorDashboard from './components/Supervisor/SupervisorDashboard';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from './components/auth/login';
import Register from './components/auth/register'
import ForgotPassword from './components/auth/forgetPassword'
import OtpVerify from './components/auth/otpVerify'
import ResetPassword from './components/auth/resetPassword';
import Home from './components/pages/Home';
import Layout from './components/pages/Layout';
import AppTheme from './sharedTheme/AppTheme';
import { CssBaseline } from '@mui/material';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const router = createBrowserRouter([
  {
    element: <Layout/>,  // 👈 THIS IS IMPORTANT
    children: [
      {
        path: '/home',
        element: <Home/>
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/report',
            element: <Report/>
          }
        ]
      }
    ]
  },

  // Dashboard Routes (with their own Layout/Sidebars)
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard/>
      },
      {
        path: '/field-officer/dashboard',
        element: <FieldOfficerDashboard/>
      },
      {
        path: '/field-officer/reports/:id',
        element: <FieldReportDetail/>
      },
      {
        path: '/supervisor/dashboard',
        element: <SupervisorDashboard/>
      }
    ]
  },

  // Auth pages WITHOUT navbar
  {
    path: '/',
    element: <Login/>
  },
  {
    path: '/register',
    element: <Register/>
  },
  {
    path: '/verify-otp',
    element: <OtpVerify/>
  },
  {
    path: '/forget-password',
    element: <ForgotPassword/>
  },
  {
    path: '/reset-password',
    element: <ResetPassword/>
  }
]);
    
  return (
     <AppTheme>
       <CssBaseline enableColorScheme />
       <RouterProvider router={router} />
       <ToastContainer position="top-right" autoClose={3000} />
     </AppTheme>
  );
}

export default App;
