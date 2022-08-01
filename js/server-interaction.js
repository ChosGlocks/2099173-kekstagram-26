import { openPicture } from './browse-photos.js';
import { setUserFormSubmit } from './form-validation.js';
import { showThumbnails } from './thumbnails.js';
import { closeUploadForm } from './upload-form.js';
import { showAlert } from './util.js';


fetch('https://26.javascript.pages.academy/kekstagram/data')
  .then((response) => response.json())
  .then((objectsFromServer) => {
    showThumbnails(objectsFromServer);
    const smallPicturesElements = document.querySelectorAll('.picture');
    for (let i=0; i<smallPicturesElements.length; i++) {
      smallPicturesElements[i].addEventListener('click', () => {
        openPicture(objectsFromServer[i]);
      });
    }
  })
  .catch(() => {
    showAlert('Не удалось получить данные с сервера');
  });

setUserFormSubmit(closeUploadForm);


