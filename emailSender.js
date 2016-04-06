var app = require('./app.js');

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var transporter = nodemailer.createTransport(smtpTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: 'minimalnode@gmail.com',
        pass: 'iw12345678'
    }
}));

//for aws SES $
// var transporter = nodemailer.createTransport(smtpTransport({
//     host: 'email-smtp.eu-west-1.amazonaws.com',
//     port: 25,
//     auth: {
//         user: 'AKIAJXX7LZFALRH7QNTQ',
//         pass: 'AvCbeOCmGrfW2oX0n0UAxE8B7hzAH4/6bNV9qMnfJgXP'
//     }
// }));

exports.sendMail = function(options) {
  //Example options:
  // var mailOptions = {
  //     from: '"Minimal Node WebApp" <minimalnode@gmail.com>', // sender address
  //     to: 'jgibler@gmail.com', // list of receivers
  //     subject: 'Hello World', // Subject line
  //     text: 'Hello world 🐴', // plaintext body
  //     html: '<b>Hello world 🐴</b>' // html body
  // };

  console.log('sending e-mail');
  transporter.sendMail(options, function(error, info){
      if(error){
          return console.log(error);
      }
      console.log('E-mail sent: ' + JSON.stringify(options) + info.response);
  });
};
