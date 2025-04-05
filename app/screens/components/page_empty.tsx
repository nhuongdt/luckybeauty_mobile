import { StyleSheet, View } from 'react-native';

export function PageEmpty() {
  return <View style={styles.container}></View>;
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1
  }
});
