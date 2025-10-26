// SlidingAuth.jsx
import React, { useEffect, useState } from "react";
import "./SlidingAuth.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SlidingAuth = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    address: "",
    phone: "",
    role:"user"
  });

  useEffect(() => {
    const signUpButton = document.getElementById("signUp");
    const signInButton = document.getElementById("signIn");
    const container = document.getElementById("container");

    signUpButton?.addEventListener("click", () => {
      container.classList.add("right-panel-active");
    });

    signInButton?.addEventListener("click", () => {
      container.classList.remove("right-panel-active");
    });
  }, []);

  // LOGIN logic
  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    const { email, password } = formData;
    if (!email || !password) {
     toast.warn("⚠️ Please fill all fields");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error("❌ Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      toast.error("❌ Password must be at least 6 characters long.");
      return;
    }

    try {
      // send email + password only; backend checks role
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const response = await res.json();
      console.log(response)

      if (res.ok) {
        // store token + user in localStorage
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        toast.success("✅ Login successful");

        // ROLE-BASED REDIRECT
        const role = response.user.role;
        if (role === "user") navigate("/home");
        else if (role === "field-officer") navigate("/field-officer/dashboard");
        else if (role === "supervisor") navigate("/supervisor/dashboard");

      } else {
        toast.error(response.message || "❌ Login failed");
      }
    } catch (error) {
      console.error("Error occurred during login:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  // REGISTER logic
  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    const { email, password, name, address, phone } = formData;
    if (!email || !password || !name || !address || !phone) {
      toast.warn("⚠️ Please fill all fields");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error("❌ Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      toast.error("❌ Password must be at least 6 characters long.");
      return;
    }

    try {
      // force all new registrations to role 'user'
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password,
          address,
          mobileNo: phone,
          role: "user"
        })
      });

      const response = await res.json();

      if (res.ok) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        toast.success("🎉 Registration successful!");
        navigate("/home"); // normal users go to /home
      } else {
        toast.error(response.message || "❌ Registration failed");
      }
    } catch (error) {
      console.error("Error occurred during registration:", error);
      toast.error("❌ An error occurred. Please try again later.");
      // alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="auth-page">
      <div className="container" id="container">
        <div className="form-container sign-up-container">
          <form onSubmit={handleRegisterSubmit}>
            <h1>Create Account</h1>
            <div className="social-container">
              <a href="/login" className="social" title="Sign up with Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="/login" className="social" title="Sign up with Google">
                <i className="fab fa-google"></i>
              </a>
              <a href="/login" className="social" title="Sign up with LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
            <span>or use your email for registration</span>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Name"
              name="name"
              required
              id="signin-name"
            />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Email"
              name="email"
              required
              id="signin-email"
            />
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Password"
              name="password"
              required
              id="signin-password"
            />
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Address"
              name="address"
              required
              id="signin-address"
            />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Phone Number"
              name="phone"
              required
              id="signin-phone"
            />
            <button type="submit">Sign Up</button>
          </form>
        </div>

        <div className="form-container sign-in-container">
          <form onSubmit={handleLoginSubmit}>
            <h1>Sign In</h1>
            <div className="social-container">
              <a href="/login" className="social" title="Sign in with Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="/login" className="social" title="Sign in with Google">
                <i className="fab fa-google"></i>
              </a>
              <a href="/login" className="social" title="Sign in with LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
            <span>or use your account</span>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Email"
              name="email"
              required
              id="login-email"
            />
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Password"
              name="password"
              required
              id="login-password"
            />
            <a href="/forgot-password" className="forgot-password">
              Forgot your password?
            </a>
            <button type="submit">Sign In</button>
          </form>
        </div>

        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>
                To keep connected with us please login with your personal info
              </p>
              <button className="ghost" id="signIn">
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start your journey with us</p>
              <button className="ghost" id="signUp">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlidingAuth;
