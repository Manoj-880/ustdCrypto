import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, Modal } from "antd";
import { makePayment } from "../../api_calls/payments";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const PaymentConformation = () => {
    const [form] = Form.useForm();
    const [modal, setModal] = useState({ visible: false, success: false });
    const navigate = useNavigate();

    const onFinish = async (values) => {
        let user = JSON.parse(localStorage.getItem("user"));
        let data = { ...values, userId: user._id };
        console.log("Payment Confirmation:", data);

        let response = await makePayment(data);

        if (response.success) {
        setModal({ visible: true, success: true });
        } else {
        setModal({ visible: true, success: false });
        }
    };

    return (
        <div className="payment-confirmation-container">
        <Card className="payment-confirmation-card" bordered={false}>
            <Title level={3} className="title">
            Payment Confirmation
            </Title>

            <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="payment-form"
            >
            {/* Amount */}
            <Form.Item
                label="Amount (USDT)"
                name="amount"
                rules={[{ required: true, message: "Please enter amount" }]}
            >
                <Input placeholder="Enter amount" type="number" />
            </Form.Item>

            {/* Transaction ID */}
            <Form.Item
                label="Transaction ID"
                name="txId"
                rules={[{ required: true, message: "Please enter transaction ID" }]}
            >
                <Input placeholder="Enter transaction ID" />
            </Form.Item>

            {/* Wallet ID */}
            <Form.Item
                label="Wallet ID"
                name="userWalletId"
                rules={[{ required: true, message: "Please enter your wallet ID" }]}
            >
                <Input placeholder="Enter your wallet ID" />
            </Form.Item>

            {/* Submit */}
            <Form.Item>
                <Button type="primary" htmlType="submit" className="confirm-btn" block>
                Confirm Payment
                </Button>
            </Form.Item>
            </Form>
        </Card>

        {/* Modal */}
        <Modal
            title={modal.success ? "Payment Successful 🎉" : "Payment Failed ❌"}
            open={modal.visible}
            onCancel={() => (!modal.success ? setModal({ visible: false }) : null)} // disable close if success
            footer={
            modal.success ? (
                <Button
                type="primary"
                onClick={() => {
                    setModal({ visible: false });
                    navigate("/");
                }}
                >
                Go to Home
                </Button>
            ) : (
                <Button onClick={() => setModal({ visible: false })}>Close</Button>
            )
            }
            closable={!modal.success} // disable close icon in success case
            maskClosable={!modal.success ? true : false} // clicking outside should not close if success
        >
            {modal.success
            ? "Your payment has been confirmed successfully."
            : "Payment failed. Please check your transaction ID or try again."}
        </Modal>
        </div>
    );
};

export default PaymentConformation;