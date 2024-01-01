// In this file, you must perform all client-side validation for every single form input (and the role dropdown) on your pages. The constraints for those fields are the same as they are for the data functions and routes. Using client-side JS, you will intercept the form's submit event when the form is submitted and If there is an error in the user's input or they are missing fields, you will not allow the form to submit to the server and will display an error on the page to the user informing them of what was incorrect or missing.  You must do this for ALL fields for the register form as well as the login form. If the form being submitted has all valid data, then you will allow it to submit to the server for processing. Don't forget to check that password and confirm password match on the registration form!
(function () {
    let emailAddressInput = document.getElementById('emailAddressInput');
    let roleInput = document.getElementById('roleInput');
    let ageInput = document.getElementById('ageInput');
    let preferGenreInput = document.getElementById('preferGenreInput');
    let preferContentInput = document.getElementById('preferContentInput');
    let userForm = document.getElementById('userinfo-form')
    let errorDiv = document.getElementById('client-side-error-div');
    if (userForm) {
        emailAddressInput.addEventListener('focusin', () => {
            let emailInfo = document.getElementById('email-info');
            emailInfo.toggleAttribute('hidden');
        })
        emailAddressInput.addEventListener('focusout', () => {
            let emailInfo = document.getElementById('email-info');
            emailInfo.toggleAttribute('hidden');
        })
        preferGenreInput.addEventListener('focusin', () => {
            let genreInfo = document.getElementById('genre-info');
            genreInfo.toggleAttribute('hidden');
        })
        preferGenreInput.addEventListener('focusout', () => {
            let genreInfo = document.getElementById('genre-info');
            genreInfo.toggleAttribute('hidden');
        })
        preferContentInput.addEventListener('focusin', () => {
            let contentInfo = document.getElementById('content-info');
            contentInfo.toggleAttribute('hidden');
        })
        preferContentInput.addEventListener('focusout', () => {
            let contentInfo = document.getElementById('content-info');
            contentInfo.toggleAttribute('hidden');
        })
        userForm.addEventListener('submit', (event) => {
            let errors = [];
            if (errorDiv) {
                errorDiv.innerHTML = "";
                errorDiv.hidden = true;
            }
            if (!emailAddressInput.value || emailAddressInput.value.trim().length === 0) {
                errors.push("Email address field must have a valid string and cannot contain only spaces.");
            }
            if (!roleInput.value || roleInput.value.trim().length === 0) {
                errors.push("You must select a value for role.");
            }
            if (!ageInput.value || ageInput.value.trim().length === 0) {
                errors.push("You must select a value for age.");
            }
            if (roleInput.value) {
                if (roleInput.value.trim().toLowerCase() === 'user') {
                    if (!preferGenreInput.value || preferGenreInput.value.trim().length === 0) {
                        errors.push("You must select a value for prefer genre.");
                    }
                }
            }
            let match;
            emailAddressInput.value = emailAddressInput.value.toLowerCase();
            if (emailAddressInput.value.match(/[a-zA-Z0-9]+([_.-][a-zA-Z0-9]+)*@[a-zA-Z0-9-]+[.]([a-zA-Z][a-zA-Z][a-zA-Z]*)/) !== null)
                match = emailAddressInput.value.match(/[a-zA-Z0-9]+([_.-][a-zA-Z0-9]+)*@[a-zA-Z0-9-]+[.]([a-zA-Z][a-zA-Z][a-zA-Z]*)/)[0];
            if (match === null || match !== emailAddressInput.value) {
                errors.push('Email address must be in a valid email format.');
            }
            ageInput.value = ageInput.value.trim();
            if (ageInput.value.match(/[0-9][0-9]*/) === null) {
                errors.push('Age must be a positive whole number greater than or equal to 18 and less than or equal to 100.');
            }
            ageInput.value = parseInt(ageInput.value);
            if (ageInput.value < 18 || ageInput.value > 100) {
                errors.push(`Age must be between 18 and 100.`);
            }
            roleInput.value = roleInput.value.toLowerCase();
            if (roleInput.value !== 'admin' && roleInput.value !== 'user') {
                errors.push(`Role can either have admin or user as its value.`);
            }
            if (errors.length > 0) {
                event.preventDefault();
                let errorList = document.createElement('ul');
                errorList.classList.add('error');
                for (let x = 0; x < errors.length; x++) {
                    let errorli = document.createElement('li');
                    errorli.innerHTML = errors[x];
                    errorList.appendChild(errorli);
                }
                errorDiv.appendChild(errorList);
                errorDiv.hidden = false;
            }
        })
    }
})();

