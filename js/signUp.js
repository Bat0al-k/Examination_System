// ___________ correct version for sign up / in with local storage_______//
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('auth-form');
    const formContent = document.querySelector('.form-content');
    const title = document.querySelector('.title');
    const message = document.querySelector('.message');
    const submitBtn = document.querySelector('.submit');
    const signinLink = document.getElementById('signin-link');
    const fullnameInput = document.querySelector('.fullname-field .input');
    const emailInput = document.querySelector('.email-field .input');
    const passwordInput = document.querySelector('.password-field .input');
    const confirmInput = document.querySelector('.confirm-field .input');
    let isLoginMode = false;
    form.reset();

    // Toggle between Login and Register modes
    signinLink.addEventListener('click', function (e) {
        e.preventDefault();
        isLoginMode = !isLoginMode;
        formContent.classList.add('slide-up');
        setTimeout(() => {
            if (isLoginMode) {
                title.textContent = "Login";
                message.textContent = "Welcome back!";
                submitBtn.textContent = "Login";
                signinLink.innerHTML = 'Don\'t have an account? <a href="#">Sign up</a>';
                form.classList.add('login-mode');
                document.querySelector('.fullname-field').style.display = 'none';
                document.querySelector('.email-field').style.display = 'block';
                document.querySelector('.confirm-field').style.display = 'none';

                // show the last email & password
                const lastName = localStorage.getItem('User name');
                const lastEmail = localStorage.getItem('User Email');
                const lastPassword = localStorage.getItem('User Password');
                if (lastEmail && lastPassword) {
                    fullnameInput.value = lastName || '';
                    emailInput.value = lastEmail;
                    passwordInput.value = lastPassword;
                }
                // register switching
            } else {
                title.textContent = "Register";
                message.textContent = "Signup now and get the exam.";
                submitBtn.textContent = "Submit";
                signinLink.innerHTML = 'Already have an account? <a href="#">Sign in</a>';
                form.classList.remove('login-mode');
                document.querySelector('.fullname-field').style.display = 'block';
                fullnameInput.setAttribute('required', '');
                document.querySelector('.email-field').style.display = 'block';
                document.querySelector('.confirm-field').style.display = 'block';
                confirmInput.setAttribute('required', '');
            }
            formContent.classList.remove('slide-up');
            formContent.classList.add('slide-down');
            setTimeout(() => formContent.classList.remove('slide-down'), 50);
        }, 500);
    });

    // Submit button 
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        clearAllErrors();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const fullname = fullnameInput.value.trim();

        if (isLoginMode) {
            // Login
            const storedEmail = localStorage.getItem('User Email');
            const storedPassword = localStorage.getItem('User Password');

            if (email === storedEmail && password === storedPassword) {
                // alert('Login successful!');
                // window.
                window.location.href = '../html/home.html'; // redirect to another page
                form.reset();
            } else {
                // alert('Invalid email or password!');
                showError(emailInput, false, 'Invalid email or password');
                showError(passwordInput, false, 'Invalid email or password');
            }
        } else {
            // Register
            if (validateForm()) {
                if (localStorage.getItem('User Email') === email) {
                    showError(emailInput, false, 'This email is already registered');
                    return;
                }

                // saving data in local storage
                localStorage.setItem('User name', fullname);
                localStorage.setItem('User Email', email);
                localStorage.setItem('User Password', password);

                form.reset();
                clearAllErrors();

                // automatically switch to login mode
                isLoginMode = true;
                title.textContent = "Login";
                message.textContent = "Welcome back!";
                submitBtn.textContent = "Login";
                signinLink.innerHTML = 'Don\'t have an account? <a href="#">Sign up</a>';
                form.classList.add('login-mode');
                document.querySelector('.fullname-field').style.display = 'none';
                document.querySelector('.confirm-field').style.display = 'none';

                // fill the last email & password
                emailInput.value = email;
                passwordInput.value = password;
            }
        }
    });

    // Real-time validation
    if (fullnameInput) fullnameInput.addEventListener('input', validateFullname);
    emailInput.addEventListener('input', validateEmail);
    passwordInput.addEventListener('input', () => {
        validatePassword();
        if (confirmInput) validateConfirmPassword();
    });
    if (confirmInput) confirmInput.addEventListener('input', validateConfirmPassword);

    // Validation functions 
    function validateForm() {
        if (isLoginMode) {
            return validateEmail() & validatePassword();
        } else {
            return (
                validateFullname() &
                validateEmail() &
                validatePassword() &
                validateConfirmPassword()
            );
        }
    }

    function validateFullname() {
        const value = fullnameInput.value.trim();
        const isValid = /^[A-Za-z\s]{8,}$/.test(value);
        showError(fullnameInput, isValid, 'Full name must be at least 8 letters (a-z) with no numbers');
        return isValid;
    }

    function validateEmail() {
        const value = emailInput.value.trim();
        const isValid = /^[a-zA-Z0-9._%+-]{6,}@gmail\.com$/.test(value);
        showError(emailInput, isValid, 'Enter a valid Gmail (min 6 chars before @gmail.com)');
        return isValid;
    }

    function validatePassword() {
        const value = passwordInput.value.trim();
        const isValid = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,}$/.test(value);
        showError(passwordInput, isValid, 'Password needs 7+ chars with letters and numbers');
        return isValid;
    }

    function validateConfirmPassword() {
        const value = confirmInput.value.trim();
        const isValid = value === passwordInput.value.trim();
        showError(confirmInput, isValid, 'Passwords must match');
        return isValid;
    }

    function showError(input, isValid, message) {
        let errorElement = input.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            input.parentNode.appendChild(errorElement);
        }

        if (!isValid) {
            input.classList.add('error');
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        } else {
            input.classList.remove('error');
            errorElement.style.display = 'none';
        }
    }

    function clearAllErrors() {
        document.querySelectorAll('.input').forEach(input => {
            input.classList.remove('error');
            const error = input.parentNode.querySelector('.error-message');
            if (error) error.style.display = 'none';
        });
    }
});

