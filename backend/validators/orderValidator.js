import { body, param } from "express-validator";
import MESSAGES from "../constants/messages.js";

const { VALIDATION } = MESSAGES;

export const createOrderValidator = [
    body("shippingAddress.fullName")
        .trim().notEmpty().withMessage(VALIDATION.FULL_NAME_REQUIRED),
    body("shippingAddress.email")
        .optional({ values: "falsy" })
        .isEmail().withMessage(VALIDATION.EMAIL_INVALID),
    body("shippingAddress.phone")
        .trim().matches(/^[0-9+\-\s]{10,15}$/).withMessage(VALIDATION.PHONE_INVALID),
    body("shippingAddress.addressLine1")
        .trim().notEmpty().withMessage(VALIDATION.ADDRESS_REQUIRED),
    body("shippingAddress.city")
        .trim().notEmpty().withMessage(VALIDATION.CITY_REQUIRED),
    body("shippingAddress.state")
        .trim().notEmpty().withMessage(VALIDATION.STATE_REQUIRED),
    body("shippingAddress.pincode")
        .trim().matches(/^[0-9]{4,10}$/).withMessage(VALIDATION.PINCODE_INVALID),
    body("paymentMethod")
        .isIn(["cod", "upi", "card"]).withMessage(VALIDATION.PAYMENT_METHOD_INVALID)
];

export const orderIdValidator = [
    param("id").isMongoId().withMessage(VALIDATION.ORDER_ID_INVALID)
];