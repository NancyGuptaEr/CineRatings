// In this file, you must perform all client-side validation for every single form input (and the role dropdown) on your pages. The constraints for those fields are the same as they are for the data functions and routes. Using client-side JS, you will intercept the form's submit event when the form is submitted and If there is an error in the user's input or they are missing fields, you will not allow the form to submit to the server and will display an error on the page to the user informing them of what was incorrect or missing.  You must do this for ALL fields for the register form as well as the login form. If the form being submitted has all valid data, then you will allow it to submit to the server for processing. Don't forget to check that password and confirm password match on the registration form!
(function () {
    let emailAddressInput = document.getElementById('emailAddressInput');
    let passwordInput = document.getElementById('passwordInput');
    let loginForm = document.getElementById('login-form');
    let errorDiv = document.getElementById('client-side-error-div');
    if (loginForm) {
        emailAddressInput.addEventListener('focusin', () => {
            let emailInfo = document.getElementById('email-info');
            emailInfo.toggleAttribute('hidden');
        })
        emailAddressInput.addEventListener('focusout', () => {
            let emailInfo = document.getElementById('email-info');
            emailInfo.toggleAttribute('hidden');
        })
        passwordInput.addEventListener('focusin', () => {
            let passwordInfo = document.getElementById('password-info');
            passwordInfo.toggleAttribute('hidden');
        })
        passwordInput.addEventListener('focusout', () => {
            let passwordInfo = document.getElementById('password-info');
            passwordInfo.toggleAttribute('hidden');
        })
        loginForm.addEventListener('submit', (event) => {
            let errors = [];
            if (errorDiv) {
                errorDiv.innerHTML = "";
                errorDiv.hidden = true;
            }
            if (!emailAddressInput.value || emailAddressInput.value.trim().length === 0) {
                errors.push("Email address field must have a valid string and cannot contain only spaces.");
            }
            if (!passwordInput.value || passwordInput.value.trim().length === 0) {
                errors.push("Password field must have a valid string and cannot contain only spaces.");
            }
            let match;
            emailAddressInput.value = emailAddressInput.value.toLowerCase();
            if (emailAddressInput.value.match(/[a-zA-Z0-9]+([_.-][a-zA-Z0-9]+)*@[a-zA-Z0-9-]+[.]([a-zA-Z][a-zA-Z][a-zA-Z]*)/) !== null)
                match = emailAddressInput.value.match(/[a-zA-Z0-9]+([_.-][a-zA-Z0-9]+)*@[a-zA-Z0-9-]+[.]([a-zA-Z][a-zA-Z][a-zA-Z]*)/)[0];
            if (match === null || match !== emailAddressInput.value) {
                errors.push('Email address must be in a valid email format.');
            }
            if (passwordInput.value.length < 8) {
                errors.push(`Password must be at least 8 characters long.`);
            }
            if (passwordInput.value.match(/[A-Z]/g) === null) {
                errors.push(`Password must contain at least one uppercase character.`);
            }
            if (passwordInput.value.match(/[0-9]/g) === null) {
                errors.push(`Password must contain at least one number.`);
            }
            if (passwordInput.value.match(/[^A-Za-z0-9]/g) === null) {
                errors.push(`Password must contain at least one special character.`);
            }
            if (passwordInput.value.match(/\s/g) !== null) {
                errors.push(`Password cannot contain space.`);
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

