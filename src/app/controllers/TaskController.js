const Task = require('../models/Task');
const User = require('../models/User');

class TaskController{
  async store(req, res){
    return res.json({ok: true});
  }
}

module.exports = new TaskController();