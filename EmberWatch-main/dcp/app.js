const SCHEDULER_URL = new URL('https://scheduler.distributed.computer');

require('dcp-client').initSync();
const compute = require('dcp/compute');
const wallet = require('dcp/wallet');

let inputSet = '';
let output = '';
let resultSet = [];

inputString = "sethacks should be capitalized"

inputSet = Array.from(inputString);
output = '';
console.log("Input data generated");

async function workFn(letter) {
    progress();
    return letter.toUpperCase();
}

join_key = 'anu-edge'
join_secret = "idMMZpFPu6"

async function deploy(input) {
    let job = compute.for(input, workFn);
    job.public.name = 'DCP - toUpperCompute';

    if (join_key) job.computeGroups = [{ joinKey: join_key, joinSecret: join_secret }];



    job.on('accepted', () => {
        console.log(` - Job accepted by scheduler, waiting for results`);
        console.log(` - Job has id ${job.id}`);
    });

    job.on('readystatechange', (arg) => {
        console.log(`new ready state: ${arg}`);
    });

    job.on('result', (ev) => {
        console.log(
        ` - Received result for slice ${ev.sliceNumber}`,
        );
        // console.log(` * Wow! ${ev.result.colour} is such a pretty colour!`);
    });
    job.on('status', (ev) => {
        console.log("got a status:")
        console.log(ev)
    })

    const ks = await wallet.get(); /* usually loads ~/.dcp/default.keystore */
    job.setPaymentAccountKeystore(ks);
    // let results = await job.localExec();
    let results = await job.exec();
    console.log("Compute complete");
    resultSet = Array.from(results);
}


r = deploy(inputSet).then((value) => {
    console.log(resultSet);
});
