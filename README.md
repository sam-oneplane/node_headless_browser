# node_headless_browser

a headless browser using puppeteer in nodejs

# short description

this is an example of implementation of a headless browser  
in node js using a puppeteer library.

# key modules :

1. consumer.js
2. producer.js
3. scrapper.js
4. aws massage broker (rabbitMQ)

## Producer (producer.js)

1. read a data.json file and push each entry from the json array into the
   queue (named : headless_browser)
2. the queue name and the connection url are specified as constants
3. remark: the consumer can be implemented as a pert of http server
   using nest/express/vanilla.

## Consumer (consumer.js)

1. listen to massages (json) from the queue and runs the scrapper for each
   command.

## Scrapper (scrapper.js)

1. when called with url and text word array, it uses puppeteer lib. to scroll to the end
   of the page and search for the given text.
2. it count the number of appearances of the word and print the result to output.txt

## Massage Broker (rabbitMQ)

1. defined here : https://customer.cloudamqp.com/instance/#
2. instance name : headlessBrowserNode
3. single queue (headless_browser), single producer/consumer
   https://sparrow.rmq.cloudamqp.com/#/queues

## How to run

1. open a terminal in the project dir and run :

#### node ./consumer.js

you will see massage : consumer is listening

2. in the same dir open a second terminal and run:

#### node ./producer.js

you will see something like :

```markdown
Start publishing
Publishing to queueName: headless_browser
Publishing to queueName: headless_browser
Publishing to queueName: headless_browser
Publishing to queueName: headless_browser
End publishing
```


3. open the queue window on browser to see the massages entering and leaving
   the queue

4. the output will be printed on the terminal :

```markdown
scrapper started!
/Scroll/g
119
scrapper finished!
```

for each massage, and in the output file will a line is added:

```markdown
{"input":["Scroll"],"matches":119}
```
