import {Input, Text} from '@rneui/base';
import {Button, CheckBox, Icon, SearchBar} from '@rneui/themed';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {IKhachHangItemDto} from '../../services/customer/IKhachHangItemDto';
import {PropModal} from '../../type/PropModal';
import {ITaiKhoanNganHangDto} from '../../services/tai_khoan_ngan_hang/ITaiKhoanNganHangDto';
import {IconType} from '../../enum/IconType';
import {useEffect, useState} from 'react';
import TaiKhoanNganHangService from '../../services/tai_khoan_ngan_hang/TaiKhoanNganHangService';
import {CommonActions} from '@react-navigation/native';
import CommonFunc from '../../utils/CommonFunc';

export const ListTaiKhoanNganHang = ({
  isShow,
  objUpdate,
  onClose,
  onSave,
}: PropModal<ITaiKhoanNganHangDto>) => {
  const [txtSearch, setTextSearch] = useState('');
  const [accountBankChosed, setAccountBankChosed] = useState<ITaiKhoanNganHangDto>();
  const [listBankAccountSearch, setListBankAccountSearch] = useState<
    ITaiKhoanNganHangDto[]
  >([]);
  const [listBankAccount, setListBankAccount] = useState<
    ITaiKhoanNganHangDto[]
  >([
    {
      id: '1',
      idNganHang: '2',
      tenChuThe: 'NGUYEN THI QUYNH NGA',
      soTaiKhoan: '012345678945613',
      logoNganHang: 'https://api.vietqr.io/img/KEBHANAHN.png',
    },
    {
      id: '2',
      idNganHang: '1',
      tenChuThe: 'LE THI HUONG GIANG',
      soTaiKhoan: '012345678945613',
      logoNganHang: 'https://api.vietqr.io/img/SEAB.png',
    },
    {
      id: '3',
      idNganHang: '2',
      tenChuThe: 'HOANG CAM LY',
      soTaiKhoan: '012345678945613',
      logoNganHang: 'https://api.vietqr.io/img/KEBHANAHN.png',
    },
  ]);

  useEffect(()=>{
    setAccountBankChosed(undefined);
  },[isShow])

  const getAllBankAccount = async () => {
    const data = await TaiKhoanNganHangService.GetAllBankAccount();
    if (data?.length > 0) {
      setListBankAccount([...data]);
      setListBankAccountSearch([...data]);
    } else {
      setListBankAccount([...listBankAccount]);
      setListBankAccountSearch([...listBankAccount]);
    }
  };

  useEffect(() => {
    getAllBankAccount();
  }, []);

  const searchTaiKhoan = (txt: string) => {
    setTextSearch(txt);
    const str = CommonFunc.convertString_toEnglish(txt);
    const arr = listBankAccount?.filter(
      x =>
        CommonFunc.convertString_toEnglish(x.tenChuThe).includes(str) ||
        CommonFunc.convertString_toEnglish(x.soTaiKhoan).includes(str),
      // CommonFunc.convertString_toEnglish(x.tenNganHang).includes(str)  ||
    );
    setListBankAccountSearch(arr);
  };

  const choseTaiKhoanNganHang = (item: ITaiKhoanNganHangDto) => {
    setAccountBankChosed(item);
  };

  const agreeChoseTaiKhoanNganHang = () => {
    if (accountBankChosed) {
      onSave(accountBankChosed);
    }
  };

  return (
    <Modal visible={isShow} transparent={true} animationType="slide">
      <View style={styles.container}>
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
          <Text
            style={{
              textAlign: 'center',
              flex: 11,
              fontWeight: 500,
              fontSize: 14,
            }}>
            Chọn tài khoản ngân hàng
          </Text>
        </View>
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
          value={txtSearch}
          onChangeText={text => searchTaiKhoan(text)}
        />

        <ScrollView style={{padding: 16}}>
          {listBankAccountSearch?.map(item => (
            <Pressable
              key={item?.id}
              style={[styles.accountItem]}
              onPress={() => choseTaiKhoanNganHang(item)}>
             
             {accountBankChosed?.id === item.id && (
                <Icon
                  type={IconType.IONICON}
                  name="checkmark"
                  size={24}
                  color={'blue'}
                />
              )}
              <Image style={styles.image} source={{uri: item?.logoNganHang}} />

              <View>
                <Text
                  style={{fontWeight: 500, fontSize: 18, textAlign: 'center'}}>
                  {item?.tenChuThe ?? ''}
                </Text>
                <Text style={{color: '#4D4D4D', textAlign: 'center'}}>
                  {item?.soTaiKhoan ?? ''}
                </Text>
              </View>
              
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.button}>
          <View
            style={{gap: 10, flexDirection: 'row', justifyContent: 'flex-end'}}>
            <Button
              title={'Bỏ qua'}
              color={'error'}
              size="lg"
              onPress={onClose}
            />
            <Button
              title={'Đồng ý'}
              size="lg"
              onPress={agreeChoseTaiKhoanNganHang}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  accountItem: {
    padding: 10,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    position: 'relative',
    marginTop:16,
  },
  image: {
    height: 100,
  },
  button: {
    position: 'absolute',
    bottom: 16,
    width: '100%',
    paddingHorizontal: 16,
  },
});
