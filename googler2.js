/**
 * Perform a google search to retrieve pages to visit
 */
module.exports.getGoogleResults = async function(driver, By, Key, searchTerm) {

    let pagesToVisit = [];

    for (let i = 0; i < searchTerm.length; i++) {

        await driver.get('https://google.com');
        const inputElement = await driver.findElement(By.name('q'));
        await inputElement.sendKeys(searchTerm[i], Key.RETURN);

        
        let resultPages = [];

        let resultPageElements = await driver.findElements(By.xpath('//*[@id="nav"]/tbody/tr/*/a'));
        for (let k = 0; k < resultPageElements.length; k++) resultPages.push(await resultPageElements[k].getAttribute('href'));


        for (j = 0; j < resultPages.length; j++) {

            let searchResultElements = await driver.findElements(By.xpath('//*[@id="rso"]/div/div/*/div/div/*/a'));
            for (let i = 0; i < searchResultElements.length; i++) pagesToVisit.push(await searchResultElements[i].getAttribute('href'));
            await driver.get(resultPages[j]);
            
        }
    }

    return pagesToVisit;

}