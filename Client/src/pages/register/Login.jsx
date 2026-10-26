import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import loginImg from "../../assets/login.jpg";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import UserService from "../../services/user-api-services/UserService";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const navigate = useNavigate();
  const { logUser } = UserService();

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
    if (serverError) setServerError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onHandleSubmit = async (event) => {
    event.preventDefault();
    setServerError("");

    let next = true;
    let err = {
      email: false,
      password: false
    };

    if (formData.email.trim() === "") {
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
      try {
        const res = await logUser(formData);

        if (res?.token) {
          localStorage.setItem("Token", res.token);
          navigate("/");
        }
      } catch (error) {
        console.error("Login API Error:", error.response?.data || error.message);

        // Capture blocked status (403 Forbidden)
        if (error.response?.status === 403) {
          setServerError(
            error.response?.data?.message ||
              "Your account is blocked by admin, please contact admin."
          );
        } else {
          setServerError(
            error.response?.data?.message ||
              "Invalid email or password. Please try again."
          );
        }
      }
    }
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    let err = false;

    if (name === "email" && formData.email.trim() === "") {
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

            {/* Server Block / Error Alert Banner */}
            {serverError && (
              <div
                style={{
                  color: "#721c24",
                  backgroundColor: "#f8d7da",
                  borderColor: "#f5c6cb",
                  padding: "10px 14px",
                  borderRadius: "6px",
                  marginBottom: "16px",
                  fontSize: "14px",
                  fontWeight: "500",
                  textAlign: "center"
                }}
              >
                {serverError}
              </div>
            )}

            {/* Email Input */}
            <div className={styles.inputGroup}>
              <User className={styles.inputIcon} size={18} />
              <input
                id="email"
                name="email"
                type="text"
                value={formData.email}
                placeholder="Enter your email"
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
                type={showPassword ? "text" : "password"}
                value={formData.password}
                placeholder="Enter your password"
                onChange={onHandleChange}
                onBlur={handleBlur}
              />
              <button
                type="button"
                className={styles.eyeIconBtn}
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {formErr.password && (
                <span className={styles.error}>
                  Please enter a valid password
                </span>
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