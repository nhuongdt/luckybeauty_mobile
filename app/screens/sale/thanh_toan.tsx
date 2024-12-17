import {RouteProp, useRoute} from '@react-navigation/native';
import {Input, Text} from '@rneui/themed';
import {useEffect, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {IHoaDonDto} from '../../services/hoadon/dto';
import realmQuery from '../../store/realm/realmQuery';
import {HinhThucThanhToan} from '../../enum/HinhThucThanhToan';
import {CheckBox, Icon} from '@rneui/base';
import {IconType} from '../../enum/IconType';
import { IQuyChitietDto } from '../../services/so_quy/IQuyChitietDto';

type ThanhToanRouteProp = RouteProp<{params: {idHoaDon: string}}, 'params'>;

export default function ThanhToan() {
  const route = useRoute<ThanhToanRouteProp>();
  const {idHoaDon = ''} = route.params || {};

  const [hoadonOpen, setHoaDonOpen] = useState<IHoaDonDto>({
    id: idHoaDon,
  } as IHoaDonDto);

  const [lstQuyCT,setLstQuyCT] = useState<IQuyChitietDto[]>([]);

  const arrPhuongThucTT = [
    {id: HinhThucThanhToan.TIEN_MAT, text: 'Tiển mặt'},
    {id: HinhThucThanhToan.CHUYEN_KHOAN, text: 'Chuyển khoản'},
    {id: HinhThucThanhToan.QUYET_THE, text: 'POS'},
  ];

  const GetInforHoadon_fromCache = () => {
    const data = realmQuery.GetHoaDon_byId(idHoaDon);
    if (data !== null) {
      setHoaDonOpen({...data});
    }
  };

  useEffect(() => {
    GetInforHoadon_fromCache();
  }, [idHoaDon]);

  return (
    <View style={styles.container}>
      <View style={styles.flexRow}>
        <Text style={styles.textInfor}>Tổng thanh toán</Text>
        <Text style={styles.textInfor}>
          {new Intl.NumberFormat('vi-VN').format(
            hoadonOpen?.tongThanhToan ?? 0,
          )}
        </Text>
      </View>
      <View style={{marginTop: 16, gap: 8}}>
        <Text>Phương thức thanh toán</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          {arrPhuongThucTT?.map(item => (
            <CheckBox
              key={item.id}
              title={item.text}
              checked={item?.id === HinhThucThanhToan.TIEN_MAT}
            />
          ))}
        </View>
      </View>
      <View style={{marginTop: 16}}>
        <View style={styles.itemLoaiTien}>
          <Text>Tiền mặt</Text>
          <Input inputStyle={{textAlign: 'right'}} value="20.000" />
        </View>

        <View style={[styles.flexRow, {gap: 8, marginTop: 20}]}>
          <View style={styles.itemLoaiTien}>
            <Text>Chuyển khoản</Text>
            <Input inputStyle={{textAlign: 'right'}} value="20.000" />
          </View>

          <Text
            style={{
              textDecorationLine: 'underline',
              width: '25%',
              textAlign: 'center',
            }}>
            Chọn tài khoản nhận
          </Text>
          <Icon
            size={30}
            name="keyboard-double-arrow-right"
            type={IconType.MATERIAL}
          />
        </View>
        <View style={[styles.flexRow, {marginTop: 20}]}>
          <View style={styles.itemLoaiTien}>
            <Text>POS</Text>
            <Input inputStyle={{textAlign: 'right'}} value="20.000" />
          </View>
          <Pressable style={[styles.flexRow, { marginLeft: 8}]}>
            <Text
              style={{
                textDecorationLine: 'underline',
                width: '25%',
                textAlign: 'center',
              }}>
              Chọn tài khoản nhận
            </Text>
            <Icon
              size={30}
              name="keyboard-double-arrow-right"
              type={IconType.MATERIAL}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    padding: 16,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textInfor: {
    fontSize: 18,
    fontWeight: 600,
  },
  itemLoaiTien: {
    padding: 16,
    borderRadius: 16,
    justifyContent: 'space-between',
    borderColor: '#ccc',
    borderWidth: 1,
    width: '60%',
  },
});
