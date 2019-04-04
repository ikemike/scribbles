/**
 * Retrieve specific element attributes - possibly to identify the type of element 
 */
module.exports.parseElement = async function (e) { 
    let parsedElement = new ParsedElement();

    // TODO: implement a way to identify the parent form
    parsedElement.element = await e;
    parsedElement.elementValue = await e.getAttribute('value');
    parsedElement.elementOuterHtml = await e.getAttribute('outerHTML');
    parsedElement.elementId = await e.getAttribute('id');
    parsedElement.elementPlaceholder = await e.getAttribute('placeholder');
    parsedElement.elementType = await e.getAttribute('type');
    parsedElement.elementHtmlTag = await e.getAttribute('tagName');
    parsedElement.elementName = await e.getAttribute('name');
    parsedElement.elementInnerText = await e.getText();

    // Convert everything to lower case 
    parsedElement.elementValue = parsedElement.elementValue != null ? parsedElement.elementValue.toLowerCase() : '';
    parsedElement.elementOuterHtml = parsedElement.elementOuterHtml != null ? parsedElement.elementOuterHtml.toLowerCase(): '';
    parsedElement.elementId = parsedElement.elementId != null ? parsedElement.elementId.toLowerCase() : '';
    parsedElement.elementPlaceholder = parsedElement.elementPlaceholder != null ? parsedElement.elementPlaceholder.toLowerCase() : '';
    parsedElement.elementType = parsedElement.elementType != null ? parsedElement.elementType.toLowerCase() : '';
    parsedElement.elementHtmlTag = parsedElement.elementHtmlTag != null ? parsedElement.elementHtmlTag.toLowerCase() : '';
    parsedElement.elementName = parsedElement.elementName != null ? parsedElement.elementName.toLowerCase() : '';
    parsedElement.elementInnerText = parsedElement.elementInnerText != null ? parsedElement.elementInnerText.toLowerCase() : '';

    parsedElement.getType();
    //parsedElement.describe();
    return parsedElement;
};

class ParsedElement {

    describe() {
        // May want to redesign to analyze only outer html for starters
        //console.log(this.elementOuterHtml);
        
        console.log(`\
            ${this.elementHtmlTag} Type: ${this.elementType} Id: ${this.elementId}\
            ${(this.elementName != '' ? 'Name:' + this.elementName : '')}\
            ${(this.elementValue != '' ? 'Value:' + this.elementValue : '')}\
            ${(this.elementPlaceholder != '' ? 'Placeholder:' + this.elementPlaceholder : '')}\
            ${(this.elementInnerText != '' ? 'Inner Text:' + this.elementInnerText : '')}\
        `);
        
    }

    getType() {
        // Alternative way to check contains on multiple string values 
        //let emailTexts = ['email','e-mail'];
        //let elementContainsWordEmail = emailTexts.some(txt => this.elementPlaceholder.includes(txt));

        let elementTakesInput = this.elementHtmlTag == 'input' || this.elementHtmlTag == 'button' || this.elementHtmlTag == 'select' ;      
        let elementAcceptsText = this.elementType == 'text' || this.elementType == 'email';
        let checkboxElement = this.elementType == 'checkbox';
        let emailElement = this.elementPlaceholder.includes('email') || this.elementId.includes('email') || this.elementName.includes('email');              
        let nameElement = this.elementPlaceholder.includes('name') || this.elementId.includes('name') || this.elementName.includes('name'); 
        let selectElement = this.elementHtmlTag == 'select';
        let submitButtonElement = this.elementId.includes('subscribe') || this.elementName.includes('subscribe') || this.elementOuterHtml.includes('signup');
        
        if (elementTakesInput) {
            
            if (emailElement && elementAcceptsText) {
                this.typeOfElement = 'EMAIL INPUT';
            } else if (nameElement && elementAcceptsText) {
                this.typeOfElement = 'NAME INPUT';
            } else if (submitButtonElement) {
                this.typeOfElement = 'SUBMIT INPUT';
            } else if (checkboxElement) {
                this.typeOfElement = 'CHECKBOX INPUT';
            } else if (selectElement) {
                this.typeOfElement = 'SELECT INPUT';
            }
            
        }
    
    }
}

