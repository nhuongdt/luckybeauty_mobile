import { Icon, Theme } from '@rneui/base';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable, Modal, Image } from 'react-native';
import { IHoaDonChiTietDto } from '../../services/hoadon/dto';
import { PropModal } from '../../type/PropModal';
import { InvoiceStatus } from '../../enum/InvoiceStatus';
import { useTheme } from '@rneui/themed';

export default function ModalAddGioHang({ isShow, objUpdate, onClose, onSave }: PropModal<IHoaDonChiTietDto>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [ctDoing, setCTDoing] = useState<IHoaDonChiTietDto>({} as IHoaDonChiTietDto);

  useEffect(() => {
    if (isShow) {
      setCTDoing({
        ...ctDoing,
        id: objUpdate?.id ?? '',
        stt: objUpdate?.stt ?? 1,
        maHangHoa: objUpdate?.maHangHoa ?? '',
        tenHangHoa: objUpdate?.tenHangHoa ?? '',
        idDonViQuyDoi: objUpdate?.idDonViQuyDoi ?? '',
        idHangHoa: objUpdate?.idHangHoa ?? '',
        idHoaDon: objUpdate?.idHoaDon ?? '',
        soLuong: objUpdate?.soLuong ?? 0,
        ptChietKhau: objUpdate?.ptChietKhau ?? 0,
        tienChietKhau: objUpdate?.tienChietKhau ?? 0,
        ptThue: objUpdate?.ptThue ?? 0,
        tienThue: objUpdate?.tienThue ?? 0,
        donGiaTruocCK: objUpdate?.donGiaTruocCK ?? 0,
        donGiaSauCK: objUpdate?.donGiaSauCK ?? 0,
        donGiaSauVAT: objUpdate?.donGiaSauVAT ?? 0,
        thanhTienTruocCK: objUpdate?.thanhTienTruocCK ?? 0,
        thanhTienSauCK: objUpdate?.thanhTienSauCK ?? 0,
        thanhTienSauVAT: objUpdate?.thanhTienSauVAT ?? 0,
        ghiChu: objUpdate?.ghiChu ?? '',
        trangThai: objUpdate?.trangThai ?? InvoiceStatus.HOAN_THANH
      });
    }
  }, [isShow]);

  const PageLoad = async () => {};

  const tangSoLuong = () => {
    const slNew = ctDoing.soLuong + 1;
    setCTDoing({
      ...ctDoing,
      soLuong: slNew,
      thanhTienTruocCK: slNew * (ctDoing?.donGiaTruocCK ?? 0),
      thanhTienSauCK: slNew * (ctDoing?.donGiaSauCK ?? 0),
      thanhTienSauVAT: slNew * (ctDoing?.donGiaSauVAT ?? 0)
    });
  };

  const giamSoLuong = () => {
    let slNew = ctDoing.soLuong;
    if (slNew > 0) {
      slNew = slNew - 1;
    }
    const thanhtien = slNew * (ctDoing?.donGiaTruocCK ?? 0);
    setCTDoing({
      ...ctDoing,
      soLuong: slNew,
      thanhTienTruocCK: thanhtien,
      thanhTienSauCK: thanhtien,
      thanhTienSauVAT: thanhtien
    });
  };

  const agreeGioHang = async () => {
    onSave(ctDoing);
  };

  return (
    <View style={styles.container}>
      <Modal visible={isShow} transparent={true} animationType="slide" onRequestClose={onClose}>
        <View style={styles.modalView}>
          <Pressable
            onPress={onClose}
            style={{
              position: 'absolute',
              left: 10,
              top: 10
            }}>
            <Icon name="close" size={24} color={theme.colors.grey4} />
          </Pressable>
          <View
            style={{
              gap: 16,
              alignItems: 'center'
            }}>
            <Text style={styles.productName}>{ctDoing?.tenHangHoa}</Text>
            <Text style={styles.productPrice}>
              {new Intl.NumberFormat('vi-VN').format(ctDoing?.donGiaTruocCK ?? 0)}
            </Text>

            <View
              style={{
                gap: 24,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              <Text
                style={{
                  textAlign: 'left'
                }}>
                Số lượng
              </Text>
              <Icon name="remove-circle-outline" size={30} color={'#ccc'} onPress={giamSoLuong} />
              <Text
                style={[
                  styles.productPrice,
                  {
                    textAlign: 'center'
                  }
                ]}>
                {ctDoing.soLuong}
              </Text>
              <Icon name="add-circle-outline" size={30} color={theme.colors.greyOutline} onPress={tangSoLuong} />
            </View>
          </View>
          <View
            style={{
              marginTop: 20,
              borderTopColor: theme.colors.greyOutline,
              borderTopWidth: 1
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 20
              }}>
              <Text style={[styles.productPrice]}>Thành tiền</Text>
              <Text style={[styles.productName]}>
                {new Intl.NumberFormat('vi-VN').format(ctDoing?.thanhTienSauCK ?? 0)}
              </Text>
            </View>
            <Pressable style={[styles.button, styles.buttonOpen]} onPress={agreeGioHang}>
              <Text style={{ color: theme.colors.white }}>Thêm vào giỏ hàng</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.white,
      justifyContent: 'center',
      alignItems: 'center'
    },
    modalView: {
      position: 'relative',
      backgroundColor: theme.colors.white,
      borderRadius: 20,
      padding: 30,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    productName: {
      fontSize: 16,
      fontWeight: '600'
    },
    productPrice: {
      fontSize: 14,
      fontWeight: '500'
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      alignItems: 'center'
    },
    buttonOpen: {
      backgroundColor: theme.colors.primary,
      marginTop: 16
    }
  });
