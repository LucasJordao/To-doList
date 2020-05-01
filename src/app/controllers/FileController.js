const File = require('../models/File');

class FileController{
  async store(req, res){
// Com o middleware do multer na rota será possivel pegar as duas variáveis (Originalname, filename)
    const {originalname: name, filename: path} = req.file;

// Aqui nós criaremos o file
    const file = await File.create({
      name, path
    });

    return res.json({name, path});
  }
}

module.exports = new FileController();