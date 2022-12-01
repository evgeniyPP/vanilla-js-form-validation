const PRISTINE_CONFIG = {
  classTo: 'form__group',
  errorClass: 'form__group_invalid',
  successClass: 'form__group_valid',
  errorTextParent: 'form__group',
  errorTextTag: 'p',
  errorTextClass: 'form__error',
};

function handleInputValidation(validator) {
  return function (e) {
    if (e.target.dataset.dirty === 'true') {
      validator.validate(e.target);
      return;
    }

    e.target.onblur = () => {
      e.target.dataset.dirty = 'true';
      validator.validate(e.target);
    };
  };
}

function handleFormValidation(validator, { onSubmit, onError } = {}) {
  return function (e) {
    Array.from(e.target.elements)
      .filter(el => el.nodeName === 'INPUT')
      .forEach(el => {
        el.dataset.dirty = 'true';
      });

    const isValid = validator.validate();
    if (!isValid) {
      e.preventDefault();
      onError?.(e);
    }

    onSubmit?.(e);
  };
}

const myForm = document.querySelector('#form');
const myFormValidator = new Pristine(myForm, PRISTINE_CONFIG, false);

myForm.addEventListener('input', handleInputValidation(myFormValidator));
myForm.addEventListener('submit', handleFormValidation(myFormValidator));
