const sgMail = require('@sendgrid/mail');
const config = require('./config');

sgMail.setApiKey(config.get('SENDGRID_API_KEY'));

module.exports = (subject, text) => {
  const msg = {
    to: '9111721308@mail.ru',
    from: 'info@doma-doma.kz',
    subject,
    text,
    html: text
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent');
    })
    .catch((error) => {
      console.error(error);
    });
};
