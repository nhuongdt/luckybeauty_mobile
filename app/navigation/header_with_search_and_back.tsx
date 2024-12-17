import {Icon, SearchBar} from '@rneui/base';
import {Pressable, View} from 'react-native';
import {IconType} from '../enum/IconType';
import {ListBottomTab} from '../enum/ListBottomTab';
import {Input} from '@rneui/themed';
import CommonFunc from '../utils/CommonFunc';
import {useState} from 'react';

type PropsHeaderWithSearchAndBack = {
  //   onPress: (typeAction: number) => void;
  navigation: any;
  route: any;
};
export const HeaderWithSearchAndBack = ({
  navigation,
  route,
}: PropsHeaderWithSearchAndBack) => {
  const [txtSearch, setTxtSearch] = useState('');

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: 'white',
        alignItems: 'baseline',
        paddingHorizontal: 16,
      }}>
      <Pressable
        onPress={() => {
          navigation.navigate('SaleNavigation', {
            screen: ListBottomTab.TEMP_INVOICE_DETAIL,
            params: {
              tongThanhToan: route.params?.tongThanhToan,
              idHoaDon: route.params?.idHoaDon,
            },
          });
        }}>
        <Icon name="arrow-back-ios" type={IconType.MATERIAL} size={20} />
      </Pressable>
      <Input
        placeholder="Tìm kiếm khách hàng"
        value={txtSearch}
        onChangeText={text => setTxtSearch(text)}
        leftIcon={
          <Icon name="search" size={18} color="black" type={IconType.IONICON} />
        }
        rightIcon={
          !CommonFunc.checkNull(txtSearch) ? (
            <Pressable
              onPress={() => {
                setTxtSearch('');
              }}>
              <Icon
                name="clear"
                size={18}
                color="black"
                type={IconType.MATERIAL}
              />
            </Pressable>
          ) : undefined
        }
      />
      {/* <SearchBar
        placeholder="Tìm kiếm khách hàng"
        // value={txtSearch}
        // onChangeText={text => setTxtSearch(text)}
        containerStyle={{
          borderTopWidth: 0,
          borderBottomColor: '#ccc',
          backgroundColor: 'white',
          padding: 0,
          marginLeft: 16,
          borderBottomWidth: 1,
          borderColor:' #ccc'
        }}
        inputStyle={{fontSize: 16}}
        inputContainerStyle={{backgroundColor: 'white'}}
      /> */}
    </View>
  );
};
