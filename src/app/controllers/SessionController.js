const User = require('../models/User');
const jwt = require('jsonwebtoken');
const authToken = require('../../config/authToken');

// Esse controller é responsável pelo "login" do usuário
class SessionController{
  async store(req, res){

    const { email, password } = req.body;
    const user = await User.findOne({where: {email, valid: true}});

// Verificando se o email existe
    if(!user){
      return res.status(400).json({error: "User does not exists!"})
    }

// Verificando a senha para dar acesso caso passe o email
    if(!await (user.checkPassword(password))){
      return res.status(401).json({error: "This password is invalid!"});
    }

    const { name, id } = user; 

    return res.json({
      name,
      id,
// Esse será o token para acesso de algumas rotas específicas
      token: jwt.sign({id}, authToken.secret, {
        expiresIn: authToken.expiresIn,
      })
    });
  }
}

module.exports = new SessionController();