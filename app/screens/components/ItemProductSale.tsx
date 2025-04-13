import { Text, useTheme } from '@rneui/themed';
import { Pressable, StyleSheet, View } from 'react-native';
import { IProductBasic } from '../../services/product/dto';
import { CheckBox, Theme } from '@rneui/base';

type IPropItemProductSale = {
  item: IProductBasic;
  isShowCheck?: boolean;
  isChosed?: boolean;
  choseItem: (item: IProductBasic) => void;
};

export const ItemProductSale = ({ item, isShowCheck, isChosed, choseItem }: IPropItemProductSale) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  return (
    <Pressable style={[styles.flexRow, styles.container]} onPress={() => choseItem(item)}>
      <View style={[styles.flexRow, styles.contentItem]}>
        <View style={{ gap: 8 }}>
          <Text>{item.tenHangHoa}</Text>
          <Text
            style={{
              color: theme.colors.success
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
      </View>
      {isShowCheck && (
        <CheckBox
          checked={isChosed ?? false}
          containerStyle={{ margin: 0, padding: 0 }}
          onPress={() => choseItem(item)}
        />
      )}
    </Pressable>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    flexRow: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    container: {
      padding: 8,
      borderBottomColor: theme.colors.greyOutline
    },
    contentItem: {
      flex: 1,
      justifyContent: 'space-between'
    }
  });
