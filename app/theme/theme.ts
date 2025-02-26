import {createTheme} from '@rneui/themed';
// Định nghĩa theme sáng
export const lightTheme = createTheme({
  mode: 'light', // Chế độ sáng
  lightColors: {
    primary: 'black',
    background: '#ffffff'
  }
});
// Định nghĩa theme sáng
export const darkTheme = createTheme({
  mode: 'dark', // Chế độ tối
  darkColors: {
    primary: 'white',
    background: '#ffffff'
  }
});
