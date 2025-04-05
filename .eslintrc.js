module.exports = {
  root: true,
  extends: ['@react-native', 'prettier'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn', // bật cảnh báo các biến không sử dụng
    'react/react-in-jsx-scope': 'off', // tắt cảnh báo cần 'React' trong phạm vi
    'react-native/no-inline-styles': 'off' // tắt cảnh báo  inline-styles
  }
};
