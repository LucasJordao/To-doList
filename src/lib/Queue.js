const Bee = require('bee-queue');
const redisConfig = require('../config/redis');

// Jobs que entrão para a fila
const CancellationMail = require('../app/jobs/CancellationMail');
const CreateUserMail = require('../app/jobs/CreateUserMail');

// Lista de jobs
const jobs = [CancellationMail, CreateUserMail];

class Queue{
  constructor(){
    this.queues = {};
    this.init();
  }

/**
 * @function init() - Essa função é responsável por percorrer os jobs e adicionar no queues a fila usando (Queue) e guardar a função do job(handle)
 */
  init(){
    jobs.forEach(({key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      }
    });
  }
/**
 * @function add() - Essa função recebe dois parametros o queue e o  job, ele vai consultar nas queues a queue informada e vai chamar do bee o metodo createJob recebendo o job
 */
  add(queue, job){
    return this.queues[queue].bee.createJob(job).save();
  }

/**
 * @function processQueue - Essa função é responsável por fazer o processamento dos jobs
 */
  processQueue(){
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.process(handle);
    })
  }
}


module.exports = new Queue();