//import node
import path from 'node:path';
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';
import { fileURLToPath } from 'node:url';

//import npm
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import serve from 'koa-static';
import Router from 'koa-router';

//init
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = new Koa();
const router = new Router();
app.use(bodyParser());

app.use(async (ctx, next) => {
    const timeStamp = `${(new Date()).toLocaleDateString('en-GB')} ${(new Date()).toLocaleTimeString('en-GB')}`;
    console.log(`${timeStamp} ${ctx.request.method} '${ctx.request.url}' ${JSON.stringify(ctx.request.body)}`);
    await next();
});

router.post('/shortCall', async (ctx) => {
    ctx.body = await asyncDelayCall(5000);
});

router.post('/longCall', async (ctx) => {
    ctx.body = await asyncDelayCall(10000);
});

router.post('/heavyCall', async (ctx) => {
    ctx.body = heavyCall();
});

router.post('/heavyCallWT', async (ctx) => {
    ctx.body = await new Promise((resolve, reject) => {
        const worker = new Worker(`${__dirname}/worker.js`);
        worker.on('message', result => {
            resolve(`success: ${result}`);
        });
        worker.on('error', error => {
            console.error('Worker error:', error);
            reject((isMainThread ? 'main' : 'worker') + 'error: ' + error);
        });
        worker.on('exit', code => {
            if (code !== 0) {
                console.error('Worker stopped with exit code:', code);
                reject((isMainThread ? 'main' : 'worker') + 'exit code: ' + code);
            }
        });
        worker.postMessage('start computation');
    });
});

router.post('/heavyCallAsync', async (ctx) => {
    ctx.body = await heavyCallAsync();
});

app.use(router.routes());

app.use(serve(path.join(__dirname, '/client')));


app.listen(3000);
console.log("Server is listening on port 3000");

async function asyncDelayCall(duration) {
    const startTime = Date.now();
    const resp = isMainThread ? 'main' : 'worker';
    await new Promise(resolve => setTimeout(resolve, duration))
        .catch(err => {
            console.log(err);
            resp = `${resp}: failed: ${err}`;
        });
    const endTime = Date.now();
    return resp + `: ${endTime - startTime}ms`;
}

function heavyCall() {
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

function heavyCallAsync() {
    const startTime = Date.now();
    return new Promise(resolve => {
        let i = 0;
        for (i = 0; i < 1000000000; i++) {
            for (let j = 0; j < 100; j++) {
                let dummy = Math.log1p(j) + Math.log1p(i);
            }
            let dummy = Math.log1p(i);
        }
        resolve((isMainThread ? 'main' : 'worker') + `: ${Date.now() - startTime}ms`);
    });
}

