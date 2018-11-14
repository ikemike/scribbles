"use strict"; 
require('chromedriver');
var webdriver = require("selenium-webdriver");
let e = 'Great@Job.com';

//SeleniumServer = require("selenium-webdriver/remote").SeleniumServer;
let driver = new webdriver.Builder().usingServer().withCapabilities({'browserName': 'chrome' }).build();
let site = 'https://www.scientificamerican.com/page/newsletter-sign-up/';
driver.get(site);

driver.findElements(webdriver.By.tagName("input")).then(elements => {
    console.log(elements.length);
    elements.forEach(anElement => {
        anElement.isDisplayed().then(isDisplayed => {
            if (isDisplayed) anElement.sendKeys(e); 
        });
    });
})
driver.findElements(webdriver.By.css("*[type='checkbox']")).then(elements => {
    elements.forEach(anElement => {
        let elementDisplayed = anElement.isDisplayed();
        let elementEnabled = anElement.isEnabled();
        Promise.all([elementDisplayed, elementEnabled]).then(values => {
            if (values[0] && values[1]) anElement.click();
        }).catch(err => {})
    });
   
})


driver.findElements(webdriver.By.css('[type="submit"]')).then(elements => {
    console.log(elements.length);
    elements.forEach(anElement => {
        anElement.isDisplayed().then(isDisplayed => {
            //if (isDisplayed) anElement.click(); 
        });
    });
})



/* Full Working Example of compressport.com 
driver.get('https://www.compressport.com/subscribe-our-newsletter/');
let inputElements = driver.findElements(webdriver.By.tagName("input"));
let submitElements = driver.findElements(webdriver.By.css('[type="submit"]'));

inputElements.then(theElements => {
    theElements.forEach(anElement => {
        anElement.sendKeys(e);
    });
    submitElements.then(theElements => {
        theElements[0].click();
    });
});
*/





/* Example (works)
browser.get('http://en.wikipedia.org/wiki/Wiki');
browser.findElements(webdriver.By.css('[href^="/wiki/"]')).then(function(links){
    console.log('Found', links.length, 'Wiki links.' )
    browser.quit();
});
*/
/* Doesn't Work
driver.findElements(webdriver.By.css('[id="subscribe_newsletter2"')).then(function(results) {
    console.log('Okay!');
    console.log('Found: ' + results.length);
    driver.quit();
})
*/

// Submit Example (works):
//driver.findElement(webdriver.By.name('mail_newsletter')).sendKeys('Great@Great.com');
//driver.findElement(webdriver.By.name('subscribe')).click();