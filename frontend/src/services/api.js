// /services/api.js
import axios from "axios";

const API_BASE = "http://localhost:5000/api"; // change if production

export const registerUser = async (name, email, password) => {
  try {
    const response = await axios.post(`${API_BASE}/auth/register`, {
      name,
      email,
      password,
    });
    return response.data; // { message: 'Registration successful' }
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Something went wrong. Please try again later.");
    }
  }
};

// Login function
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, { email, password });
    return response.data; // { token, role, name }
  } catch (error) {
    // Handle API errors
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Something went wrong. Please try again later.");
    }
  }
};

// ----- Forgot Password / Send OTP -----
export const sendOTP = async (email) => {
  try {
    const response = await axios.post(`${API_BASE}/auth/forgot-password`, { email });
    return response.data; // { message, otpExpiry }
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Something went wrong. Please try again later.");
    }
  }
};

// ----- Verify OTP -----
export const verifyOTP = async (email, otp) => {
  try {
    const response = await axios.post(`${API_BASE}/auth/verify-otp`, {
      email,
      otp,
    });
    return response.data; // { message, otpExpiry }
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Something went wrong. Please try again later.");
    }
  }
};

// ----- Resend OTP -----
export const resendOTP = async (email) => {
  try {
    const response = await axios.post(`${API_BASE}/auth/forgot-password`, {
      email,
    });
    return response.data; // { message, otpExpiry }
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Something went wrong. Please try again later.");
    }
  }
};

// ----- Reset Password -----
export const resetPassword = async (email, newPassword) => {
  try {
    const response = await axios.post(`${API_BASE}/auth/reset-password`, {
      email,
      newPassword,
    });
    return response.data; // { message: "Password reset successful" }
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Something went wrong. Please try again later.");
    }
  }
};

