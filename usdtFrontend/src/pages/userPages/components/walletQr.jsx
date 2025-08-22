import { QRCode, Input, Button } from "antd";
import React, { useState } from "react";
import { FaCopy, FaCheck } from "react-icons/fa6";
import { makePayment } from "../../../api_calls/payments";

const PaymentQr = ({ onCancel }) => {
    const walletId = "TWjGg1Ssi17T6yRi87iVp6oLDXLYzoTjv3";
    const [copied, setCopied] = useState(false);
    const [showVerify, setShowVerify] = useState(false);
    const [txId, setTxId] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleCopy = () => {
        navigator.clipboard.writeText(walletId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleVerifyClick = () => {
        setShowVerify(true);
    };

    const handleVerifyPayment = async () => {
        if (!txId) {
        setMessage("⚠️ Please enter a transaction ID");
        return;
        }

        try {
        setLoading(true);
        setMessage("");

        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?._id;

        const data = await makePayment({
            txId,
            userId,
        });

        if (data.success) {
            setMessage("✅ Payment verified successfully!");
            setTxId("");
            onCancel();
        } else {
            setMessage("❌ " + data.message);
        }
        } catch (error) {
        console.error(error);
        setMessage("❌ Failed to verify payment");
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="payment-qr">
        {/* QR Code */}
        <div className="qr-wrapper">
            <QRCode value={walletId} color="#1E2A47" size={200} bordered />
        </div>

        {/* Wallet ID with copy */}
        <div className="wallet-id-box" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <p className="wallet-id">{walletId}</p>
            <Button
            type="default"
            icon={copied ? <FaCheck /> : <FaCopy />}
            onClick={handleCopy}
            size="small"
            />
        </div>
        {copied && <p className="copy-success">Wallet ID copied!</p>}

        {/* ⚠️ Important Notice */}
        <div className="payment-notice">
            <p>
            ⚠️ Please verify your payment within <strong>10 minutes</strong> to
            ensure funds are added to your wallet.
            </p>
        </div>

        {/* Verify Payment Section */}
        {!showVerify ? (
            <Button
            type="primary"
            block
            className="payment-complete-btn"
            onClick={handleVerifyClick}
            >
            Verify My Payment
            </Button>
        ) : (
            <div className="verify-section" style={{ marginTop: 16 }}>
            <Input
                placeholder="Enter Transaction ID"
                value={txId}
                onChange={(e) => setTxId(e.target.value)}
            />
            <Button
                type="primary"
                block
                style={{ marginTop: 8 }}
                onClick={handleVerifyPayment}
                loading={loading}
            >
                Verify
            </Button>
            {message && (
                <p className="verify-message" style={{ marginTop: 8 }}>
                {message}
                </p>
            )}
            </div>
        )}
        </div>
    );
};

export default PaymentQr;