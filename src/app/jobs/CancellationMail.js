const Mail = require('../../lib/Mail');
const { format } = require('date-fns');
const { resolve } = require('path');

class CancellationMail{
// O "get" torna uma função como variável, ele vai nos retornar uma key única para o job
  get key(){
    return 'CancellationMail';
  }

// O handle será nossa atividade que entrará para a fila
  async handle({data}){

    const { task } = data;

// enviando email informando que a tarefa foi cancelada
    const formatteDate = format(new Date(), 'dd-MM-yyyy');
    
    await Mail.sendMail({
      to: `${task.employee.name} <${task.employee.email}>`,
      subject: 'Tarefa Cancelada',
      template: 'cancellation',
      context: {
        provider: task.provider.name,
        email: task.provider.email,
        task: task.title,
        date: formatteDate,
        employee: task.employee.name,
      },
      attachments: [
        {
          filename: 'CatrixIcon.png',
          path: resolve(__dirname, '..', 'views', 'emails', 'img','CatrixIcon.png'),
          cid: 'icon'
        },
      ]
    })
  }
}

module.exports = new CancellationMail();