require('chromedriver');
const chrome = require('selenium-webdriver/chrome');
var webdriver = require("selenium-webdriver");
let driver = new webdriver.Builder()
.usingServer()
.withCapabilities({'browserName': 'chrome' })
//.setChromeOptions(new chrome.Options().headless())
.build();



// Step 1: Perform a google search

let loadGoogle = new Promise(function(resolve, reject) {
    driver.get('http://www.google.com').then(driver.sleep(1000)).then(x => {
        var element = driver.findElement(webdriver.By.name('q'));
        element.sendKeys(searchTerm).then(driver.sleep(250)).then(y => {
            resolve();
        });
        
    })
})
    
    
// Step 2: Save the google result URLs to an array 

let getSearchResults = new Promise(function(resolve, reject) {
    let searchResults = [];
    loadGoogle.then(x => {
        console.log('Finshed Loading Google');
       
        // Get the page hrefs and push them to the array
        driver.findElements(webdriver.By.xpath('//*[@id="rso"]/div/div/*/div/div/*/a')).then(elements => {
            elements.forEach(  elem => searchResults.push(elem.getAttribute('href'))  )

        }).then(done => {
            // Need to call a .then after the elements are loaded (otherwise you get a promise)
            resolve(searchResults);
        })
    })
})

let getPageHrefs = new Promise(function(resolve, reject) {
    let results = [];
    driver.findElements(webdriver.By.xpath('//*[@id="rso"]/div/div/*/div/div/*/a')).then(elements => {
        elements.forEach(elem => results.push(elem.getAttribute('href')))
    }).then(done => {
        resolve(results);
    })
})

// Step 3: Perform form submissions

let searchTerm = '';
searchTerm = 'Bible Camp Newsletter Subscribe\n';
getSearchResults.then(x => {
    Promise.all(x).then(res => {
        console.log(res);
        doCheck(res, 0);
        //driver.quit();
    })
})



/* SUBSCRIBER METHODS BELOW: */

// Configuration 
let e = 'stistohufr@wemel.site';
let firstname = 'Jingle';
let lastname = 'Farttington';

// XPATH EMAIL SELECTOR
let emailInputXPath = `//input[ 
                (
                    (contains(translate(@name, 'EMAIL', 'email'),'email'))
                    or (contains(translate(@class, 'SIGNUP', 'signup'), 'signup'))
                    or (contains(translate(@placeholder, 'EMAIL', 'email'), 'email'))
                )
            ]`;

// XPATH FIRST NAME SELECTOR
let fnInputXP = "//input[contains(translate(@name, 'FIRSTNAME', 'firstname'),'firstname')"
                  +" or (contains(translate(@name, 'FNAME', 'fname'),'fname'))"
                  +" or (contains(translate(@name, 'name', 'name'),'name'))]";

// XPATH LAST NAME SELECTOR
let lnInputXP = "//input[contains(translate(@name, 'LASTNME', 'lastnme'),'lastname')"
                    +" or (contains(translate(@name, 'LNAME', 'lname'),'lname'))]";

// XPATH CHECKBOX SELECTOR
let cboxInputXP = `//*[
    (@type='checkbox' and not (@checked)) 
    or (contains(translate(@for, 'CHECKBOX', 'checkbox'),'checkbox'))
]`;
//input[@type='checkbox' and not (@checked)]";

// XPATH SELECT LIST SELECTOR
let countryInputSelectXP = "//select[contains(translate(@name, 'COUNTRY', 'country'),'country')]";
let countryInputOptionXP = `//option[
        @value='US' 
        or (contains(translate(@value, 'UNITED', 'united'), 'united')) 
        or (contains(translate(@value, 'US', 'us'), 'us'))
    ]`;

// XPATH SUBMIT BUTTON SELECTOR
let submitInputXP = `//*[
        @type='submit' and 
        (
            (contains(translate(@value, 'SUBCRIE', 'subcrie'), 'subscribe')) 
            or (contains(translate(@name, 'SUBCRIE', 'subcrie'), 'subscribe'))
            or (contains(translate(text(), 'SUBCRIE', 'subcrie'), 'subscribe'))
            or (contains(translate(text(), 'SIGN', 'sign'), 'sign'))
            or (contains(translate(@id, 'SIGN', 'sign'), 'sign'))
            or (contains(translate(@class, 'SIGN', 'sign'), 'sign'))
            or (contains(translate(@value, 'SIGN', 'sign'), 'sign'))
            or (contains(translate(@value, 'CONTINUE', 'continue'), 'continue')) 
            or (contains(translate(@value, 'SEND', 'send'), 'send')) 
            or (contains(translate(@value, 'SUBMIT', 'submit'), 'submit')) 
        )
    ]`;
let submitButtonXP= `//*[
        (contains(translate(@value, 'SUBCRIE', 'subcrie'), 'subscribe')) 
        or (contains(translate(@name, 'SUBCRIE', 'subcrie'), 'subscribe'))
        or (contains(translate(text(), 'SUBCRIE', 'subcrie'), 'subscribe'))
        or (contains(translate(text(), 'SIGN', 'sign'), 'sign'))
        or (contains(translate(@id, 'SIGN', 'sign'), 'sign'))
        or (contains(translate(@class, 'SIGN', 'sign'), 'sign'))
        or (contains(translate(@value, 'SIGN', 'sign'), 'sign'))
]`;

function doCheck( sites, index ) {
    driver.get(sites[index]).then(x => { 
        driver.sleep(1000).then(y => {
            console.log('Done Sleeping - Now Sending Keys');
            Promise.all([
                setElement(emailInputXPath, 'sendKeys', e)
                ,setElement(fnInputXP, 'sendKeys', firstname)
                ,setElement(lnInputXP, 'sendKeys', lastname)
                ,setElement(cboxInputXP, 'click', '')
                ,setElement(countryInputSelectXP, 'select', "United States")
                ,setElement(countryInputOptionXP, 'selectOption', null)
                ,driver.sleep(2000)
            ]).then(z => {
                console.log('Done! Submitting Now');
                Promise.all([
                    setElement(submitInputXP, 'submit', '').then(driver.sleep(250).then(setElement(submitButtonXP, 'submit', '')))
                    //, setElement(submitButtonXP, 'submit', '')
                    , driver.sleep(1000)
                ]).then(zzz => {
                    if (sites.indexOf(sites[index+1]) !== -1) doCheck(sites, index+1);
                })
            }).catch(err => {
                console.log('There was an error in one of the promises');
            })
        })
    })  
}

// Get applicable email elements and send keys 
function setElement(xPathSelector, actionToPerform, keys) {
    return driver.findElements(webdriver.By.xpath(xPathSelector)).then(elements => {
        console.log('Found: ' + elements.length + ' matching elements (' + actionToPerform + ')');
        elements.forEach(anElement => {
            Promise.all([anElement.isDisplayed(), anElement.isEnabled()]).then(results => {
                if (results[0] && results[1]) {
                    if (actionToPerform == 'sendKeys') anElement.sendKeys(keys);
                    else if (actionToPerform == 'click') console.log('clicking'), anElement.click().catch(err => {});
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