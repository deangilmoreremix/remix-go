const sweetAlert = (typeof window !== 'undefined' && typeof document !== 'undefined') ?
  require('sweetalert') : async () => {};

const closeFn = () => {
  sweetAlert.stopLoading();
  sweetAlert.close();
};

export function closeAlert() {
  if (sweetAlert.getState().isOpen) {
    closeFn();
  } else {
    setTimeout(closeFn);
  }
}

export function showError(text) {
  return sweetAlert({
    title: 'Error',
    text,
    icon: 'error',
  });
}

export function showInfo(text, title = 'Info') {
  return sweetAlert({
    title,
    text,
    icon: 'info',
  });
}

export function showProgress(text = 'Working...', title = 'Info') {
  return sweetAlert({
    title,
    text,
    buttons: false,
    closeOnClickOutside: false,
    closeOnEsc: false,
    icon: 'info',
  });
}

export function showConfirmation(text) {
  return sweetAlert({
    title: 'Are you sure?',
    text,
    icon: 'warning',
    buttons: true,
    dangerMode: true,
  });
}

export function promptString(text, buttonText = 'Ok') {
  return sweetAlert({
    text,
    content: 'input',
    button: {
      text: buttonText,
      closeModal: true,
    },
  });
}

export default {
  closeAlert,
  promptString,
  showConfirmation,
  showError,
  showInfo,
  showProgress,
};
