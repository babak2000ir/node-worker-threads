import { parentPort, isMainThread } from 'node:worker_threads';

console.log("* worker created");
parentPort.once('message', message => {
    console.log("* worker received message: " + message);
    const result = heavyCall();
    parentPort.postMessage(result);
})

function heavyCall() {
    console.log("* worker heavyCall");
    const startTime = Date.now();
    let i = 0;
    for (i = 0; i < 1000000000; i++) {
        for (let j = 0; j < 100; j++) {
            let dummy = Math.log1p(j) + Math.log1p(i);
        }
        let dummy = Math.log1p(i);
    }
    const endTime = Date.now();
    return (isMainThread ? 'main' : 'worker') + `: ${endTime - startTime}ms`;
}
