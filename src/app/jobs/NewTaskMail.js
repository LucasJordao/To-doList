const Mail = require('../../lib/Mail')
const { resolve } = require('path');
const { format, parseISO } = require('date-fns');

class NewTaskMail{
  get key(){
    return 'NewTaskMail';
  }

  async handle({data}){

    const {task, checkProvider, checkEmployee} = data;

    const formatteDate = format(parseISO(task.date), 'dd-MM-yyyy');
    const formatteTodayDate = format(new Date(), 'dd-MM-yyyy');

    await Mail.sendMail({
      to: `${checkEmployee.name} <${checkEmployee.email}>`,
      subject: 'Nova Tarefa',
      template: 'newtask',
      context: {
        user: checkEmployee.name,
        title: task.title,
        date: formatteDate,
        todayDate: formatteTodayDate,
        provider: checkProvider.name,
      },
      attachments: {
        fieldname: 'CatrixIcon',
        path: resolve(__dirname, '..', 'views', 'emails', 'img','CatrixIcon.png'),
        cid: 'icon',
      }
    });
  }
}

module.exports = new NewTaskMail();