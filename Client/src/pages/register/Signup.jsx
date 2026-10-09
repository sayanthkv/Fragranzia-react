import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Signup.module.css";
import signupImg from "../../assets/signup.jpg";
import { User, Mail, Lock, Eye } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import axios from "axios"

function Signup() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmpassword: "",
        terms: false
    });

    const [formErr, setFormErr] = useState({
        name: false,
        email: false,
        password: false,
        confirmpassword: false,
        terms: false
    });

    const onhandlechange = (event) => {
        const { name, value, type, checked } = event.target;

       
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const onhandlesubmit = async (event) => {
        event.preventDefault();

        let next = true;
        let err = {
            name: false,
            email: false,
            password: false,
            confirmpassword: false,
            terms: false
        };

        if (formData.name=== "") {
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

        // Checkbox boolean validation
        if (!formData.terms) {
            next = false;
            err.terms = true;
        }

        setFormErr(err);

        if (next) {
            await axios.post("http://localhost:5000/api/auth/register", formData);
            alert("Registered Successfully");
        }


    };

    const handleBlur = (event) => {
        const { name } = event.target;
        let err = false;

        if (name === "name" && formData.name.trim() === "") {
            err = true;
        } else if (name === "email" && (formData.email.trim() === "" || !formData.email.includes("@") || !formData.email.includes("."))) {
            err = true;
        } else if (name === "password" && formData.password === "") {
            err = true;
        } else if (name === "confirmpassword" && (formData.confirmpassword === "" || formData.password !== formData.confirmpassword)) {
            err = true;
        }

        setFormErr((prev) => ({
            ...prev,
            [name]: err
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
                            <span>Or sign up with email</span>
                        </div>

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
                                type="password"
                                value={formData.password}
                                placeholder="Enter your password"
                                onChange={onhandlechange}
                                onBlur={handleBlur}
                            />
                            <button type="button" className={styles.eyeIconBtn}>
                                <Eye size={18} />
                            </button>
                            {formErr.password && (
                                <span className={styles.error}>
                                    Password must contain at least 8 characters, one uppercase letter,
                                    one lowercase letter, one number, and one special character.
                                </span>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className={styles.inputGroup}>
                            <Lock className={styles.inputIcon} size={18} />
                            <input
                                id="confirmPassword"
                                name="confirmpassword"
                                type="password"
                                value={formData.confirmpassword}
                                placeholder="Confirm your password"
                                onChange={onhandlechange}
                                onBlur={handleBlur}
                            />
                            <button type="button" className={styles.eyeIconBtn}>
                                <Eye size={18} />
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
                            <span className={styles.error}>Accept our terms and conditions</span>
                        )}

                        <button type="submit" className={styles.signupButton}>
                            Sign Up
                        </button>

                        <p className={styles.loginText}>
                            Already have an account? <Link to="/login">Sign In</Link>
                        </p>
                    </form>
                </section>
            </div>
        </main>
    );
}

export default Signup;