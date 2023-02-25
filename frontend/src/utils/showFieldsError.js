import { toast } from 'react-toastify';

const showFieldsError = () => {
  toast.error('😭 Please enter all field(s)', {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
  });
};

export default showFieldsError;
