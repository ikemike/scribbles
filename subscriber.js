//"use strict"; 
require('chromedriver');
var webdriver = require("selenium-webdriver");

// Configuration 
let e = 'dangles@inboxbear.com';
let firstname = 'Jacob';
let lastname = 'Farttington';

let sites = [
    'https://www.scientificamerican.com/page/newsletter-sign-up/'
    , 'https://www.sciencemag.org/subscribe/get-our-newsletters'
    , 'https://www.eurekalert.org/newsletter/'
    , 'https://www.nays.org/resources/more/free-e-newsletters/'
    , 'https://shop.motorsportmagazine.com/site/SignupForm'
    , 'http://www.sportsnetworker.com/newsletter/'
    , 'https://www.sbnation.com/pages/newsletters'
    , 'https://nielsensports.com/newsletter-subscription/'
    , 'https://collegesport.org.nz/sign-up-to-our-newsletter/'
    , 'https://www.barstoolsports.com/newsletter'
    ,'https://www.eatthis.com/newsletter-signup-confirmation/'
    ,'https://247sports.com/Distribution/247Sports-Newsletter-100956/SignUp/'  
    , 'https://www.actionnetwork.com/newsletter'   
    , 'https://daily.fansided.com/' 
    , 'http://joefavorito.com/contact-me/newsletter-signup/'        
    , 'https://www.sportbirmingham.org/newsletter-sign-up',
    , 'http://www.sahlensportspark.com/about/news/SSPNewsletterSignup'
    , 'https://www.houstonchronicle.com/sports/texas-sports-nation/daily-playbook-newsletter/'   
    
];

let confirmedSites = [
    'https://247sports.com/Distribution/247Sports-Newsletter-100956/SignUp/'  
    , 'https://www.actionnetwork.com/newsletter'   
    , 'https://daily.fansided.com/' 
    , 'http://joefavorito.com/contact-me/newsletter-signup/'        
    , 'https://www.sportbirmingham.org/newsletter-sign-up',
    , 'http://www.sahlensportspark.com/about/news/SSPNewsletterSignup'
    , 'https://www.houstonchronicle.com/sports/texas-sports-nation/daily-playbook-newsletter/'                    
]

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


let driver = new webdriver.Builder().usingServer().withCapabilities({'browserName': 'chrome' }).build();

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

//doCheck( testSites, 0 );




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