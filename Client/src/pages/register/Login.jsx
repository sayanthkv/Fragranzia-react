import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Login.module.css";
import loginImg from "../../assets/login.jpg";
import { User, Lock, Eye } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const [formErr, setFormErr] = useState({
    email: false,
    password: false
  });

  const onHandleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const onHandleSubmit = async (event) => {
    event.preventDefault();

    let next = true;
    let err = {
      email: false,
      password: false
    };

    if (formData.email === "") {
      next = false;
      err.email = true;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (formData.password === "" || !passwordRegex.test(formData.password)) {
      next = false;
      err.password = true;
    }

    setFormErr(err);

    if (next) {
     const res = await axios.post("http://localhost:5000/api/auth/login", formData);
     console.log(res,"=====res=====");
     
    localStorage.setItem("token", res.data.token);
    navigate("/");
    }
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    let err = false;

    if (name === "email" && formData.email === "") {
      err = true;
    } else if (
      name === "password" &&
      (formData.password === "" ||
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          formData.password
        ))
    ) {
      err = true;
    }

    setFormErr((prev) => ({
      ...prev,
      [name]: err
    }));
  };

  return (
    <main className={styles.loginPage}>
      <div className={styles.loginCard}>
        {/* Left Side: Image & Banner */}
        <section className={styles.imageSection}>
          <img src={loginImg} alt="Welcome Banner" className={styles.bgImage} />
          <div className={styles.imageOverlay}>
            <h1>Welcome Back</h1>
            <p>
              Glad to see you again! Access your
              <br />
              account to explore more.
            </p>
          </div>
        </section>

        {/* Right Side: Form */}
        <section className={styles.formSection}>
          <form className={styles.loginForm} onSubmit={onHandleSubmit}>
            <div className={styles.socialButtons}>
              <button type="button" className={styles.socialButton}>
                <FcGoogle size={20} />
                <span>Google</span>
              </button>
              <button type="button" className={styles.socialButton}>
                <FaFacebookF style={{ color: "#1877f2" }} size={18} />
                <span>Facebook</span>
              </button>
            </div>

            <div className={styles.divider}>
              <span>Or sign in with email</span>
            </div>

            {/* Username Input */}
            <div className={styles.inputGroup}>
              <User className={styles.inputIcon} size={18} />
              <input
                id="email"
                name="email"
                type="text"
                value={formData.email}
                placeholder="Enter your username"
                onChange={onHandleChange}
                onBlur={handleBlur}
              />
              {formErr.email && (
                <span className={styles.error}>Please enter your email</span>
              )}
            </div>

            {/* Password Input */}
            <div className={styles.inputGroup}>
              <Lock className={styles.inputIcon} size={18} />
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                placeholder="Enter your password"
                onChange={onHandleChange}
                onBlur={handleBlur}
              />
              <button type="button" className={styles.eyeIconBtn}>
                <Eye size={18} />
              </button>
              {formErr.password && (
                <span className={styles.error}>Please enter a valid password</span>
              )}
            </div>

            <div className={styles.forgotPassword}>
              <button type="button">Forgot Password?</button>
            </div>

            <button type="submit" className={styles.loginButton}>
              Log In
            </button>

            <p className={styles.signupText}>
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}

export default Login;