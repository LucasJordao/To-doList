const Notification = require('../schemas/Notification');
const User = require('../models/User');

class NotificationController{
  async index(req, res){
    const {page = 1} = req.query;
    const { userId } = req;

// Verificando usuário que fez a requisição
    const checkUser = await User.findOne({
      where:{
        id: userId,
        valid: true,
      }
    });

// Se for um usuário inválido
    if(!checkUser){
      return res.status(401).json({error: "This is not permission"});
    }

// Fazendo a listagem
    const notifications = await Notification.find({
      receive: userId,
    }).sort({ createdAt: 'desc'}).limit(10).skip((page - 1) * 10);

    return res.json(notifications);
  
  }

  async update(req, res){
    
// Pegando qual a notificação foi lida
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    return res.json(notification);
  }
}

module.exports = new NotificationController();