import {RouteProp, useRoute} from '@react-navigation/native';
import {Input, Text} from '@rneui/themed';
import {useEffect, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {IHoaDonDto} from '../../services/hoadon/dto';
import realmQuery from '../../store/realm/realmQuery';
import {HinhThucThanhToan} from '../../enum/HinhThucThanhToan';
import {Button, CheckBox, Icon} from '@rneui/base';
import {IconType} from '../../enum/IconType';
import {IQuyChitietDto} from '../../services/so_quy/IQuyChitietDto';
import CommonFunc from '../../utils/CommonFunc';

type ThanhToanRouteProp = RouteProp<
  {params: {idHoaDon: string; tongPhaiTra?: number}},
  'params'
>;

export default function ThanhToan() {
  const route = useRoute<ThanhToanRouteProp>();
  const {idHoaDon = '', tongPhaiTra = 0} = route.params || {};
  const [isSaving, setIsSaving] = useState(false);
  const [tienMat, setTienMat] = useState(String(tongPhaiTra));
  const [tienChuyenKhoan, setTienChuyenKhoan] = useState('0');
  const [tienQuyeThePos, setTienQuyeThePos] = useState('0');
  const [tienTheGiaTri, setTienTheGiaTri] = useState('0');
  const [soDuTheGiaTri, setSoDuTheGiaTri] = useState('0');
  const [noiDungThu, setNoiDungThu] = useState('');
  const [qrCode, setQRCode] = useState('');
  const [idTaiKhoanChuyenKhoan, setIdTaiKhoanChuyenKhoan] = useState<
    string | null
  >('');
  const [idTaiKhoanPOS, setIdTaiKhoanPOS] = useState<string | null>('');

  const tienKhachDua =
    CommonFunc.formatNumberToFloat(tienTheGiaTri) +
    CommonFunc.formatNumberToFloat(tienMat) +
    CommonFunc.formatNumberToFloat(tienChuyenKhoan) +
    CommonFunc.formatNumberToFloat(tienQuyeThePos);
  const tienKhachThieu = tongPhaiTra - tienKhachDua;

  const [hoadonOpen, setHoaDonOpen] = useState<IHoaDonDto>({
    id: idHoaDon,
  } as IHoaDonDto);

  const [lstQuyCT, setLstQuyCT] = useState<IQuyChitietDto[]>([]);

  const [arrHinhThucChosed, setArrHinhThucChosed] = useState([
    HinhThucThanhToan.TIEN_MAT,
  ]);

  const arrPhuongThucTT = [
    {id: HinhThucThanhToan.TIEN_MAT, text: 'Tiển mặt'},
    {
      id: HinhThucThanhToan.CHUYEN_KHOAN,
      text: 'Chuyển khoản',
    },
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

  const changeHinhThucThanhToan = (id: HinhThucThanhToan) => {
    setArrHinhThucChosed(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id); // Nếu đã chọn thì bỏ chọn
      } else {
        return [...prev, id]; // Nếu chưa chọn thì chọn
      }
    });
  };

  useEffect(() => {
    switch (arrHinhThucChosed?.length ?? 0) {
      case 0: {
        setTienMat('0');
        setTienChuyenKhoan('0');
        setTienQuyeThePos('0');
      }
      case 1:
        if (arrHinhThucChosed.includes(HinhThucThanhToan.TIEN_MAT)) {
          setTienMat(CommonFunc.formatCurrency(tongPhaiTra));
        } else {
          if (arrHinhThucChosed.includes(HinhThucThanhToan.CHUYEN_KHOAN)) {
            setTienChuyenKhoan(CommonFunc.formatCurrency(tongPhaiTra));
          } else {
            if (arrHinhThucChosed.includes(HinhThucThanhToan.QUYET_THE)) {
              setTienQuyeThePos(CommonFunc.formatCurrency(tongPhaiTra));
            }
          }
        }
        break;
    }
  }, [arrHinhThucChosed]);

  const editTienTheGiaTri = (value: string) => {
    let gtri = CommonFunc.formatNumberToFloat(value);
    let soDuThe = CommonFunc.formatNumberToFloat(soDuTheGiaTri);
    if (gtri > soDuThe) {
      gtri = soDuThe;
    }
    setTienTheGiaTri(CommonFunc.formatCurrency(gtri));

    let conLai = 0;
    if (gtri < tongPhaiTra) {
      conLai = tongPhaiTra - gtri;
    }
    setTienMat(CommonFunc.formatCurrency(conLai));
    setTienChuyenKhoan('0');
    setTienQuyeThePos('0');
  };

  const editTienMat = (value: string) => {
    const gtri = CommonFunc.formatNumberToFloat(value);
    setTienMat(CommonFunc.formatCurrency(gtri));

    const tongThanhToan = gtri + CommonFunc.formatNumberToFloat(tienTheGiaTri);
    let conLai = 0;
    if (tongThanhToan < tongPhaiTra) {
      conLai = tongPhaiTra - tongThanhToan;
    }
    if (!CommonFunc.checkNull_OrEmpty(idTaiKhoanChuyenKhoan)) {
      setTienChuyenKhoan(CommonFunc.formatCurrency(conLai));
      setTienQuyeThePos('0');
    } else {
      if (!CommonFunc.checkNull_OrEmpty(idTaiKhoanPOS)) {
        setTienQuyeThePos(CommonFunc.formatCurrency(conLai));
      } else {
        setTienQuyeThePos('0');
      }
      setTienChuyenKhoan('0');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.flexRow}>
        <Text style={styles.textInfor}>Tổng phải trả</Text>
        <Text style={styles.textInfor}>
          {new Intl.NumberFormat('vi-VN').format(
            hoadonOpen?.tongThanhToan ?? 0,
          )}
        </Text>
      </View>
      <View style={{gap: 8}}>
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
              checked={arrHinhThucChosed.includes(item.id)}
              onPress={() => {
                changeHinhThucThanhToan(item.id);
              }}
            />
          ))}
        </View>
      </View>

      <View style={{gap: 20}}>
        {arrHinhThucChosed?.includes(HinhThucThanhToan.TIEN_MAT) && (
          <View style={styles.itemLoaiTien}>
            <Text>Tiền mặt</Text>
            <Input
              inputStyle={{textAlign: 'right'}}
              value={tienMat?.toString()}
              onChangeText={txt => editTienMat(txt)}
            />
          </View>
        )}

        {arrHinhThucChosed?.includes(HinhThucThanhToan.CHUYEN_KHOAN) && (
          <View style={[styles.flexRow, {gap: 16}]}>
            <View style={styles.itemLoaiTien}>
              <Text>Chuyển khoản</Text>
              <Input
                inputStyle={{textAlign: 'right'}}
                value={tienChuyenKhoan}
              />
            </View>

            <TouchableOpacity style={[styles.flexRow, {width: '40%'}]}>
              <Text
                style={{
                  textDecorationLine: 'underline',
                  textAlign: 'center',
                }}>
                Chọn tài khoản nhận
              </Text>
              <Icon
                size={30}
                name="keyboard-double-arrow-right"
                type={IconType.MATERIAL}
              />
            </TouchableOpacity>
          </View>
        )}

        {arrHinhThucChosed.includes(HinhThucThanhToan.QUYET_THE) && (
          <View style={[styles.flexRow, {gap: 16}]}>
            <View style={styles.itemLoaiTien}>
              <Text>POS</Text>
              <Input inputStyle={{textAlign: 'right'}} value={tienQuyeThePos} />
            </View>
            <TouchableOpacity style={[styles.flexRow, {width: '40%'}]}>
              <Text
                style={{
                  textDecorationLine: 'underline',
                  textAlign: 'center',
                }}>
                Chọn tài khoản nhận
              </Text>
              <Icon
                size={30}
                name="keyboard-double-arrow-right"
                type={IconType.MATERIAL}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View
        style={{
          position: 'absolute',
          bottom: 16,
          width: '100%',
          marginHorizontal: 16,
          gap: 16,
        }}>
        <Input
          placeholder="Nội dung thanh toán"
          inputStyle={{fontStyle: 'italic', fontSize: 14}}
        />
        <View
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: 'black',
            borderRadius: 8,
            padding: 12,
          }}>
          <View style={{gap: 16}}>
            <View style={styles.flexRow}>
              <View style={{gap: 16}}>
                <Text style={{fontWeight: 500}}>Tổng khách trả</Text>
                <Text>Còn thiếu</Text>
              </View>
              <View style={{gap: 16}}>
                <Text style={{fontWeight: 500}}>
                  {CommonFunc.formatCurrency(tienKhachDua)}
                </Text>
                <Text>{CommonFunc.formatCurrency(tienKhachThieu)}</Text>
              </View>
            </View>
          </View>
        </View>
        <Button
          title={'Thanh toán'}
          size="lg"
          buttonStyle={{backgroundColor: '#FA6800'}}
          containerStyle={{borderRadius: 8}}
          titleStyle={{color: 'white'}}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    padding: 16,
    gap: 16,
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
