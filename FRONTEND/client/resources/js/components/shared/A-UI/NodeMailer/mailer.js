import emailjs from 'emailjs-com';

export function sendEmail(mailOptions) {
  const { subject, employeeName, message, userEmail } = mailOptions
  let templateParams = {
    subject: subject,
    to_name: employeeName,
    message: message,
    to_email: userEmail,
    reply_to: "shabarish.shabbi@gmail.com",
  }

  emailjs.send(
    'service_z8svvpd',
    'template_e37ulal',
    templateParams,
    'user_BQa6pp6IQcfB51QbJd6MA'
  )
    .then((result) => {
      console.log(result.text);
    }, (error) => {
      console.log(`err: `, error.text);
    });
}
