import {Button} from 'react-native';
import {StyleSheet, View} from 'react-native';

export default function PageNotFound({navigation}: any) {
  return (
    <View>
      <Button
        title=" Go back to Home screen!"
        onPress={() => navigation.navigate('SaleNavigation', {screen: 'TempInvoice'})}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center'
  },

  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff'
  }
});
