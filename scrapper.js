const puppeteer = require('puppeteer');
const fs = require('fs');


async function scrapeInfiniteScrollItems(page, text, maxPages = 10) {

    let re = new RegExp(text.join("|"), 'g');
    console.log(re);
    /* Scroll to the end of page */
    await page.evaluate(async (re, maxPages) => {
        let pages = 0;
        let scrollPosition = 0
        let documentHeight = document.body.scrollHeight
  
        while (documentHeight > scrollPosition && pages < maxPages) {
          window.scrollBy(0, documentHeight)
          await new Promise(resolve => {
            setTimeout(resolve, 1000)
          })
          scrollPosition = documentHeight
          documentHeight = document.body.scrollHeight
          pages++;
        }
    });
    /* Match regex based on input words */
    const data = await page.content();
    const matches = ([...data.matchAll(re)]).length;
    console.log(matches);
 
    try {
        const result = JSON.stringify({"input":text,"matches":matches});
        fs.appendFile('./output.txt',result.concat("\n") ,{flag: "a"}, (err) => {
            if (err) throw new Error(err);
        });
        
    }catch(e) {console.log(e);}
};




async function run(message)  {
    const browser = await puppeteer.launch({
        //headless: false,
        //defaultViewport: null,
        //args: ['--window-size=800,600']
    });

    const page = await browser.newPage();
    await page.goto(message.url);

    console.log(`scrapper started!`);
    await scrapeInfiniteScrollItems(page, message.wordList, message.maxPages);
    console.log(`scrapper finished!`);
    await browser.close();

};


module.exports = { run };
