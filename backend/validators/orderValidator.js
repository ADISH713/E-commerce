import { body, param } from "express-validator";

export const createOrderValidator = [
    body("shippingAddress.fullName")
        .trim().notEmpty().withMessage("Full name is required"),
    body("shippingAddress.email")
        .optional({ values: "falsy" })
        .isEmail().withMessage("Enter a valid email address"),
    body("shippingAddress.phone")
        .trim().matches(/^[0-9+\-\s]{10,15}$/).withMessage("Enter a valid phone number"),
    body("shippingAddress.addressLine1")
        .trim().notEmpty().withMessage("Address is required"),
    body("shippingAddress.city")
        .trim().notEmpty().withMessage("City is required"),
    body("shippingAddress.state")
        .trim().notEmpty().withMessage("State is required"),
    body("shippingAddress.pincode")
        .trim().matches(/^[0-9]{4,10}$/).withMessage("Enter a valid pincode"),
    body("paymentMethod")
        .isIn(["cod", "upi", "card"]).withMessage("Payment method must be cod, upi or card")
];

export const orderIdValidator = [
    param("id").isMongoId().withMessage("Invalid order id")
];