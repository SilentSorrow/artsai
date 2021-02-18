import mailgun from 'mailgun-js';

export default (email: string, code: number): void => {
  const mailgunParams = {
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  };
  const client = mailgun(mailgunParams as mailgun.ConstructorParams);

  const message = {
    from: `Artsai mailgunforproject@gmail.com`, // :)
    to: email,
    subject: `Verify your account`,
    text: String(code),
  };

  try {
    client.messages().send(message as mailgun.messages.SendData);
    console.log(message);
  } catch (err) {
    console.log(err);
  }
};
