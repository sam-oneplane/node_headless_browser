const amqp = require("amqplib");
const scrapper = require("./scrapper");

const queueName = 'headless_browser';
const CONN_URL = "amqps://eyvqoatc:vgz9WLcDSYn9Qc2YjLvNUv2SvPKSxsVA@sparrow.rmq.cloudamqp.com/eyvqoatc";
/* AMQP */
async function connect() {

    try {
        const connection = await amqp.connect(CONN_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue(queueName);
        console.log("consumer is listening");
        channel.consume(queueName, async (message) => {
            await scrapper.run( JSON.parse(message.content));
        }, { noAck: true });
    }
    catch (exception) {
        console.error(exception);
    }
}

connect();
//module.exports = { connect };
