const nodemailer = require('nodemailer');
const mailConfig = require('../config/mail');
const exphbs = require('express-handlebars');
const nodemailerhbs = require('nodemailer-express-handlebars');
const { resolve } = require('path');

class Mail{
  constructor(){
    const { host, port, secure, auth } = mailConfig;
    
// Fazendo a conexão com o nodemailer
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });

    this.configureTemplates();
  }

  /**
   * @function configureTemplates - Responsável por configurar os templates de email
   */
  configureTemplates(){
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');

    this.transporter.use('compile', nodemailerhbs({
      viewEngine: exphbs.create({
        layoutsDir: resolve(viewPath, 'layouts'),
        partialsDir: resolve(viewPath, 'partials'),
        defaultLayout: 'default',
        extname: '.hbs',
      }),
      viewPath,
      extName: '.hbs',
    }));
  }

// Método responsável por enviar o email
  sendMail(message){
    return this.transporter.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }

  
}

module.exports = new Mail();