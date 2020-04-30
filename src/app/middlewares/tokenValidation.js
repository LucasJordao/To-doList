const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const authToken = require('../../config/authToken');

module.exports = async (req, res, next) => {

  const {authorization} = req.headers;

// Verificando se foi informado um token no header
  if(!authorization){
    return res.status(400).json({error: "Token not informed!"});
  }

// Separar o token do Bearer
  const [, token] = authorization.split(' ');

  try{
// O método jwt.verify() não é um método com base promisse, por isso usamos o promisify do util para converte-lo
    const decoded = await promisify(jwt.verify)(token, authToken.secret);

// Retornamos o id do token pelo req
    req.userId = decoded.id;
    return next();
  }catch(err){
    return res.status(401).json({error: "Token invalid"});
  }

}