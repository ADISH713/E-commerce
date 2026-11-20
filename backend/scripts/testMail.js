import "dotenv/config";
import sendEmail from "../utils/sendEmail.js";

const info = await sendEmail({
    to: "adishadi7559@gmail.com",
    subject: "Test from Torque RC",
    text: "If you can read this, Nodemailer works."
});

console.log("Sent:", info.messageId);