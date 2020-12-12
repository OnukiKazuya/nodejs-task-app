const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeMail = (email, name)=>{
  sgMail.send({
    to : email,
    from : "ohnuki.kazuya@gmail.com",
    subject:"Thanks for joining in!",
    text:`This is Welcome to the app, ${name}, Let me know how you get along with the app!`
  })
}

const sendGoodbyeMail = (email, name)=>{
  sgMail.send({
    to:email,
    from:"ohnuki.kazuya@gmail.com",
    subject:"Suuccessfully cancelled app!!",
    text:`You successfully delete ${name}'s account. so, Why do you delete account :)`
  })
}

module.exports = {
  sendWelcomeMail,
  sendGoodbyeMail
}
