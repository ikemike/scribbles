"use strict"; 
require('chromedriver');
var webdriver = require("selenium-webdriver");
let e = 'Great@Job.com';

// XPATH EMAIL SELECTOR
let emailInputXPath = "//input[contains(translate(@name, 'EMAIL', 'email'),'email')]";

// XPATH FIRST NAME SELECTOR
let fnInputXP = "//input[contains(translate(@name, 'FIRSTNAME', 'firstname'),'firstname')]";
let fnInputXP2 = "//input[contains(translate(@name, 'FNAME', 'fname'),'fname')]";

// XPATH LAST NAME SELECTOR
let lnInputXP = "//input[contains(translate(@name, 'LASTNME', 'lastnme'),'lastname')]";
let lnInputXP2 = "//input[contains(translate(@name, 'LNAME', 'lname'),'lname')]";

// XPATH CHECKBOX SELECTOR
let cboxInputXP = '//input[@type="checkbox" and not (@checked)]';

// XPATH SELECT LIST SELECTOR
let countryInputXP = "//select[contains(translate(@name, 'COUNTRY', 'country'),'country')]";
let countryInputXP2 = "//select[contains(@class, 'required')]";



let driver = new webdriver.Builder().usingServer().withCapabilities({'browserName': 'chrome' }).build();
//let site = 'https://www.scientificamerican.com/page/newsletter-sign-up/';
//let site = 'https://www.sciencemag.org/subscribe/get-our-newsletters';
let site = 'https://www.eurekalert.org/newsletter/';


driver.get(site);
doStuff(emailInputXPath, 'sendKeys', e);
doStuff(fnInputXP, 'sendKeys', 'First Name');
doStuff(fnInputXP2, 'sendKeys', 'First Name');

doStuff(lnInputXP, 'sendKeys', 'Last Name');
doStuff(lnInputXP2, 'sendKeys', 'Last Name');

doStuff(cboxInputXP, 'click', '');

doStuff(countryInputXP, 'select', 'United States of America');
doStuff(countryInputXP2, 'select', 'United States of America');


// Get applicable email elements and send keys 
function doStuff(xPathSelector, actionToPerform, keys) {
    driver.findElements(webdriver.By.xpath(xPathSelector)).then(elements => {
        console.log('Found: ' + elements.length + ' matching elements (' + actionToPerform + ')');
        elements.forEach(anElement => {
            Promise.all([anElement.isDisplayed(), anElement.isEnabled()]).then(results => {
                if (results[0] && results[1]) {
                    if (actionToPerform == 'sendKeys') anElement.sendKeys(keys);
                    else if (actionToPerform == 'click') console.log('clicking'), anElement.click();
                    else if (actionToPerform == 'select') console.log('selecting'), anElement.selectByVisibleText(keys);
                } 
            }).catch(err => {});
        });
    });
}









/*
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
*/


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