import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ListBottomTab} from '../../enum/ListBottomTab';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import Realm from 'realm';
import realmDatabase from '../../store/realm/database';
import {FlatList, Modal, StyleSheet, View} from 'react-native';
import {useEffect, useRef, useState} from 'react';
import realmQuery from '../../store/realm/realmQuery';
import KhachHangService from '../../services/customer/KhachHangService';
import {IPagedKhachHangRequestDto} from '../../services/customer/IPagedKhachHangRequestDto';
import {IKhachHangItemDto} from '../../services/customer/IKhachHangItemDto';
import {CustomerItem} from './customer_item';
import {SearchBar} from '@rneui/base';
import {RootStackParamList} from '../../type/RootStackParamList';
import {ListRouteApp} from '../../enum/ListRouteApp';
import {PropModal} from '../../type/PropModal';
import {Icon, Text} from '@rneui/themed';
import {IconType} from '../../enum/IconType';

type CustomerProps = NativeStackNavigationProp<
  RootStackParamList,
  ListBottomTab.CUSTOMER
>;

type CustomerlRouteProp = RouteProp<{params: {idKhachHang: string}}, 'params'>;

export default function Customer({
  isShow,
  objUpdate,
  onClose,
  onSave,
}: PropModal<IKhachHangItemDto>) {
  const route = useRoute<CustomerlRouteProp>();
  const navigation = useNavigation<CustomerProps>();
  const {idKhachHang = ''} = route?.params || {};
  const db = Realm.open(realmDatabase);
  const [txtSearch, setTxtSearch] = useState('');

  const [lstCustomer, setLstCustomer] = useState<IKhachHangItemDto[]>([
    {
      id: '01',
      idKhachHang: '01',
      maKhachHang: 'KH01',
      tenKhachHang: 'Nguyễn Thị Hương Giang',
      soDienThoai: '97844545',
    },
    {
      id: '04',
      idKhachHang: '04',
      maKhachHang: 'KH04',
      tenKhachHang: 'Hoàng Mai Ngô',
      soDienThoai: '',
    },
    {
      id: '03',
      idKhachHang: '03',
      maKhachHang: 'KH03',
      tenKhachHang: 'Lê Phương Thao',
      soDienThoai: '08844545',
    },
  ]);

  const getListCustomer = () => {
    //
  };

  const jqAutoCustomer = async () => {
    const param: IPagedKhachHangRequestDto = {
      keyword: txtSearch,
      skipCount: 1,
      maxResultCount: 5,
    };
    const lst = await KhachHangService.jqAutoCustomer(param);
    setLstCustomer([...lst]);
  };

  useEffect(() => {
    getListCustomer();
  }, []);

  useEffect(() => {
    // if (firstLoad) {
    //   firstLoad.current = false;
    //   return;
    // }
    const getData = setTimeout(async () => {
      //await jqAutoCustomer();
      return () => clearTimeout(getData);
    }, 2000);
  }, [txtSearch]);

  const choseCustomer = (item: IKhachHangItemDto) => {
    onSave(item);
  };

  return (
    <Modal visible={isShow} animationType="slide" transparent={true}>
      <View style={styles.modalContent}>
        <View
          style={{
            backgroundColor: '#FFF4E5',
            flexDirection: 'row',
            alignItems: 'center',
            padding: 12,
          }}>
          <Icon
            type={IconType.IONICON}
            name="close"
            color={'red'}
            size={24}
            style={{marginLeft: 8, flex: 1}}
            onPress={onClose}
          />
          <Text style={{textAlign: 'center', flex: 11}}>Chọn khách hàng</Text>
        </View>

        <SearchBar
          placeholder="Tìm kiếm khách hàng"
          value={txtSearch}
          onChangeText={text => setTxtSearch(text)}
          containerStyle={{
            paddingLeft: 16,
            paddingRight: 16,
            borderTopWidth: 0,
            paddingBottom: 0,
            backgroundColor: 'white',
          }}
          inputContainerStyle={{backgroundColor: 'white'}}
        />
        <FlatList
          data={lstCustomer}
          renderItem={({item}) => (
            <CustomerItem item={item} choseCustomer={choseCustomer} />
          )}
          keyExtractor={item => item.id}
          style={{paddingBottom: 8}}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    position: 'relative',
  },
});
