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
        
    
    //let pagesToVisit = await googler.getGoogleResults(driver, By, Key, uconfig.search_term);
    //await visitWebsites(pagesToVisit);
    await visitWebsites(['https://nielsensports.com/newsletter-subscription/']);

}

async function visitWebsites(websitesToVisit) {
    for (let i = 0; i < websitesToVisit.length; i++) {
        await driver.get(websitesToVisit[i]);

        let parsedPageElements = await parsePageElements();
    
        try {
            let submitButton = await setElements(parsedPageElements);
            console.log('done setting elements!');

            if (submitButton != undefined) {
                driver.executeScript("arguments[0].scrollIntoView(false)", submitButton);
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

        // (TODO) Save the element's parent node to evaluate which form to process
        let parentNode = await driver.executeScript('return arguments[0].parentNode', elements[i]);
        let parentNodeName = await driver.executeScript('return arguments[0].nodeName', parentNode);
        if (parentNodeName == 'FORM') {
            let parentNodeId = await driver.executeScript('return arguments[0].name', parentNode);
            let action = await driver.executeScript("return arguments[0].getAttribute('action')", parentNode);
        }

    }
    return parsedElements;
}

// Set each elements value based on what type of element it is - return a submit button 
async function setElements(parsedPageElements) {

    let submitButton = undefined;
    let genericSubmitButton = undefined;
    for (let i = 0; i < parsedPageElements.length; i++) {

        let inputType = parsedPageElements[i].typeOfElement;
        let element = parsedPageElements[i].element;

        if (inputType != undefined && await element.isDisplayed()) {

            switch(inputType) {
                case 'EMAIL INPUT':
                    await element.sendKeys(uconfig.email); 
                    break;
                case 'CHECKBOX INPUT' && !await element.getAttribute('checked'):
                    await element.click();
                    break;
                case 'NAME INPUT':
                    await element.sendKeys(uconfig.firstname); 
                    break;
                case 'FIRSTNAME INPUT':
                    await element.sendKeys(uconfig.firstname); 
                    break;
                case 'LASTNAME INPUT':
                    await element.sendKeys(uconfig.lastname); 
                    break;
                case 'COMPANY INPUT':
                    await element.sendKeys(uconfig.company); 
                    break;
                case 'STREET INPUT':
                    await element.sendKeys(uconfig.street); 
                    break;
                case 'ZIPCODE INPUT':
                    await element.sendKeys(uconfig.zipcode); 
                    break;
                case 'PHONE INPUT':
                    await element.sendKeys(uconfig.phone); 
                    break;
                case 'GENERIC SELECT INPUT':
                    await element.click(); 
                    await element.sendKeys(Key.ARROW_DOWN); 
                    await element.click(); 
                    break;
                case 'COUNTRY SELECT INPUT':
                    await element.sendKeys(uconfig.country); 
                    break;
                case 'STATE SELECT INPUT':
                    await element.sendKeys(uconfig.state); 
                    break;
                case 'SUBMIT INPUT':
                    submitButton = element; 
                    break;
                case 'GENERIC SUBMIT INPUT':
                    genericSubmitButton = element; 
                    break;
                    
            }
        
            /*
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
            */


        }
    }

    // Return a submit button to submit the form
    if (submitButton != undefined) {
        return submitButton;
    } else {
        return genericSubmitButton;
    }
}

// TODO: FIX 'element is not clickable at point... ' by arranging order of clicking/inputting
async function setNameFields() {

}



