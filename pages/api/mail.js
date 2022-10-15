const mailgun = require('mailgun-js');

export default function handler(req, res) {
  const email = req.query.email;
  const text = req.query.text;
  try {
    const mg = mailgun({
      apiKey: process.env.MAILGUN_API,
      domain: process.env.MAILGUN_DOMAIN,
    });
    const data = {
      from: 'slng7oo36@gmail.com',
      to: 'admin@peculiarpugs.io',
      subject: 'New delivery form submission',
      html: `<div>
        <p>new delivery form submission with the following details :-</p> 
        ${text}</div>`,
    };
    mg.messages().send(data, function (error, body) {
      console.log(body);
      console.log(error);
      if (body) {
        res.status(200).json({ success: true });
      }
    });
  } catch (error) {
    console.log(error);
  }
}
