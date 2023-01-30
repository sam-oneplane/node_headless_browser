const amqp = require("amqplib");
const readJson = require("./readJson");

const CONN_URL = "amqps://eyvqoatc:vgz9WLcDSYn9Qc2YjLvNUv2SvPKSxsVA@sparrow.rmq.cloudamqp.com/eyvqoatc";
const queueName = 'headless_browser';

async function connect() {
    try {
        const connection = await amqp.connect(CONN_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue("headless_browser");

        console.log('Start publishing');
        const messages = readJson.jsonArray('./data.json');
        if (messages.data.length) {
            await Promise.all(
                messages.data.map(async (massage) => {
                    console.log(`Publishing to queueName: ${queueName}`);
                    return await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(massage)));
                })
            )
        };
        await channel.close();
        await connection.close();
        console.log('End publishing');
    }
    catch (exception) {
        console.error(exception);
    }
}

connect();