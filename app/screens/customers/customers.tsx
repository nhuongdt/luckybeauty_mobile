import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {BottomTabParamList} from '../../navigation/sale_navigation';
import {ListBottomTab} from '../../enum/ListBottomTab';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import realmDatabase from '../../store/realm/database';
import { FlatList, StyleSheet, View} from 'react-native';
import {useEffect, useRef, useState} from 'react';
import realmQuery from '../../store/realm/realmQuery';
import KhachHangService from '../../services/customer/KhachHangService';
import {IPagedKhachHangRequestDto} from '../../services/customer/IPagedKhachHangRequestDto';
import {IKhachHangItemDto} from '../../services/customer/IKhachHangItemDto';
import { CustomerItem } from './customer_item';

type CustomerProps = NativeStackNavigationProp<
  BottomTabParamList,
  ListBottomTab.CUSTOMER
>;

type CustomerlRouteProp = RouteProp<{params: {idKhachHang: string}}, 'params'>;
export default function Customer() {
  const route = useRoute<CustomerlRouteProp>();
  const navigation = useNavigation<CustomerProps>();
  const {idKhachHang = ''} = route?.params || {};
  const db = realmDatabase;
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
    const lst = realmQuery.GetListHangHoa_fromCacche();
    console.log('lstproduct ', lst);
  };

  const jqAutoCustomer = async () => {
    const param: IPagedKhachHangRequestDto = {
      keyword: '',
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

  return (
    <View style={styles.container}>
       <FlatList
          data={lstCustomer}
          renderItem={({item}) => (
            <CustomerItem item={item} />
          )}
          keyExtractor={item => item.id}
          style={{paddingBottom: 8}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
});
