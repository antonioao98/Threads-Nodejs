const { getListItems } = require('./app');
const { findAllPerQuery } = require('./repository/listItem');
const {
  Worker,
  isMainThread,
  workerData,
  parentPort,
} = require('worker_threads');
const { getPartsOfArray } = require('./utils/sliceArray');
const connect = require('./db/connect');
const numCPUs = require('os').cpus().length;
const cpu = numCPUs - 1;
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
    return getPartsOfArray(await findListItems(), cpu);
  }
  if (isMainThread) {
    const arrayThreads = await arraysThreads();
    if (typeof arrayThreads == 'object' && arrayThreads.length ) {
      let sharedArray = []
      if(arrayThreads.length < cpu){
        sharedArray = new Uint8Array(new SharedArrayBuffer(arrayThreads.length));
      }else{
        sharedArray = new Uint8Array(new SharedArrayBuffer(cpu));
      }
      console.log('main');
      for (let i = 0; i < arrayThreads.length; i++) {
        pool.acquire(
          __filename,
          {
            workerData: {
              position: i,
              data: arrayThreads,
              arr: sharedArray,
            },
          },
          (err, worker) => {
            if (err) reject(err);
            console.log(`started worker with (pool size: ${pool.size})`);
            worker.on('message', message => {
              connect.disconnect();
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
      console.log('Não existe nenhum registro errado');
      connect.disconnect();
    }
  } else {
    if (!workerData) return;
    const value = await getListItems(
      workerData.data,
      workerData.name,
      workerData.position
    );
    Atomics.add(workerData.arr, workerData.position, value);
    if (workerData.arr.includes(1) || workerData.arr.includes(2)) {
      connect.disconnect();
      if (!workerData.arr.includes(0)) {
        parentPort.postMessage(true);
      }
    }
  }
}
start();
