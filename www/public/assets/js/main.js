//Переключатель формы авторизации
let authFormSwitcherTrigger = document.querySelector('.js-switcher-trigger');

if (authFormSwitcherTrigger) {
    authFormSwitcherTrigger.addEventListener('click', function () {
        for (let child of this.children) {
            child.classList.toggle('active');
        }

        setTimeout(function () {
            let authForms =  document.querySelectorAll('.js-auth-form');

            if (authForms) {
                for (let authForm of authForms) {
                    authForm.classList.toggle('active');
                }
            }
        }, 200);
    });
}


//Переключатель видимости пароля
let authPasswordVisibleTriggers = document.querySelectorAll('.js-password-visible-trigger');

if (authPasswordVisibleTriggers) {
    for (let authPasswordVisibleTrigger of authPasswordVisibleTriggers) {
        authPasswordVisibleTrigger.addEventListener('click', function () {
            let authPasswordVisibleIcons = this.querySelectorAll('svg');

            if (authPasswordVisibleIcons) {
                for (let authPasswordVisibleIcon of authPasswordVisibleIcons) {
                    authPasswordVisibleIcon.classList.toggle('active');
                }
            }

            let authPasswordField = this.parentNode.querySelector('input');

            if (authPasswordField) {
                if (authPasswordField.type === 'password') {
                    authPasswordField.type = 'text'
                } else if (authPasswordField.type === 'text') {
                    authPasswordField.type = 'password'
                }
            }
        });
    }
}

//Отправка формы
let authForms =  document.querySelectorAll('.js-auth-form');

if (authForms) {
    for (let authForm of authForms) {
        authForm.addEventListener('submit', function (event) {
            event.preventDefault();

            let data = new FormData(authForm);
                data = Object.fromEntries(data.entries());
                data = JSON.stringify(data);

            let xmlhttp = new XMLHttpRequest();

            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                    let response = JSON.parse(xmlhttp.responseText);

                    let responseField = authForm.querySelector('.js-auth-form-response');

                    if (response || responseField) {
                        responseField.innerHTML = '<span style="color: green;">' + response['message'] + '</span>';
                    }
                } else if (xmlhttp.readyState === 4 && xmlhttp.status === 400) {
                    let response = JSON.parse(xmlhttp.responseText);

                    let responseField = authForm.querySelector('.js-auth-form-response');

                    if (response || responseField) {
                        responseField.innerHTML = '';

                        for (let message of response['messages']) {
                            responseField.insertAdjacentHTML('beforeend', '<span style="color: red;">' + message + '</span></br>');
                        }
                    }
                }
            }


            xmlhttp.open('POST', this.getAttribute('action'), true);

            xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

            xmlhttp.send(data);
        });
    }
}