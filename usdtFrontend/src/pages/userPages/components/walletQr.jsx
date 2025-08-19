import { QRCode } from "antd";
import React, { useState } from "react";
import { FaCopy, FaCheck } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const PaymentQr = () => {
    const walletId = "TWjGg1Ssi17T6yRi87iVp6oLDXLYzoTjv3";
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();

    const handleCopy = () => {
        navigator.clipboard.writeText(walletId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handlePaymentComplete = () => {
        navigate("/payment-conformation");
    };

    return (
        <div className="payment-qr">
        {/* QR Code */}
        <div className="qr-wrapper">
            <QRCode value={walletId} color="#1E2A47" size={200} bordered />
        </div>

        {/* Wallet ID with copy */}
        <div className="wallet-id-box">
            <p className="wallet-id">{walletId}</p>
            <button className="copy-btn" onClick={handleCopy}>
            {copied ? <FaCheck className="copied-icon" /> : <FaCopy />}
            </button>
        </div>

        {copied && <p className="copy-success">Wallet ID copied!</p>}

        {/* ⚠️ Important Notice */}
        <div className="payment-notice">
            <p>
            ⚠️ Please verify your payment within <strong>10 minutes</strong> to
            ensure funds are added to your wallet.
            </p>
        </div>

        {/* ✅ Payment Complete Button */}
        <button className="payment-complete-btn" onClick={handlePaymentComplete}>
            Verify My Payment
        </button>
        </div>
    );
};

export default PaymentQr;