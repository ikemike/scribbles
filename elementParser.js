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
    //parsedElement.parentElement = document.getElementById(this.elementId).parentElement.nodeName;
    //console.log(parsedElement.parentElement);

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
    //if (parsedElement.typeOfElement != undefined) parsedElement.describe();
    return parsedElement;
};

class ParsedElement {

    describe() {
        console.log(`\

            ::${this.typeOfElement}::
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

        let elementTakesInput = this.elementHtmlTag == 'input' || this.elementHtmlTag == 'button' || this.elementHtmlTag == 'select';    

        let elementAcceptsText = this.elementType == 'text' || this.elementType == 'email';

        let checkboxElement = this.elementType == 'checkbox';

        let selectElement = this.elementHtmlTag == 'select';

        let emailElement = this.isGenericTypeOf('email');
        let nameElement = this.isGenericTypeOf('name');
        let firstNameElement = this.isGenericTypeOf('first');
        let lastNameElement = this.isGenericTypeOf('last');
        let phoneElement = this.isGenericTypeOf('phone');
        let zipcodeElement = this.isGenericTypeOf('zip');
        let streetElement = this.isGenericTypeOf('street') || this.isGenericTypeOf('address');
        let companyElement = this.isGenericTypeOf('company');
        let countryElement = selectElement && this.isGenericTypeOf('country');
        let stateElement = selectElement && this.isGenericTypeOf('state')

        let submitButtonElement = (this.isGenericTypeOf('subscribe') || this.isGenericTypeOf('sign') || this.isGenericTypeOf('join'))  
            && !this.elementOuterHtml.includes('unsubscribe');

        let genericSubmitButton = this.isGenericTypeOf('submit');
        
        if (elementTakesInput) {
            
            if (emailElement && elementAcceptsText) {
                this.typeOfElement = 'EMAIL INPUT';
            } else if (nameElement && elementAcceptsText) {
                this.typeOfElement = 'NAME INPUT';
            } else if (firstNameElement && elementAcceptsText) {
                this.typeOfElement = 'FIRSTNAME INPUT';
            } else if (lastNameElement && elementAcceptsText) {
                this.typeOfElement = 'LASTNAME INPUT';
            } else if (phoneElement) {
                this.typeOfElement = 'PHONE INPUT';
            } else if (zipcodeElement) {
                this.typeOfElement = 'ZIPCODE INPUT';
            } else if (streetElement) {
                this.typeOfElement = 'STREET INPUT'
            } else if (companyElement) {
                this.typeOfElement = 'COMPANY INPUT'
            } else if (checkboxElement) {
                this.typeOfElement = 'CHECKBOX INPUT';
            } else if (countryElement) {
                this.typeOfElement = 'COUNTRY SELECT INPUT';
            } else if (stateElement) {
                this.typeOfElement = 'STATE SELECT INPUT';
            } else if (selectElement && !countryElement && !stateElement) {
                this.typeOfElement = 'GENERIC SELECT INPUT';
            } else if (submitButtonElement) {
                this.typeOfElement = 'SUBMIT INPUT';
            } else if (genericSubmitButton) {
                this.typeOfElement = 'GENERIC SUBMIT INPUT';
            }
            
        }
    
    }

    // Returns true if: Placeholder, ElementId, ElementName include typeOf 
    isGenericTypeOf(typeOf) {
        return this.elementPlaceholder.includes(typeOf) || this.elementId.includes(typeOf) || this.elementName.includes(typeOf) || this.elementValue.includes(typeOf);
    }
}

