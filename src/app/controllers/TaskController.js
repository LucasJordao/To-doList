const Task = require('../models/Task');
const User = require('../models/User');
const yup = require('yup');

class TaskController{
  async store(req, res){
    
    const { userId } = req;
    const { employee_id } = req.body;
    req.body.provider_id = userId;

// Validar dados com o yup
    const schema = yup.object().shape({
      title: yup.string(),
      date: yup.date().required(),
      provider_id: yup.number().required(),
      employee_id: yup.number().required(),
      content: yup.string(),
    });

    if(! (await schema.isValid(req.body))){
      return res.status(400).json({error: "Validation failed"});
    }

// Regra de negócio: Apenas chefes podem criar tarefas

// Verificar quem está tentando criar a tarefa

  const checkProvider = await User.findOne({
    where: {
      id: userId,
      provider: true,
      valid: true,
    }
  });

  if(!checkProvider){
    return res.status(401).json({error: "You have not permission!"});
  }

// Verficar se ele quer criar uma tarefa para outro provider

  const checkEmployee = await User.findOne({
    where: {
      id: employee_id,
      provider: false,
      valid: true,
    }
  });

  if(!checkEmployee){
    return res.status(401).json({error: "You cannot to create task for other provider or users invalids"});
  }



// Se caso der certo então pode criar

  const task = await Task.create(req.body);
  console.log(req.body.content);
  return res.json(task);

  }
}

module.exports = new TaskController();