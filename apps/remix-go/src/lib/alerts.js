import Swal from 'sweetalert2';

export function showError(message) {
  return Swal.fire({ icon: 'error', title: 'Error', text: message });
}

export function showSuccess(message) {
  return Swal.fire({ icon: 'success', title: 'Success', text: message });
}

export function showInfo(message, title = 'Info') {
  return Swal.fire({ icon: 'info', title, text: message });
}

export function showConfirmation(message) {
  return Swal.fire({
    icon: 'question',
    title: 'Confirm',
    text: message,
    showCancelButton: true,
    confirmButtonText: 'Yes',
  });
}

export function showProgress(message = 'Working...') {
  return Swal.fire({
    title: message,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => Swal.showLoading(),
  });
}

export function closeAlert() {
  Swal.close();
}

export function showToast(message, icon = 'info') {
  return Swal.fire({
    toast: true,
    position: 'top-end',
    icon,
    title: message,
    showConfirmButton: false,
    timer: 3000,
  });
}

export function promptInput(text, placeholder = '') {
  return Swal.fire({
    title: text,
    input: 'text',
    inputPlaceholder: placeholder,
    showCancelButton: true,
  });
}

export default {
  showError,
  showSuccess,
  showInfo,
  showConfirmation,
  showProgress,
  closeAlert,
  showToast,
  promptInput,
};
