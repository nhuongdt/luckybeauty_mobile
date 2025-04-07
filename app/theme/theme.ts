import { createTheme } from '@rneui/themed';
// Định nghĩa theme sáng
export const lightTheme = createTheme({
  mode: 'light', // Chế độ sáng
  lightColors: {
    primary: '#628efc', // nút, liên kết, tiêu đề, rgb(49, 157, 255)
    secondary: '#e6ecfa', // màu phụ
    background: 'white', // Màu nền chính của toàn bộ ứng dụng hoặc các container
    grey5: '#f5f7fa'
  }
});
// Định nghĩa theme sáng
export const darkTheme = createTheme({
  mode: 'dark', // Chế độ tối
  darkColors: {
    primary: 'white',
    background: 'black'
  }
});
