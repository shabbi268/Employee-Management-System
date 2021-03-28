const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'shabarish.shabbi@gmail.com',
    pass: 'ibvoynqhybysqbox'
  }
});

export async function sendEmail(mailOptions) {
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(`Error Occurred while Sending Email: `, error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
