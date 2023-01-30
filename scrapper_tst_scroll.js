const puppeteer = require('puppeteer');
const fs = require('fs');


async function scrapeInfiniteScrollItems(page, text, itemTargetCount) {

    let re = new RegExp(text.join("|"), 'g');
    console.log(re);
   
    await page.evaluate(async (re) => {
        let scrollPosition = 0
        let documentHeight = document.body.scrollHeight
  
        while (documentHeight > scrollPosition) {
          window.scrollBy(0, documentHeight)
          await new Promise(resolve => {
            setTimeout(resolve, 1000)
          })
          scrollPosition = documentHeight
          documentHeight = document.body.scrollHeight
        }
    });
    const data = await page.content();
    const matches = ([...data.matchAll(re)]).length;
    console.log(matches);
      /*
        while (matches < itemTargetCount) {
            const data = await page.content();
            matches = ([...data.matchAll(re)]).length;
            console.log(matches); 
           
            previousHeight = await page.evaluate('document.body.scrollHeight');
            await page.evaluate('window.scrollTo(0, document.body.scrollHeight)'); // scroll down to end of page
            await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`); // condition to activate next page
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
     */
    try {
        
        fs.writeFile('./output.json', JSON.stringify({"input":text,"matches":matches}), (err) => {
            if (err) throw new Error(err);
        });
    }catch(e) {
        console.log(e);
    }
};



const run = async (url) => {
    const browser = await puppeteer.launch({
        //headless: false,
        //defaultViewport: null,
        //args: ['--window-size=800,600']
    });

    const page = await browser.newPage();

    await page.goto(url);

    console.log(`scrapper started!`);
    
    await scrapeInfiniteScrollItems(page, ["Scroll"], 100);
    console.log(`scrapper finished closing browser!`);
    await browser.close();

};


run("https://intoli.com/blog/scrape-infinite-scroll/demo.html");
