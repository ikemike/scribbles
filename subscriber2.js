"use strict"; 
require('chromedriver');
const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const uconfig = require('./userconfig.js');
const elementParser = require('./elementParser.js');
var driver;


async function goToWebsite() {
    await driver.get('https://www.eurekalert.org/newsletter/');
}
 
async function parsePageElements() {
    let parsedElements = [];
    let elements = await driver.findElements(By.css('input'));
    let buttons = await driver.findElements(By.css('button'));
    let selects = await driver.findElements(By.css('select'));

    elements = elements.concat(buttons);
    console.log('Total elements found: ' + elements.length);

    for (var i = 0; i < elements.length; i++) {
        let parsedElement = await elementParser.parseElement(elements[i]);
        parsedElements.push(parsedElement);
    }
    return parsedElements;
}



init();
// MAIN function
async function init() {
    driver = await new Builder()
        .usingServer()
        .withCapabilities({'browserName': 'chrome' })
        //.setChromeOptions(new chrome.Options().headless().windowSize({width: 640, height: 480}))
        .build();
        
    await goToWebsite();

    let parsedPageElements = await parsePageElements();

    let submitButton = await setElements(parsedPageElements);
    console.log('done setting elements!');
    
    if (submitButton != undefined) submitButton.click();


  

    // Submit the form 
    //if (submitElement != undefined) element.click();

    //await element.sendKeys('webdriver', Key.RETURN);
    //await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
    //await driver.quit();
}

async function setElements(parsedPageElements) {
    // Populate element content(s)
    let submitButton = undefined;
    for (let i = 0; i < parsedPageElements.length; i++) {

        let inputType = parsedPageElements[i].typeOfElement;
        let element = parsedPageElements[i].element;

        if (inputType != undefined) {
        
            if (inputType == 'EMAIL INPUT') {
                if (await element.isDisplayed()) await element.sendKeys(uconfig.email); 
                
                //element.isDisplayed().then(isDisplayed => { if (isDisplayed) element.sendKeys(uconfig.email); });
            } else if (inputType == 'CHECKBOX INPUT') {
                if (await element.isDisplayed()) await element.click(); 
                //element.isDisplayed().then(isDisplayed => { if (isDisplayed) element.click(); });
            } else if (inputType == 'NAME INPUT') {
                if (await element.isDisplayed()) await element.sendKeys(uconfig.firstname); 
                //element.isDisplayed().then(isDisplayed => { if (isDisplayed) element.sendKeys(uconfig.firstname); });
            } else if (inputType == 'SUBMIT INPUT') {
                if (await element.isDisplayed() && await element.isEnabled()) submitButton = element; 
                //element.isDisplayed().then(isDisplayed => { if (isDisplayed) element.click(); });
            }
        }
    }
    return submitButton;
}



