const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
});

async function sendTo(to, otp) {
  const info = await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.MAIL_USER,
    to,
    subject: "Your otp code for changing password",
    text: `Your otp is ${otp}.It expires in 10 minutes`,
    html: `<div style="font-family:system-ui,Segoe> 
                <h2 > Inventory App </h2>
                <p> Your OTP is: </p>
                <p style="font-size:24px;font-weight:700;letter-spacing;2px">${otp}</p>
                <p>This code expires in <b>10 minutes</b>.</p>
              </div>`,
  });
  console.log("Otp email sent. Message-id: ",info.messageId)
  return info
}
module.exports={sendTo}
