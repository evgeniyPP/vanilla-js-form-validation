const myForm = document.querySelector('#form');
const myFormValidators = {
  username: validateUsername(5),
  email: validateEmail,
  password: validatePassword(6),
  passwordRepeat: validatePasswordRepeat,
  phone: validatePhone,
};
const myFormClassNames = {
  inputsContainer: 'form__inputs',
  input: 'form__input',
  inputInvalid: 'form__input_invalid',
  error: 'form__error',
};

enableValidation(myForm, myFormValidators, myFormClassNames);

/*-----------------------FUNCTIONS-----------------------*/
function enableValidation(form, validators, classNames) {
  const validate = (key, value, values) => {
    const validator = validators[key];
    return validator(value, values);
  };

  const getInputElement = key => {
    return form.querySelector(`.${classNames.input}[name=${key}]`);
  };

  const getErrorElement = key => {
    const inputsContainerEl = form.querySelector(`.${classNames.inputsContainer}`);
    return inputsContainerEl.querySelector(`.${classNames.error}[data-key=${key}]`);
  };

  const setError = (key, errorMessage) => {
    const input = getInputElement(key);
    input.classList.add(classNames.inputInvalid);

    let errorEl = getErrorElement(key);
    if (!errorEl) {
      errorEl = document.createElement('p');
      input.after(errorEl);
    }

    errorEl.textContent = errorMessage;
    errorEl.classList.add(classNames.error);
    errorEl.dataset.key = key;
  };

  const clearError = key => {
    const input = getInputElement(key);
    input.classList.remove(classNames.inputInvalid);

    let errorEl = getErrorElement(key);
    errorEl?.remove();
  };

  form.addEventListener('input', e => {
    const key = e.target.name;
    const value = e.target.value;
    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData);

    const error = validate(key, value, values);

    if (!error) {
      e.target.onblur = () => {
        e.target.dataset.dirty = 'true';
      };
      clearError(key);
      return; // функция останавливается
    }

    // есть ошибка
    if (e.target.dataset.dirty === 'true') {
      setError(key, error);
      return; // функция останавливается
    }

    // есть ошибка, но мы еще не ушли с поля
    e.target.onblur = () => {
      e.target.dataset.dirty = 'true';
      setError(key, error);
    };
  });

  form.addEventListener('submit', e => {
    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData);

    let isFormValid = true;

    formData.forEach((value, key) => {
      const error = validate(key, value, values);

      if (!error) {
        return; // функция останавливается
      }

      // есть ошибка
      setError(key, error);

      const input = getInputElement(key);
      input.dataset.dirty = 'true';

      isFormValid = false;
    });

    if (!isFormValid) {
      e.preventDefault();
      return; // функция останавливается
    }

    // форма валидна
    console.log('send request', values);
  });
}

/*-----------------------VALIDATORS-----------------------*/
function validateUsername(length) {
  return function (value) {
    if (!value) {
      return 'Введите имя пользователя';
    }

    if (value.length < length) {
      return `Имя пользователя должно быть не меньше ${length} символов`;
    }

    return null;
  };
}

function validateEmail(value) {
  const input = document.createElement('input');

  input.type = 'email';
  input.required = true;
  input.value = value;

  const isValid =
    typeof input.checkValidity === 'function' ? input.checkValidity() : /\S+@\S+\.\S+/.test(value);

  if (isValid) {
    return null;
  }

  return 'Введите корректный email';
}

function validatePassword(length) {
  return function (value) {
    if (!value) {
      return 'Введите пароль';
    }

    if (value.length < length) {
      return `Пароль должен быть не меньше ${length} символов`;
    }

    return null;
  };
}

function validatePasswordRepeat(value, values) {
  if (!values.password || !value) {
    return 'Введите пароль';
  }

  if (value !== values.password) {
    return 'Пароли не совпадают';
  }

  return null;
}

function validatePhone(value) {
  if (!value) {
    return 'Введите номер телефона';
  }

  if (!/^\d{11}$/.test(value)) {
    return 'Некорретный номер телефона';
  }

  return null;
}
