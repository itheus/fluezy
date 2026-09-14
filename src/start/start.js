'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const openButton = document.getElementById('open-file');

  if (openButton) {
    openButton.addEventListener('click', () => {
      window.fluezy.openFile();
    });
  }
});
