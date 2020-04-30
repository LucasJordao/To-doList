const User = require('../models/User');

// Esse controller é responsável pelo "login" do usuário
class SessionController{
  async store(req, res){

    const { email, password } = req.body;
    const user = await User.findOne({where: {email}});
// Verificando se o email existe
    if(!user){
      return res.status(400).json({error: "User does not exists!"})
    }

// Verificando a senha para dar acesso caso passe o email
    if(!await (user.checkPassword(password))){
      return res.status(401).json({error: "This password is invalid!"});
    }

    return res.json(user);
  }
}

module.exports = new SessionController();