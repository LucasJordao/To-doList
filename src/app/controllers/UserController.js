const User = require('../models/User');
const File = require('../models/File');
const yup = require('yup');
const Queue = require('../../lib/Queue');
const CreateUserMail = require('../jobs/CreateUserMail');

class UserController{

// Store - método responsável por criar novos Usuários (Provider ou Employee)
  async store(req, res){

// Validando os dados com o yup

    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required(),
      password: yup.string().required().min(6),
    });

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({error: "Validation fails"});
    }

// Verificar se já existe usuário com esse email
    const { email } = req.body;

    const checkEmail = await User.findOne({
      where: {
        email,
      },
    });

    if(checkEmail){
      return res.status(400).json({error: "User already exists!"});
    };

// Caso a verificação passe, criamos o usuário

    const user = await User.create(req.body);

// Enviando email de boas vindas
    await Queue.add(CreateUserMail.key, {user});


    return res.json({
      name: user.name,
      email,
      provider: user.provider
    })

  }

// Index - método 
  async index(req, res){

    const { userId } = req;

// Verificar se o usuário é um Provider ou um Employee
    const user = await User.findOne({
      where: {id: userId, provider: true,}
    });

// Se for um provider
    if(user){
      const users = await User.findAll({
        where: {
          provider: false,
          valid: true
        },
        attributes: ['id', 'name', 'email', 'avatar_id'],
        include: [{
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url']
        }]
      });

      return res.json(users);
    }

// Se for um employee
    const users = await User.findAll({
      where: {
        provider: true,
        valid: true
      },
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [{
        model: File,
        as: 'avatar',
        attributes: ['name', 'path', 'url']
      }]
    });

    return res.json(users);
  }

// Update - método de atualizar
  async update(req, res){
    
    const schema = yup.object().shape({
      name: yup.string(),
      email: yup.string().email(),
      provider: yup.boolean(),
      oldPassword: yup.string().min(6),
      password: yup.string().min(6).when('oldPassword', (oldPassword, field) =>
        oldPassword ? field.required() : field
      ),
      confirmPassword: yup.string().min(6).when('password', (password, field) =>
        password ? field.required().oneOf([yup.ref('password')]) :  field
      ),
    });

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({error: "Validation fails"});
    }

// Verificar qual usuário quer fazer atualização
    const { userId } = req;
    const { email, oldPassword } = req.body;
    const user = await User.findByPk(userId);

// Verificar se o email que ele informou já está sendo usado
    if(email && email != user.email){
      if(await User.findOne({where: {email}})){
        return res.status(400).json({error: "Email is not valid"});
      }
    }

// Verificar se o oldPassword informado é válido
    if(oldPassword && !(await user.checkPassword(oldPassword))){
      return res.status(400).json({error: "Password does not match"});
    }

// Fazer atualização
    const userUpdate = await user.update(req.body);

// Criei uma nova variável email para não haver conflito
    const newEmail = userUpdate.email;

// Aqui fiz a destruturização
    const {id, name, provider} = userUpdate;

    return res.json({
      id,
      name,
      newEmail,
      provider
    });
  }

// Delete - método para deletar
  async delete(req, res){
    
    const { userId } = req;
    const { id } = req.params;

// Verificar se quem está deletando é um chefe (Provider)
    const provider = await User.findOne({
      where:{
        id: userId,
        provider: true,
        valid: true,
      }
    });

    if(!provider){
      return res.status(401).json({error: "You have not permission!"});
    }

// Verificar se foi informado um funcionário (Employee) existente
    const employee = await User.findOne({
      where: {id, valid: true}
    });


    if(!employee){
      return res.status(400).json({error: "User not found"});
    }

// Verificar se  está tentando deletar outro provider
    if(employee.provider){
      console.log(provider.id);
      console.log(employee.id);
      if(!(provider.id == employee.id)){
        return res.status(401).json({error: "Sorry! This is not permitted!"});
      }
    }

// Deletar user (Valid = false)
    employee.valid = false;
    await employee.save();
  
    return res.json(employee);

  }
}



module.exports = new UserController();