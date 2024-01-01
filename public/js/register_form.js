// In this file, you must perform all client-side validation for every single form input (and the role dropdown) on your pages. The constraints for those fields are the same as they are for the data functions and routes. Using client-side JS, you will intercept the form's submit event when the form is submitted and If there is an error in the user's input or they are missing fields, you will not allow the form to submit to the server and will display an error on the page to the user informing them of what was incorrect or missing.  You must do this for ALL fields for the register form as well as the login form. If the form being submitted has all valid data, then you will allow it to submit to the server for processing. Don't forget to check that password and confirm password match on the registration form!
(function () {
    let emailAddressInput = document.getElementById('emailAddressInput');
    let passwordInput = document.getElementById('passwordInput');
    let confirmPasswordInput = document.getElementById('confirmPasswordInput');
    let roleInput = document.getElementById('roleInput');
    let ageInput = document.getElementById('ageInput');
    let preferGenreInput = document.getElementById('preferGenreInput');
    let preferGenreLabel = document.getElementById('preferGenreLabel');
    let preferContentInput = document.getElementById('preferContentInput');
    let preferContentLabel = document.getElementById('preferContentLabel')
    let registerForm = document.getElementById('registration-form');
    let errorDiv = document.getElementById('client-side-error-div');
    if (registerForm) {
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
        preferGenreInput.hidden = true;
        preferGenreLabel.hidden = true;
        preferContentInput.hidden = true;
        preferContentLabel.hidden = true;
        roleInput.addEventListener('click', () => {
            if (roleInput.value === 'user') {
                preferGenreInput.hidden = false;
                preferGenreLabel.hidden = false;
            }
            else {
                preferGenreInput.hidden = true;
                preferGenreLabel.hidden = true;
            }
            if (roleInput.value === 'user') {
                preferContentInput.hidden = false;
                preferContentLabel.hidden = false;
            }
            else {
                preferContentInput.hidden = true;
                preferContentLabel.hidden = true;
            }
        })
        ageInput.addEventListener('focusin', () => {
            let ageInfo = document.getElementById('age-info');
            ageInfo.toggleAttribute('hidden');
        })
        ageInput.addEventListener('focusout', () => {
            let ageInfo = document.getElementById('age-info');
            ageInfo.toggleAttribute('hidden');
        })
        confirmPasswordInput.addEventListener('focusin', () => {
            let confirmpasswordInfo = document.getElementById('confirmpassword-info');
            confirmpasswordInfo.toggleAttribute('hidden');
        })
        confirmPasswordInput.addEventListener('focusout', () => {
            let confirmpasswordInfo = document.getElementById('confirmpassword-info');
            confirmpasswordInfo.toggleAttribute('hidden');
        })
        roleInput.addEventListener('focusin', () => {
            let roleInfo = document.getElementById('role-info');
            roleInfo.toggleAttribute('hidden');
        })
        roleInput.addEventListener('focusout', () => {
            let roleInfo = document.getElementById('role-info');
            roleInfo.toggleAttribute('hidden');
        })
        preferGenreInput.addEventListener('focusin', () => {
            let genreInfo = document.getElementById('genre-info');
            genreInfo.toggleAttribute('hidden');
        })
        preferGenreInput.addEventListener('focusout', () => {
            let genreInfo = document.getElementById('genre-info');
            genreInfo.toggleAttribute('hidden');
        })
        preferContentInput.addEventListener('focusout', () => {
            let contentInfo = document.getElementById('content-info');
            contentInfo.toggleAttribute('hidden');
        })
        registerForm.addEventListener('submit', (event) => {
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
            if (!confirmPasswordInput.value || confirmPasswordInput.value.trim().length === 0) {
                errors.push("Confirm password field must have a valid string and cannot contain only spaces.");
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
                    if(!preferContentInput.value || preferContentInput.value.trim().length === 0){
                        errors.push("You must select an option for prefer content.");
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
            if (confirmPasswordInput.value.length < 8) {
                errors.push(`Confirm password must be at least 8 characters long.`);
            }
            if (confirmPasswordInput.value.match(/[A-Z]/g) === null) {
                errors.push(`Confirm password must contain at least one uppercase character.`);
            }
            if (confirmPasswordInput.value.match(/[0-9]/g) === null) {
                errors.push(`Confirm password must contain at least one number.`);
            }
            if (confirmPasswordInput.value.match(/[^A-Za-z0-9]/g) === null) {
                errors.push(`Confirm password must contain at least one special character.`);
            }
            if (confirmPasswordInput.value.match(/\s/g) !== null) {
                errors.push(`Confirm password cannot contain space.`);
            }
            if (passwordInput.value.trim() !== confirmPasswordInput.value.trim()) {
                errors.push(`Values in password and confirm password field do not match.`);
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

