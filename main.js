const { getListItems } = require('./app');
const { findAllPerQuery } = require('./repository/listItem');
const { Worker, isMainThread, workerData, parentPort } = require('worker_threads');
const { getPartsOfArray } = require('./utils/sliceArray');
const connect = require('./db/connect');
const numCPUs = require('os').cpus().length;
const cpu = numCPUs - 2
const Pool = require('worker-threads-pool');
const pool = new Pool({ max: cpu });

console.log('Buscando ListItems');

async function start() {
  async function arraysThreads() {
    const findListItems = async () => {
      return await findAllPerQuery({
        buyerCnpj: { $regex: /E/, $options: 'i' },
      })
        .then(item => {
          console.log('ListItems buscados com sucesso !');
          
          return item;
        })
        .catch(err => {
          console.log('er', err);
        });
    };

    // 13 11
    return getPartsOfArray(await findListItems(), cpu);
  }
  if (isMainThread) {
    const arrayThreads = await arraysThreads();
    const sharedArray = new Uint8Array(new SharedArrayBuffer(cpu));
    console.log('main');
    for (let i = 0; i < arrayThreads.length; i++) {
      pool.acquire(
        __filename,
        {
          workerData: {
            position: i,
            data: arrayThreads[i],
            arr:sharedArray
          },
        },
        (err, worker) => {
          if (err) reject(err);
          console.log(`started worker with (pool size: ${pool.size})`);
          worker.on('message', message => {
            console.log(message);
            connect.disconnect()
          });
          worker.on('error', message => {
            console.log(message);
            console.log('error');
          });
          worker.on('exit', code => {
            if (code !== 0)
              new Error(`Worker stopped with exit code ${code}`);
          });
        }
      );
    }
  } else {
    if (!workerData) return;
    // console.log(workerData.name)
    // console.log(workerData.data)
    const teste = await getListItems(workerData.data, workerData.name, workerData.position);
    Atomics.add(workerData.arr, workerData.position , teste)
     if(workerData.arr.includes(1) || workerData.arr.includes(2)){
       connect.disconnect()
       if(!workerData.arr.includes(0)){
           parentPort.postMessage(true)
      }
     }
  }
}
//------------------- MEU PC
// com thread
// 14:38:18 inicio
// 14:50:35 acabou for
// 15:20:56 acabou a atualização
// total: 42min
//---------------------
//sem thread
// 15:38 inicio
// 15:51 acabou o for
// 16:22 acabou a atualização
//total: 44min
start();