const User = require('../models/User');

class UserController{

// Store - método responsável por criar novos Usuários (Provider ou Employee)
  async store(req, res){

    const { email } = req.body;
    const { userId } = req;

// Verificando qual usuário quer criar uma conta nova (Acesso apenas para Providers)
    const checkId = await User.findOne({
      where: {id: userId, provider: true}
    })

    if(!checkId){
      return res.status(401).json({error: "You don't have permission!"});
    }

// Verificar se já existe usuário com esse email

    const checkEmail = await User.findOne({
      where: {
        email,
      },
    });

    if(checkEmail){
      return res.status(400).json({error: "User already exists!"});
    };

// Caso a verificação passe, criamos o usuário

    const { name, password_hash, provider } = await User.create(req.body);

    return res.json({
      name,
      email,
      password_hash,
      provider
    })

  }

// Index - método 
  async index(req, res){

  }
}

module.exports = new UserController();