import emailjs from 'emailjs-com';

export function sendEmail(mailOptions) {
  const { to, email, subject, message } = mailOptions
  let templateParams = {
    from_name: email,
    to_name: to,
    subject: subject,
    message: message,
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