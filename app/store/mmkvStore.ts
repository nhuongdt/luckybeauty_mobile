import {MMKV} from 'react-native-mmkv';

export const mmkvStorage = new MMKV({
  id: 'userStore ',
  encryptionKey: 'ssoft2024_luckybeauty'
});
