"use strict"; 
require('chromedriver');
const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const uconfig = require('./userconfig.js');
const elementParser = require('./elementParser.js');
const googler = require('./googler2.js');
var driver;



init();
// MAIN function
async function init() {
    driver = await new Builder()
        .usingServer()
        .withCapabilities({'browserName': 'chrome' })
        //.setChromeOptions(new chrome.Options().headless().windowSize({width: 640, height: 480}))
        .build();
        
    
    let pagesToVisit = await googler.getGoogleResults(driver, By, Key, uconfig.search_term);
    console.log(pagesToVisit.length);

    // Visit each google result
    for (let i = 0; i < pagesToVisit.length; i++) {

        await driver.get(pagesToVisit[i]);

        let parsedPageElements = await parsePageElements();
    
        try {
            let submitButton = await setElements(parsedPageElements);
            console.log('done setting elements!');

            if (submitButton != undefined) {
                driver.executeScript("arguements[0].scrollIntoView(false)", submitButton);
                await driver.sleep(100);
                await submitButton.click();
                await driver.sleep(500);
            }

        } catch (e) {
            console.log(e);
        }
    }
    
}

// Return a list of elements that take input and pass them through the element parser class
async function parsePageElements() {
    let parsedElements = [];
    let inputs = await driver.findElements(By.css('input'));
    let buttons = await driver.findElements(By.css('button'));
    let selects = await driver.findElements(By.css('select'));

    let elements = [];
    elements = elements.concat(inputs, buttons, selects);
    console.log('Total elements found: ' + elements.length);

    for (var i = 0; i < elements.length; i++) {
        let parsedElement = await elementParser.parseElement(elements[i]);
        parsedElements.push(parsedElement);
    }
    return parsedElements;
}

// Set each elements value based on what type of element it is - return a submit button 
async function setElements(parsedPageElements) {

    let submitButton = undefined;
    for (let i = 0; i < parsedPageElements.length; i++) {

        let inputType = parsedPageElements[i].typeOfElement;
        let element = parsedPageElements[i].element;

        if (inputType != undefined) {
        
            if (inputType == 'EMAIL INPUT') {
                if (await element.isDisplayed()) await element.sendKeys(uconfig.email); 
                //element.isDisplayed().then(isDisplayed => { if (isDisplayed) element.sendKeys(uconfig.email); });

            } else if (inputType == 'CHECKBOX INPUT') {
                if (await element.isDisplayed() && !(await element.getAttribute('checked'))) await element.click(); 

            } else if (inputType == 'NAME INPUT') {
                if (await element.isDisplayed()) await element.sendKeys(uconfig.firstname); 

            } else if (inputType == 'SELECT INPUT' && await element.isDisplayed()) {
                // Select a dropdown option
                await element.click(); 
                await element.sendKeys(Key.ARROW_DOWN); 
                await element.click(); 
                
            } else if (inputType == 'SUBMIT INPUT') {
                if (await element.isDisplayed()) submitButton = element; 

            } 


        }
    }
    return submitButton;
}

// TODO: FIX 'element is not clickable at point... ' by arranging order of clicking/inputting
async function setNameFields() {

}



