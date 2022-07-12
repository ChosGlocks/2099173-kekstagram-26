import { isTrue } from './util.js';

const imgUploadFormElement = document.querySelector('.img-upload__form');
const textDescriptionFormElement = document.querySelector('.text__description');
const textHashtagsFormElement = document.querySelector('.text__hashtags');

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

imgUploadFormElement.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const hashtags = textHashtagsFormElement.value.toLowerCase().split(' ');

  function validateHashtagsNumber() {
    return hashtags.length <= 5;
  }

  pristine.addValidator(
    textHashtagsFormElement,
    validateHashtagsNumber,
    'Не больше пяти хэштэгов');

  function validateHashtagsUniqueness() {
    const booleanValues = [];
    hashtags.sort();
    for (let j=0; j<hashtags.length; j++) {
      booleanValues.push(hashtags[j] !== hashtags[j + 1]);
    }
    return booleanValues.every(isTrue);
  }

  pristine.addValidator(
    textHashtagsFormElement,
    validateHashtagsUniqueness,
    'Хэштэги не должны повторяться');

  function validateHashtag() {
    const booleanValues = [];
    const re = /^#[A-Za-zА-Яа-яЁё0-9]{1,19}$||^\0/;
    for (let i=0; i<hashtags.length; i++) {
      booleanValues.push(re.test(hashtags[i]));
    }

    return booleanValues.every(isTrue);
  }

  pristine.addValidator(
    textHashtagsFormElement,
    validateHashtag,
    `Хэштэги должны разделяться пробелом, начинаться со знака решетки,
      состоять как минимум ещё из одного символа и не более чем
      из двадцати прописных и строчных латинских и русских букв и цифр`);

  pristine.validate();
});

export {textDescriptionFormElement};
export {textHashtagsFormElement};
