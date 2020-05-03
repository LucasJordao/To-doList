const Mail = require('../../lib/Mail')
const { resolve } = require('path');
const { format, parseISO } = require('date-fns');

class ConcludedTaskMail{
  get key(){
    return 'ConcludedTaskMail';
  }

  async handle({data}){

    const {task} = data;

    const formatteDate = format(parseISO(task.date), 'dd-MM-yyyy');
    const formatteTodayDate = format(new Date(), 'dd-MM-yyyy');

    await Mail.sendMail({
      to: `${task.employee.name} <${task.employee.email}>`,
      subject: 'Tarefa concluida',
      template: 'concludedtask',
      context: {
        user: task.employee.name,
        title: task.title,
        date: formatteDate,
        todayDate: formatteTodayDate,
        provider: task.provider.name,
      },
      attachments: {
        fieldname: 'CatrixIcon',
        path: resolve(__dirname, '..', 'views', 'emails', 'img','CatrixIcon.png'),
        cid: 'icon',
      }
    });
  }
}

module.exports = new ConcludedTaskMail();