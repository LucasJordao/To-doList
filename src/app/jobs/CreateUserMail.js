const Mail = require('../../lib/Mail');
const { resolve } = require('path');

class CreateUserMail{
  get key(){
    return 'CreateUserMail';
  }

  async handle({data}){

    const {user} = data;

    await Mail.sendMail({
      to: `${user.name} <${user.email}>`,
      subject: "Catrix - Bem vindo à equipe",
      template: 'createuser',
      context: {
        user: user.name,
        email: user.email,
        password: user.password,
      },
      attachments: {
        filename: 'CatrixIcon.png',
        path: resolve(__dirname, '..', 'views', 'emails', 'img','CatrixIcon.png'),
        cid: 'icon',
      }
    });
  }
}

module.exports = new CreateUserMail();