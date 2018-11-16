"use strict"; 
require('chromedriver');
var webdriver = require("selenium-webdriver");

// Configuration 
let e = 'bomiwemara@daabox.com';
let firstname = 'Poopy';
let lastname = 'Face';

let sites = [
    'https://www.scientificamerican.com/page/newsletter-sign-up/'
    , 'https://www.sciencemag.org/subscribe/get-our-newsletters'
    , 'https://www.eurekalert.org/newsletter/'
    , 'https://www.nays.org/resources/more/free-e-newsletters/'
];

// XPATH EMAIL SELECTOR
let emailInputXPath = "//input[contains(translate(@name, 'EMAIL', 'email'),'email')]";

// XPATH FIRST NAME SELECTOR
let fnInputXP = "//input[contains(translate(@name, 'FIRSTNAME', 'firstname'),'firstname')"
                  +" or (contains(translate(@name, 'FNAME', 'fname'),'fname'))]";

// XPATH LAST NAME SELECTOR
let lnInputXP = "//input[contains(translate(@name, 'LASTNME', 'lastnme'),'lastname')"
                    +" or (contains(translate(@name, 'LNAME', 'lname'),'lname'))]";

// XPATH CHECKBOX SELECTOR
let cboxInputXP = "//input[@type='checkbox' and not (@checked)]";

// XPATH SELECT LIST SELECTOR
let countryInputSelectXP = "//select[contains(translate(@name, 'COUNTRY', 'country'),'country')]";
let countryInputOptionXP = `//option[
        @value='US' 
        or (contains(translate(@value, 'UNITED', 'united'), 'united')) 
    ]`;

// XPATH SUBMIT BUTTON SELECTOR
let submitXP = `//*[
        @type='submit' and 
        (
            (contains(translate(@value, 'SUBCRIE', 'subcrie'), 'subscribe')) 
            or (contains(translate(@name, 'SUBCRIE', 'subcrie'), 'subscribe'))
            or (contains(translate(text(), 'SUBCRIE', 'subcrie'), 'subscribe'))
            or (contains(translate(text(), 'SIGN', 'sign'), 'sign'))
            or (contains(translate(@id, 'SIGN', 'sign'), 'sign'))
        )
    ]`;


let driver = new webdriver.Builder().usingServer().withCapabilities({'browserName': 'chrome' }).build();
//let site = 'https://www.scientificamerican.com/page/newsletter-sign-up/';
//let site = 'https://www.sciencemag.org/subscribe/get-our-newsletters';
//let site = 'https://www.eurekalert.org/newsletter/';
//let site = 'https://www.sciencenewsforstudents.org/newsletter';
//let site = 'https://www.nays.org/resources/more/free-e-newsletters/';


sites.forEach(site => {

driver.get(site).then(x => {

    driver.sleep(550).then(y => {
        
        Promise.all([
            setElement(emailInputXPath, 'sendKeys', e)
            ,setElement(fnInputXP, 'sendKeys', firstname)
            ,setElement(lnInputXP, 'sendKeys', lastname)
            ,setElement(cboxInputXP, 'click', '')
            ,setElement(countryInputSelectXP, 'select', "United States")
            ,setElement(countryInputOptionXP, 'selectOption', null)
            , driver.sleep(2000)
        ]).then(y => {
            setElement(submitXP, 'submit', '').then(driver.sleep(2000));
        }).catch(err => {
            console.log('There was an error in one of the promises');
        })

    })

})

})




// Get applicable email elements and send keys 
function setElement(xPathSelector, actionToPerform, keys) {
    return driver.findElements(webdriver.By.xpath(xPathSelector)).then(elements => {
        console.log('Found: ' + elements.length + ' matching elements (' + actionToPerform + ')');
        elements.forEach(anElement => {
            Promise.all([anElement.isDisplayed(), anElement.isEnabled()]).then(results => {
                if (results[0] && results[1]) {
                    if (actionToPerform == 'sendKeys') anElement.sendKeys(keys);
                    else if (actionToPerform == 'click') console.log('clicking'), anElement.click();
                    else if (actionToPerform == 'select') console.log('selecting'), anElement.setSelectListValue(keys); // <option value="us"></option>
                    else if (actionToPerform == 'selectOption') console.log('selecting option'), anElement.click();
                    else if (actionToPerform == 'submit') console.log('submitting'), anElement.click();
                } 
            }).catch(err => {});
        });
    });
}

function setSelectListValue(xPathSelector) {
    driver.findElements(webdriver.By.xpath(xPathSelector)).then(elements => {
        elements.forEach(anElement => {
            anElement.click();
        })
    })
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