const Task = require('../models/Task');
const User = require('../models/User');
const Notification = require('../schemas/Notification');
const yup = require('yup');
const {resolve} = require('path');
const Queue = require('../../lib/Queue');
const CancellationMail = require('../jobs/CancellationMail');
const { isBefore, parseISO, startOfHour, format } = require('date-fns');

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


// Verificar se a data informada já passou
  const hourStart = startOfHour(parseISO(req.body.date));

  if(isBefore(hourStart, new Date())){
    return res.status(400).json({error: 'Past dates are not permitted'});
  }

// Se caso der certo então pode criar

  const task = await Task.create(req.body);

// Criando uma notificação informando que uma tarefa foi gerada
  const formatteDate = format(
    hourStart,
    "dd'/'MM'/'yyyy"
  );

  await Notification.create({
    content: `Nova tarefa criada com data da prazo: ${formatteDate}`,
    send: userId,
    receive: employee_id,
  })

  return res.json(task);

  }

  async index(req, res){

    const { page = 1} = req.query;
    const { userId } = req;

// percisamos certificar-se de quem está querendo a lista
    const checkUser = await User.findOne({
      where: {
        id: userId,
        provider: true,
        valid: true
      }
    });

// verificaremos se é um employee
    if(!checkUser){
      const tasks = await Task.findAll({
        where: {
          employee_id: userId,
          canceled: null,
          concluded: false,
        },
        order: [['date', 'DESC']],
        limit: 20,
        offset: (page - 1) * 20,
        include: [
          {
            model: User,
            as: 'provider',
            attributes: ['id', 'name', 'email', 'avatar_id'],
          }, 
          {
            model: User,
            as: 'employee',
            attributes: ['id', 'name', 'email', 'avatar_id'],
          },
        ]
      });

      return res.json(tasks);
    }

// Se caso for um provider
    const tasks = await Task.findAll({
      where: {
        provider_id: userId,
        canceled: null,
      },
      order: [['date', 'DESC']],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name', 'email', 'avatar_id'],
        }, 
        {
          model: User,
          as: 'employee',
          attributes: ['id', 'name', 'email', 'avatar_id'],
        },
      ]
    });

    return res.json(tasks);

  }

  async update(req, res){

    const { id } = req.params;
    const { userId } = req;

// Consultar quem quer editar a tarefa

    const isProvider = await User.findOne({
      where:{
        id: userId,
        provider: true,
        valid: true,
      }
    });

    if(!isProvider){
      return res.status(401).json({error: "Sorry! You have not permission"});
    }

// Identificar qual atividade editar

    const task = await Task.findOne({
      where: {
        id,
        concluded: false,
        canceled: null
      }
    });

    if(!task){
      return res.status(401).json({error: "Task invalid"});
    }

// Verificando se quem quer editar é o mesmo que criou a tarefa

    if(userId != task.employee_id){
      return res.status(400).json({error: "You have not permitted"});
    }

// Atualizar se caso passe
    const update = await task.update(req.body);

    return res.json(update);
  }

  async delete(req, res){

    const { userId } = req;
    const { id } = req.params;
// Verificar se é um provider tentando deletar

    const isProvider = await User.findOne({
      where: {
        id: userId,
        provider: true,
        valid: true,
      }
    });

    if(!isProvider){
      return res.status(401).json({error: "You have not permission"});
    }

// Verificar se a tarefa ainda está no ar
    const task = await Task.findOne({
      where: {
        id, 
        canceled: null,
      },
      include: [
        {
          model: User,
          as: 'employee',
        },
        {
          model: User,
          as: 'provider'
        }
      ]
    });

    if(!task){
      return res.status(400).json({error: "Invalid task"});
    }


// Verificando se quem quer deletar é o mesmo que criou

    if(userId != task.provider_id){
      return res.status(401).json({error: "You have not permission"});
    }

// Se ainda estiver pode cancelar
    task.canceled = new Date();

    await task.save();

// Enviando notificação para o employee informando que a tarefa foi cancelada
    const formatteDate = format(
      new Date(),
      "dd-MM-yyyy"
    )

    await Notification.create({
      content: `A tarefa, ${task.title}, foi cancelada no dia: ${formatteDate}`,
      receive: task.employee_id,
      send: userId,
    });

// Enviar email como background job
    await Queue.add(CancellationMail.key, {task});

    return res.json(task);
  }
}

module.exports = new TaskController();