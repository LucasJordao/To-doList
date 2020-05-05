const User = require('../models/User');
const File = require('../models/File');
const jwt = require('jsonwebtoken');
const authToken = require('../../config/authToken');
const yup = require('yup');

// Esse controller é responsável pelo "login" do usuário
class SessionController{
  async store(req, res){

// Validando dados com yup
    const schema = yup.object().shape({
      email: yup.string().email().required(),
      password: yup.string().required(),
    });

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({error: "Validations failed"});
    }


// Verificando se o email existe
    const { email, password } = req.body;
    const user = await User.findOne({
      where: {
        email, valid: true
      },
      include: [
        {
          model: File,
          as: "avatar",
          attributes: ['id', 'path', 'url', 'name'],
        },
      ]
    });

    if(!user){
      return res.status(400).json({error: "User does not exists!"})
    }

// Verificando a senha para dar acesso caso passe o email
    if(!await (user.checkPassword(password))){
      return res.status(401).json({error: "This password is invalid!"});
    }

    const { name, id, avatar } = user; 

    return res.json({
      name,
      id,
      url: avatar.url,
// Esse será o token para acesso de algumas rotas específicas
      token: jwt.sign({id}, authToken.secret, {
        expiresIn: authToken.expiresIn,
      })
    });
  }
}

module.exports = new SessionController();