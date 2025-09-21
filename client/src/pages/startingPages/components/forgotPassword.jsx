// src/components/ForgotPassword.js
import React, { useState } from "react";
import { Input, Button } from "antd";
import { toast } from "react-toastify";
import "../../../styles/components/forgotPassword.css";

const ForgotPassword = ({ onClose }) => {
    const [email, setEmail] = useState("");

    const handleSendOtp = () => {
        if (!email) {
        toast.error("Please enter your email!", { position: "top-right" });
        return;
        } else {
            toast.success(`OTP sent to your email ${email}`, { position: "top-right" });
            setEmail("");
            onClose(); // close modal after sending
        }
    };

    return (
        <div className="forgot-password-form">
        <h3 className="forgot-title">Reset Password</h3>
        <p className="forgot-subtitle">Enter your registered email to receive OTP</p>

        <Input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="large"
            className="input-field"
        />

        <div className="modal-actions">
            <Button
                onClick={onClose}
                className="cancel-btn"
                block
            >
                Cancel
            </Button>
            <Button
                type="primary"
                onClick={handleSendOtp}
                className="login-btn"
                block
            >
                Send OTP
            </Button>
        </div>
        </div>
    );
};

export default ForgotPassword;