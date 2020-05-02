const User = require('../models/User');
const Task = require('../models/Task');
const Notification = require('../schemas/Notification');
const { format } = require('date-fns');

// Classe criada para implementar o update na rota no qual terá como função concluir uma task
class ConcludedController{

  async update(req, res){
    const { id } = req.params;
    const { userId } = req;

// Verificar se é um employee tentando concluir uma tarefa
    const isEmployee = await User.findOne({
      where: {
        id: userId,
        provider: false,
        valid: true,
      }
    });

    if(!isEmployee){
      return res.status(401).json({error: "You have not permission"});
    }

// Verificando qual tarefa será concluida
    const task = await Task.findOne({
      where:{
        id,
        concluded: false,
        canceled: null,
      }
    });

    if(!task){
      return res.status(400).json({error: "Invalid Task"});
    }

// Verificando se a tarefa é de outro user

    if(task.employee_id != userId){
      return res.status(401).json({error: "You have not permission"});
    }

// Atualizando a tarefa

    task.concluded = true;

    await task.save();

// Criando notificação para o provider informando que a tarefa foi concluida
    const formatteDate = format(
      new Date(),
      'dd-MM-yyyy'
    );

    await Notification.create({
      content: `A tarefa, ${task.title}, foi concluida no dia: ${formatteDate}`,
      provider: task.provider_id,
      employee: userId,
    });

    return res.json(task);
  }

}

module.exports = new ConcludedController();