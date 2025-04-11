import Toast from 'react-native-toast-message';

export const showToast = ({ type, title, message }) => {
  Toast.show({
    type: type || 'success',
    text1: title,
    text2: message,
    position: 'bottom',
  });
};

export default Toast;