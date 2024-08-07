export function checkIsValid(dataPatterns, data) {
    let errors = {}
     dataPatterns.map(pattern => {
         if (!pattern.pattern.test(data[pattern.name])) {
             let fieldName = pattern.name.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
             errors[pattern.name] = `${fieldName} is invalid, fill proper ${fieldName}`;
         }
     })
    return errors;
}

export function validateFields(data, requiredFields) {
    let errors = {};
    requiredFields.map(field => {
        if (!data[field]) {
            let errorMsg = field.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
            errors[field] = `${errorMsg} is required`;
        }
    });
    return errors;
}

export function checkExpiryDate(data) {
    let errors = {};
    const todayDate = new Date();
    if (data['expiryDate']) {
        const expiryDate = new Date(data['expiryDate']);
        if (data['manufacturedDate']) {
            const manufactureDate = new Date(data['manufacturedDate']);
            if (manufactureDate > expiryDate)
                errors['expiryDate'] = 'expiry date must be after the manufacture Date';
            if (manufactureDate >= todayDate)
                errors['manufacturedDate'] = 'manufacture date must be present or past date';
        }
        if (todayDate > expiryDate)
            errors['expiryDate'] = 'expiry date must be after the today Date';
    }
    return errors;
}

export const FORMAT = {
    NAME: {name: 'name', pattern: /^[A-Za-z]{3,}$/},
    FIRST_NAME: {name: 'firstName', pattern: /^[A-Za-z]{3,}$/},
    MIDDLE_NAME: {name: 'middleName', pattern: /^[A-Za-z]{3,}$/},
    LAST_NAME: {name: 'lastName', pattern: /^[A-Za-z]{1,}$/},
    USER_NAME: {name: 'userName', pattern: /^[\w\s-]{3,}$/},
    EMAIL: {name: 'email', pattern: /^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.com$/},
    PASSWORD: {name: 'password', pattern: /^[A-Za-z0-9/s]{6,}$/},
    CONTACT_NUMBER: {name: 'contactNumber', pattern: /^[0-9]{10}$/},
    CONTACT: {name: 'contact', pattern: /^[0-9]{10}$/},
    CITY: {name: 'city', pattern: /^[A-Za-z/s]{3,}$/},
    PIN_CODE: {name: 'pinCode', pattern: /^[0-9]{6}$/},
    COMPANY_NAME: {name: 'companyName', pattern: /^[A-za-z0-9\s]{3,}$/},
    TIN_NO: {name: 'tinNumber', pattern: /^[0-9]{6}$/},
    DRUG_NAME: {name: 'drugName', pattern: /^[A-Za-z0-9\s]{3,}$/},
    USAGE_OF_DRUG: {name: 'usageOfDrug', pattern: /^[A-Za-z0-9\s]{3,}$/}
}