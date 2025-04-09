import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import Realm from 'realm';
import realmDatabase from '../../store/realm/database';
import { FlatList, Modal, StyleSheet, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import realmQuery from '../../store/realm/realmQuery';
import KhachHangService from '../../services/customer/KhachHangService';
import { IPagedKhachHangRequestDto } from '../../services/customer/IPagedKhachHangRequestDto';
import { IKhachHangItemDto } from '../../services/customer/IKhachHangItemDto';
import { CustomerItem } from './customer_item';
import { SearchBar, Theme } from '@rneui/base';
import { PropModal } from '../../type/PropModal';
import { ModalTitle } from '../components/ModalTitle';
import { useTheme } from '@rneui/themed';
import { ModalContainer } from '../../components/modal_container';
import { BackDropView } from '../../components/back_drop_view';

export default function Customer({ isShow, objUpdate, onClose, onSave }: PropModal<IKhachHangItemDto>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [txtSearch, setTxtSearch] = useState('');
  const firstLoad = useRef(true);

  const [lstCustomer, setLstCustomer] = useState<IKhachHangItemDto[]>([
    {
      id: '01',
      idKhachHang: '01',
      maKhachHang: 'KH01',
      tenKhachHang: 'Nguyễn Thị Hương Giang',
      soDienThoai: '97844545'
    },
    {
      id: '04',
      idKhachHang: '04',
      maKhachHang: 'KH04',
      tenKhachHang: 'Hoàng Mai Ngô',
      soDienThoai: ''
    },
    {
      id: '03',
      idKhachHang: '03',
      maKhachHang: 'KH03',
      tenKhachHang: 'Lê Phương Thao',
      soDienThoai: '08844545'
    }
  ]);

  const jqAutoCustomer = async () => {
    const param: IPagedKhachHangRequestDto = {
      keyword: txtSearch,
      skipCount: 0,
      maxResultCount: 5
    };
    const lst = await KhachHangService.jqAutoCustomer(param);
    setLstCustomer([...lst]);
  };

  useEffect(() => {
    if (isShow) {
      jqAutoCustomer();
    }
  }, [isShow]);

  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }

    const getData = setTimeout(async () => {
      await jqAutoCustomer();
      return () => clearTimeout(getData);
    }, 2000);
  }, [txtSearch]);

  const choseCustomer = (item: IKhachHangItemDto) => {
    onSave(item);
  };

  return (
    <Modal visible={isShow} animationType="slide" transparent={true}>
      <BackDropView>
        <ModalContainer>
          <ModalTitle title="Chọn khách hàng" onClose={onClose} />

          <SearchBar
            placeholder="Tìm kiếm khách hàng"
            value={txtSearch}
            onChangeText={text => setTxtSearch(text)}
            containerStyle={styles.searchBarConatiner}
            inputContainerStyle={{
              backgroundColor: 'white'
            }}
            inputStyle={{ fontSize: 14 }}
          />
          <FlatList
            data={lstCustomer}
            renderItem={({ item }) => <CustomerItem item={item} choseCustomer={choseCustomer} />}
            keyExtractor={item => item.id}
            style={{
              paddingBottom: 8
            }}
          />
        </ModalContainer>
      </BackDropView>
    </Modal>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    searchBarConatiner: {
      paddingLeft: 16,
      paddingRight: 16,
      borderTopWidth: 0,
      paddingBottom: 0,
      backgroundColor: theme.colors.white
    }
  });
