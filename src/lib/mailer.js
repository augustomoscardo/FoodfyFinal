const nodemailer = require('nodemailer')


module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "a2f4a352653755",
      pass: "f0dc27a3718393"
    }
})