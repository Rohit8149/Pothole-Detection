import logo from './logo.svg';
import './App.css';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import SlidingAuth from './components/Slidingauth/SlidingAuth';
import HomePage from './components/Homepage/HomePage';
import Report from './components/Report/Report';
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import Dashboard from './components/Dashboard/Dashboard';
// import FieldOfficerLogin from './components/FieldOfficer/FieldOfficerLogin';
import FieldOfficerDashboard from './components/FieldOfficer/FieldOfficerDashboard';
import FieldReportDetail from './components/FieldOfficer/FieldReportDetail';
// import SupervisorLogin from './components/Supervisor/SupervisorLogin';
import SupervisorDashboard from './components/Supervisor/SupervisorDashboard';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <SlidingAuth/>
    },

    {
      path: '/home',
      element: <HomePage/>
    },

    {
      path: '/report',
      element: <Report/>
    },

    {
      path: '/about',
      element: <About/>
    },

    {
      path: '/contact',
      element: <Contact/>
    },

    {
      path: '/dashboard',
      element: <Dashboard/>
    },

    // Field Officer routes
    {
      path: '/field-officer/dashboard',
      element: <FieldOfficerDashboard/>
    },
    {
      path: '/field-officer/reports/:id',
      element: <FieldReportDetail/>
    },

    // Supervisor routes
    {
      path: '/supervisor/dashboard',
      element: <SupervisorDashboard/>
    },
  ]);
  
    
  return (
     <>
     <RouterProvider router={router} />
     <ToastContainer position="top-right" autoClose={3000} />
     </>
  );
}

export default App;
