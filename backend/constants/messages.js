const MESSAGES = {
    COMMON: {
        API_RUNNING: "TORQUE RC API IS RUNNING",
        INTERNAL_ERROR: "Internal server error",
        VALIDATION_FAILED: "Validation failed",
        INVALID_ID: "Invalid ID",
        ROUTE_NOT_FOUND: (url) => `Route not found: ${url}`,
    },

    VALIDATION: {
        NAME_MIN: "Name must contain at least 2 characters",
        EMAIL_INVALID: "Enter a valid email address",
        PASSWORD_MIN: "Password must be at least 6 characters",
        PASSWORD_REQUIRED: "Password is required",

        PRODUCT_ID_REQUIRED: "Product id is required",
        PRODUCT_ID_INVALID: "Invalid product id",
        ORDER_ID_INVALID: "Invalid order id",
        QUANTITY_REQUIRED: "Quantity is required",
        QUANTITY_INVALID: "Quantity must be a whole number of 1 or more",

        DESCRIPTION_REQUIRED: "Description is required",
        PRICE_MIN: "Price must be at least 1",
        CATEGORY_REQUIRED: "Category is required",
        BRAND_REQUIRED: "Brand is required",
        IMAGES_REQUIRED: "At least one image is required",
        STOCK_INVALID: "Stock must be a non-negative integer",
        SPECS_INVALID: "Specs must be an object",
        GRADE_REQUIRED: "Grade is required",

        FULL_NAME_REQUIRED: "Full name is required",
        PHONE_INVALID: "Enter a valid phone number",
        ADDRESS_REQUIRED: "Address is required",
        CITY_REQUIRED: "City is required",
        STATE_REQUIRED: "State is required",
        PINCODE_INVALID: "Enter a valid pincode",
        PAYMENT_METHOD_INVALID: "Payment method must be cod, upi or card",

        OTP_FORMAT: "Enter the 6-digit code",

        PAYMENT_FIELDS_REQUIRED: "Payment details are required",

        STATUS_INVALID: "Status must be active, trash or all",
        PAGE_INVALID: "Page must be a whole number of 1 or more",
        LIMIT_INVALID: "Limit must be between 1 and 100",

        USER_ID_INVALID: "Invalid user id",
        USER_STATUS_INVALID: "Status must be all, active or blocked",
        USER_ROLE_INVALID: "Role must be all, user or admin",
        BLOCK_FLAG_INVALID: "isBlocked must be true or false",

        ORDER_STATUS_INVALID: "Invalid order status",
        PAYMENT_STATUS_INVALID: "Invalid payment status",
        SEARCH_TOO_LONG: "Search text is too long",
        SORT_INVALID: "Invalid sort option",

        CATEGORY_INVALID: "Invalid category",
        GRADE_INVALID: "Invalid grade",
        PRICE_FILTER_INVALID: "Prices must be numbers of 0 or more",
        PRICE_RANGE_INVALID: "Maximum price cannot be less than minimum price",
    },

    AUTH: {
        REGISTER_SUCCESS: "Registration successful",
        EMAIL_EXISTS: "Email already registered",
        INVALID_CREDENTIALS: "Invalid email or password",
        LOGIN_SUCCESS: "Login successful",
        LOGOUT_SUCCESS: "Logged out successfully",
        TOKEN_REFRESHED: "Token refreshed",
        ACCOUNT_BLOCKED: "Your account has been blocked",
        ACCOUNT_DEACTIVATED: "Your account is deactivated",
        NOT_AUTHORIZED: "Not authorized, please login",
        TOKEN_INVALID: "Not authorized, invalid or expired token",
        USER_NOT_FOUND: "Not authorized, user no longer exists",
        SESSION_EXPIRED: "Session expired, please login again",
        ADMIN_ONLY: "Admin access only",

        OTP_SENT: "Verification code sent to your email",
        OTP_SEND_FAILED: "Could not send the verification email. Please try again",
        OTP_INVALID: "Invalid verification code",
        OTP_EXPIRED: "Verification code expired. Please request a new one",
        OTP_TOO_MANY_ATTEMPTS: "Too many wrong attempts. Please request a new code",
        OTP_NOT_PENDING: "No pending verification for this email",
        EMAIL_VERIFIED: "Email verified successfully. You can now log in",
        OTP_RESEND_WAIT: (seconds) => `Please wait ${seconds}s before requesting another code`,
        EMAIL_NOT_VERIFIED: "Please verify your email before logging in",
    },

    PRODUCT: {
        LIST_FETCHED: "Products fetched successfully",
        FETCHED: "Product fetched successfully",
        CATEGORIES_FETCHED: "Categories fetched successfully",
        CREATED: "Product created successfully",
        UPDATED: "Product updated successfully",
        DELETED: "Product deleted successfully",
        NOT_FOUND: "Product not found",
        NOT_AVAILABLE: "Product not found or unavailable",
        DUPLICATE: "Product already exists in this category",

        ADMIN_LIST_FETCHED: "Admin products fetched successfully",
        RESTORED: "Product restored successfully",
        PERMANENTLY_DELETED: "Product permanently deleted",
        TRASH_NOT_FOUND: "Product not found in trash",
    },

    CART: {
        FETCHED: "Cart fetched successfully",
        ITEM_ADDED: "Product added to cart",
        UPDATED: "Cart updated successfully",
        ITEM_REMOVED: "Item removed from cart",
        CLEARED: "Cart cleared successfully",
        ITEM_NOT_FOUND: "Item not found in cart",
    },

    WISHLIST: {
        FETCHED: "Wishlist fetched successfully",
        ADDED: "Product added to wishlist",
        REMOVED: "Product removed from wishlist",
        NOT_IN_WISHLIST: "Product not found in wishlist",
    },

    ORDER: {
        PLACED: "Order placed successfully",
        LIST_FETCHED: "Orders fetched successfully",
        FETCHED: "Order fetched successfully",
        NOT_FOUND: "Order not found",
        CART_EMPTY: "Your cart is empty",
        PRODUCT_UNAVAILABLE: (name) =>
            `${name || "A product in your cart"} is no longer available. Please remove it and try again`,
        INSUFFICIENT_STOCK: (stock, name) => `Only ${stock} of ${name} available`,
        USE_ONLINE_PAYMENT: "Please use the online payment option for UPI",

        STATUS_UPDATED: "Order status updated successfully",
        INVALID_TRANSITION: (from, to) => `An order that is ${from} cannot be changed to ${to}`,
        PAYMENT_NOT_COMPLETED: "Online payment must be completed before this order can move forward",
        STATUS_CHANGED: "This order was just changed by someone else. Refresh and try again",
    },

    PAYMENT: {
        ORDER_CREATED: "Payment order created",
        VERIFIED: "Payment verified successfully",
        VERIFY_FAILED: "Payment verification failed",
        FAILED_RECORDED: "Payment failure recorded",
        ALREADY_PAID: "This order is already paid",
        ORDER_CANCELLED: "This order was cancelled",
    },
    USERS: {
        LIST_FETCHED: "Users fetched successfully",
        BLOCKED: "User blocked successfully",
        UNBLOCKED: "User unblocked successfully",
        NOT_FOUND: "User not found",
        CANNOT_BLOCK_SELF: "You cannot block your own account",
        CANNOT_BLOCK_ADMIN: "Admin accounts cannot be blocked",
    },
    STATS: {
        FETCHED: "Dashboard stats fetched successfully",
    },
};

export default MESSAGES;