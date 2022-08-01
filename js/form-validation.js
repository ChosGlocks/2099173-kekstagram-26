import { isTrue } from './util.js';
import { showAlert } from './util.js';
import { bodyElement } from './browse-photos.js';

const imgUploadFormElement = document.querySelector('.img-upload__form');
const textDescriptionFormElement = document.querySelector('.text__description');
const textHashtagsFormElement = document.querySelector('.text__hashtags');
const uploadSubmitButtonElement = document.querySelector('#upload-submit');
const succesMessageElement = document.querySelector('#success');
const newSuccessMessage = succesMessageElement.content.cloneNode(true);
const fragmentWithSuccessMessage = document.createDocumentFragment();
fragmentWithSuccessMessage.append(newSuccessMessage);
const errorMessageElement = document.querySelector('#error');
const newErrorMessage = errorMessageElement.content.cloneNode(true);
const fragmentWithErrorMessage = document.createDocumentFragment();
fragmentWithErrorMessage.append(newErrorMessage);

function disableUploadSubmitButton () {
  uploadSubmitButtonElement.disabled = true;
  uploadSubmitButtonElement.textContent = 'Опубликовываю';
}

function enableUploadSubmitButton () {
  uploadSubmitButtonElement.disabled = false;
  uploadSubmitButtonElement.textContent = 'Опубликовать';
}

const pristine = new Pristine(imgUploadFormElement, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'form-item__invalid',
  successClass: 'form-item__valid',
  errorTextParent: 'img-upload__field-wrapper',
  eroorTextTag: 'div',
  errorTextClass: 'form__error'
}, false);

function validateDescription(value) {
  return value.length <= 140;
}

pristine.addValidator(
  textDescriptionFormElement,
  validateDescription,
  'Длина описания фотографии должна быть не больше 140 символов');

function validateHashtagsNumber() {
  return textHashtagsFormElement.value.toLowerCase().split(' ').length <= 5;
}

pristine.addValidator(
  textHashtagsFormElement,
  validateHashtagsNumber,
  'Не больше пяти хэштэгов');

function validateHashtagsUniqueness() {
  const booleanValues = [];
  textHashtagsFormElement.value.toLowerCase().split(' ').sort();
  for (let j=0; j<textHashtagsFormElement.value.toLowerCase().split(' ').length; j++) {
    booleanValues.push(textHashtagsFormElement.value.toLowerCase().split(' ')[j] !== textHashtagsFormElement.value.toLowerCase().split(' ')[j + 1]);
  }
  return booleanValues.every(isTrue);
}

pristine.addValidator(
  textHashtagsFormElement,
  validateHashtagsUniqueness,
  'Хэштэги не должны повторяться');

function validateHashtag() {
  const booleanValues = [];
  const re = /^#[A-Za-zА-Яа-яЁё0-9]{1,19}$/;
  if (textHashtagsFormElement.value.length > 0) {
    for (let i=0; i<textHashtagsFormElement.value.toLowerCase().split(' ').length; i++) {
      booleanValues.push(re.test(textHashtagsFormElement.value.toLowerCase().split(' ')[i]));
    }
    return booleanValues.every(isTrue);
  } else {
    return true;
  }
}

pristine.addValidator(
  textHashtagsFormElement,
  validateHashtag,
  `Хэштэги должны разделяться пробелом, начинаться со знака решетки,
    состоять как минимум ещё из одного символа и не более чем
    из двадцати прописных и строчных латинских и русских букв или цифр`);

const setUserFormSubmit = (onSuccess) => {
  imgUploadFormElement.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const isValid = pristine.validate();

    if (isValid) {
      disableUploadSubmitButton();

      const formData = new FormData(evt.target);

      fetch(
        'https://26.javascript.pages.academ/kekstagram',
        {
          method: 'POST',
          body: formData,
        },
      )
        .then((responce) => {
          if (responce.ok) {
            disableUploadSubmitButton();
            onSuccess();
            enableUploadSubmitButton();
            bodyElement.append(fragmentWithSuccessMessage);
            const successButtonElement = document.querySelector('.success__button');
            successButtonElement.addEventListener('click', () => {
              bodyElement.remove(fragmentWithSuccessMessage);
              window.location.reload();
            });
          } else {
            showAlert ('Ошибка отправки формы');
            enableUploadSubmitButton();
            imgUploadFormElement.classList.add('hidden');
            bodyElement.append(fragmentWithErrorMessage);
            const errorButtonElement = document.querySelector('.error__button');
            errorButtonElement.addEventListener('click', () => {
              bodyElement.remove(fragmentWithErrorMessage);
              window.location.reload();
            });
          }
        })
        .catch(() => {
          showAlert ('Ошибка отправки формы');
          enableUploadSubmitButton();
          imgUploadFormElement.classList.add('hidden');
          bodyElement.append(fragmentWithErrorMessage);
          const errorButtonElement = document.querySelector('.error__button');
          errorButtonElement.addEventListener('click', () => {
            bodyElement.remove(fragmentWithErrorMessage);
            window.location.reload();
          });
        });
    }
  });
};

export {textDescriptionFormElement, textHashtagsFormElement, setUserFormSubmit};
