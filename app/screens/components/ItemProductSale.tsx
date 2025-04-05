import { Text } from '@rneui/themed';
import { Pressable, StyleSheet, View } from 'react-native';
import { IProductBasic } from '../../services/product/dto';

type IPropItemProductSale = {
  item: IProductBasic;
  choseItem: (item: IProductBasic) => void;
};

export const ItemProductSale = ({ item, choseItem }: IPropItemProductSale) => {
  return (
    <Pressable
      style={[
        styleItemProduct.container,
        {
          borderBottomWidth: 1,
          borderBottomColor: '#ccc'
        }
      ]}
      onPress={() => choseItem(item)}>
      <View style={{ gap: 8 }}>
        <Text>{item.tenHangHoa}</Text>
        <Text
          style={{
            color: 'green'
          }}>
          {item.maHangHoa}
        </Text>
      </View>
      <View style={{ gap: 8 }}>
        <Text
          style={{
            fontWeight: 500
          }}>
          {new Intl.NumberFormat('vi-VN').format(item.giaBan)}
        </Text>
      </View>
    </Pressable>
  );
};

const styleItemProduct = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
});
