import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.SEND_EMAIL,
      pass: process.env.SEND_PASSWORD,
    },
  });
  const info = await transporter.sendMail({
    from: `"t-shop 👻" <${process.env.SEND_EMAIL}> `, // sender address
    to, //: "raghad@inflight.agency", // list of receivers
    subject, //: "confirm email ✔", // Subject line
    html, //: "<h2>confirm your email click <a href = '#'>verify email </a></h2 > " // html body
  });
  return info;
};
