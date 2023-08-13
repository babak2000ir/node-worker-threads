import { isMainThread, parentPort, workerData } from 'worker_threads';
const startTime = Date.now();
let i = 0;
for (i = 0; i < 1000000000; i++) {
    for (let j = 0; j < 100; j++) {
        let dummy = Math.log1p(j) + Math.log1p(i);
    }
    let dummy = Math.log1p(i);
}
const endTime = Date.now();

parentPort.postMessage((isMainThread ? 'main' : 'worker') + `: ${endTime - startTime}ms`);
