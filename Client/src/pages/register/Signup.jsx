import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Signup.module.css";
import signupImg from "../../assets/signup.jpg";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import UserService from "../../services/user-api-services/UserService";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
    terms: false,
  });

  const [formErr, setFormErr] = useState({
    name: false,
    email: false,
    password: false,
    confirmpassword: false,
    terms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const navigate = useNavigate();
  const { regUser, googleAuthUser } = UserService();

  const onhandlechange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (serverError) setServerError("");
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await googleAuthUser(credentialResponse.credential);
      if (res?.token) {
        localStorage.setItem("Token", res.token);
        localStorage.setItem("role", res.role);

        if (res.role && res.role.toLowerCase() === "admin") {
          navigate("/AdminCategory", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }
    } catch (error) {
      if (error.response?.status === 403) {
        setServerError(
          error.response?.data?.message ||
            "Your account is blocked by admin, please contact support."
        );
      } else {
        setServerError("Google Sign-up failed. Please try again.");
      }
    }
  };

  const onhandlesubmit = async (event) => {
    event.preventDefault();
    setServerError("");

    let next = true;
    let err = {
      name: false,
      email: false,
      password: false,
      confirmpassword: false,
      terms: false,
    };

    if (formData.name.trim() === "") {
      next = false;
      err.name = true;
    }

    if (
      formData.email === "" ||
      !formData.email.includes("@") ||
      !formData.email.includes(".")
    ) {
      next = false;
      err.email = true;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (formData.password === "" || !passwordRegex.test(formData.password)) {
      next = false;
      err.password = true;
    }

    if (
      formData.confirmpassword === "" ||
      formData.password !== formData.confirmpassword
    ) {
      next = false;
      err.confirmpassword = true;
    }

    if (!formData.terms) {
      next = false;
      err.terms = true;
    }

    setFormErr(err);

    if (next) {
      try {
        await regUser(formData);
        alert("Registered Successfully");
        navigate("/LogIn");
      } catch (error) {
        setServerError(
          error.response?.data?.message || "Registration failed. Try again."
        );
      }
    }
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    let err = false;

    if (name === "name" && formData.name.trim() === "") {
      err = true;
    } else if (
      name === "email" &&
      (formData.email.trim() === "" ||
        !formData.email.includes("@") ||
        !formData.email.includes("."))
    ) {
      err = true;
    } else if (name === "password" && formData.password === "") {
      err = true;
    } else if (
      name === "confirmpassword" &&
      (formData.confirmpassword === "" ||
        formData.password !== formData.confirmpassword)
    ) {
      err = true;
    }

    setFormErr((prev) => ({
      ...prev,
      [name]: err,
    }));
  };

  return (
    <main className={styles.signupPage}>
      <div className={styles.signupCard}>
        {/* Left Side: Image & Banner */}
        <section className={styles.imageSection}>
          <img src={signupImg} alt="Signup Banner" className={styles.bgImage} />
          <div className={styles.imageOverlay}>
            <h1>Let's Get Started!</h1>
            <p>
              Create your account and unlock the
              <br />
              full potential of Fragranzia.
            </p>
          </div>
        </section>

        {/* Right Side: Form */}
        <section className={styles.formSection}>
          <form className={styles.signupForm} onSubmit={onhandlesubmit}>
            {/* Google Sign-up */}
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() =>
                  setServerError("Google Sign-Up was unsuccessful")
                }
                useOneTap
                width="350"
                text="signup_with"
                shape="rectangular"
                theme="outline"
              />
            </div>

            <div className={styles.divider}>
              <span>Or sign up with email</span>
            </div>

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
                  textAlign: "center",
                }}
              >
                {serverError}
              </div>
            )}

            {/* Username Field */}
            <div className={styles.inputGroup}>
              <User className={styles.inputIcon} size={18} />
              <input
                id="username"
                name="name"
                type="text"
                value={formData.name}
                placeholder="Enter your username"
                onChange={onhandlechange}
                onBlur={handleBlur}
              />
              {formErr.name && (
                <span className={styles.error}>Please enter your name</span>
              )}
            </div>

            {/* Email Field */}
            <div className={styles.inputGroup}>
              <Mail className={styles.inputIcon} size={18} />
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                placeholder="Enter your E - Mail"
                onChange={onhandlechange}
                onBlur={handleBlur}
              />
              {formErr.email && (
                <span className={styles.error}>Please enter correct email</span>
              )}
            </div>

            {/* Password Field */}
            <div className={styles.inputGroup}>
              <Lock className={styles.inputIcon} size={18} />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                placeholder="Enter your password"
                onChange={onhandlechange}
                onBlur={handleBlur}
              />
              <button
                type="button"
                className={styles.eyeIconBtn}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {formErr.password && (
                <span className={styles.error}>
                  Password must contain at least 8 characters, one uppercase
                  letter, one lowercase letter, one number, and one special
                  character.
                </span>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className={styles.inputGroup}>
              <Lock className={styles.inputIcon} size={18} />
              <input
                id="confirmPassword"
                name="confirmpassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmpassword}
                placeholder="Confirm your password"
                onChange={onhandlechange}
                onBlur={handleBlur}
              />
              <button
                type="button"
                className={styles.eyeIconBtn}
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {formErr.confirmpassword && (
                <span className={styles.error}>Password doesn't match</span>
              )}
            </div>

            {/* Terms & Conditions Field */}
            <div className={styles.termsCheckbox}>
              <input
                type="checkbox"
                id="terms"
                name="terms"
                checked={formData.terms}
                onChange={onhandlechange}
              />
              <label htmlFor="terms">
                Agree with <a href="#terms">Terms & Conditions</a>
              </label>
            </div>
            {formErr.terms && (
              <span className={styles.error}>
                Accept our terms and conditions
              </span>
            )}

            <button type="submit" className={styles.signupButton}>
              Sign Up
            </button>

            <p className={styles.loginText}>
              Already have an account? <Link to="/LogIn">Sign In</Link>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}

export default Signup;