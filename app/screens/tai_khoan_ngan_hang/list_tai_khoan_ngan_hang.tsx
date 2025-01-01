import {Input} from '@rneui/base';
import {SearchBar} from '@rneui/themed';
import {StyleSheet, View} from 'react-native';

export const ListTaiKhoanNganHang = () => {
  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Tìm kiếm"
        containerStyle={{
          paddingLeft: 16,
          paddingRight: 16,
          borderTopWidth: 0,
          paddingBottom: 0,
          backgroundColor: 'white',
        }}
        inputContainerStyle={{backgroundColor: 'white'}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    padding: 16,
  },
});
