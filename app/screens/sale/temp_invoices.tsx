import {View, StyleSheet, Pressable, ScrollView} from 'react-native';
import {Icon, Button} from '@rneui/themed';
import {useEffect, useRef, useContext, useState, FC} from 'react';
import uuid from 'react-native-uuid';
import {format} from 'date-fns';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Input, Text} from '@rneui/base';
import {
  BottomTabParamList,
  SaleHeader_ListTab,
} from '../../navigation/sale_navigation';
import {ListBottomTab} from '../../enum/ListBottomTab';
import realmDatabase from '../../store/realm/database';
import realmQuery from '../../store/realm/realmQuery';
import {HoaDonDto, IHoaDonDto} from '../../services/hoadon/dto';
import {
  KiHieuChungTu,
  LoaiChungTu,
  TenLoaiChungTu,
} from '../../enum/LoaiChungTu';
import CommonFunc from '../../utils/CommonFunc';
import {IconType} from '../../enum/IconType';

type TempInvoiceProps = NativeStackNavigationProp<
  BottomTabParamList,
  ListBottomTab.TEMP_INVOICE
>;

type TempInvoiceRouteProp = RouteProp<
  {
    params: {
      idHoaDon: string;
      tongThanhToan: number;
      isClickActionHeader: number;
      headerActionId: number;
    };
  },
  'params'
>;

const TempInvoice = () => {
  const firstLoad = useRef(true);
  const db = realmDatabase;
  const navigation = useNavigation<TempInvoiceProps>();
  const route = useRoute<TempInvoiceRouteProp>();

  const {idHoaDon = '', tongThanhToan = 0, headerActionId} = route.params || {};
  const [idHoaDonChosing, setIdHoaDonChosing] = useState('');
  const [lstHoaDon, setLstHoaDon] = useState<IHoaDonDto[]>([]);

  const getHoaDonFromCache = (idLoaiChungTu = LoaiChungTu.HOA_DON_BAN_LE) => {
    const data = realmQuery.GetListHoaDon_ByLoaiChungTu(idLoaiChungTu);
    setLstHoaDon([...data]);
  };

  useEffect(() => {
    getHoaDonFromCache();
  }, []);

  useEffect(() => {
    getInforHoadon_byId();
  }, [tongThanhToan]);

  useEffect(() => {
    onHandeleActionHeader();
  }, [headerActionId]);

  const onHandeleActionHeader = () => {
    switch (headerActionId) {
      case SaleHeader_ListTab.CREATE_NEW:
        {
          createNewInvoice();
        }
        break;
      default:
        {
          getHoaDonFromCache(headerActionId);
        }
        break;
    }
  };

  const createNewInvoice = () => {
    const newId = uuid.v4().toString();
    setIdHoaDonChosing(newId);
    // gan lai giatri cot isOpenLastest = false cho all hoadon
    realmQuery.HoaDon_ResetValueForColumn_isOpenLastest(headerActionId);

    const max = CommonFunc.getMaxNumberFromMaHoaDon(lstHoaDon);
    const kiHieuMaChungTu =
      headerActionId == SaleHeader_ListTab.HOA_DON
        ? TenLoaiChungTu.HOA_DON_BAN_LE
        : TenLoaiChungTu.GOI_DICH_VU;

    const newHD = new HoaDonDto({
      id: newId,
      maHoaDon: `${kiHieuMaChungTu} ${max}`,
    });
    realmQuery.InsertTo_HoaDon(db, newHD);

    navigation.navigate(ListBottomTab.PRODUCT, {
      idHoaDon: newId,
      maHoaDon: newHD.maHoaDon,
      tongThanhToan: 0,
    });

    setLstHoaDon([newHD, ...lstHoaDon]);
  };

  const removeInvoice = async (id: string) => {
    realmQuery.RemoveHoaDon_byId(id);
    setLstHoaDon(lstHoaDon?.filter(x => x.id !== id));
  };

  const goInvoiceDetail = (item: IHoaDonDto) => {
    navigation.navigate(ListBottomTab.TEMP_INVOICE_DETAIL, {
      idHoaDon: item?.id,
      maHoaDon: item?.maHoaDon,
      tongThanhToan: item?.tongThanhToan,
    });
    setIdHoaDonChosing(item?.id);
  };

  const getInforHoadon_byId = async () => {
    const data = realmQuery.GetHoaDon_byId(db, idHoaDonChosing);
    if (data) {
      setLstHoaDon(
        lstHoaDon?.map(x => {
          if (x.id == idHoaDonChosing) {
            return {...x, tongThanhToan: data?.tongThanhToan};
          } else {
            return x;
          }
        }),
      );
    }
  };

  const gotoEdit = (item: IHoaDonDto) => {
    setIdHoaDonChosing(item?.id);
    navigation.navigate(ListBottomTab.PRODUCT, {
      idHoaDon: item.id,
      maHoaDon: item.maHoaDon,
      tongThanhToan: item.tongThanhToan,
    });
  };

  if (lstHoaDon?.length === 0) {
    return (
      <View style={(styles.container, {gap: 12})}>
        <Icon type={IconType.FOUNDATION} name="page-add" size={20} />
        <Text>Không có dữ liệu</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Input
        leftIcon={{type: 'ionicon', name: 'search'}}
        placeholder="Tìm hóa đơn"
        containerStyle={{
          backgroundColor: 'white',
          borderRadius: 4,
          borderColor: '#F5F5F5',
        }}
      />
      {lstHoaDon?.length > 0 && (
        <ScrollView>
          {lstHoaDon?.map(item => (
            <Pressable
              style={stylesInvoiceItem.container}
              key={item?.id}
              onPress={() => goInvoiceDetail(item)}>
              <View
                style={{
                  flex: 1,
                  gap: 15,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Icon
                  type="materialicon"
                  name="delete-outline"
                  size={24}
                  color={'#ff944d'}
                  style={{flex: 1}}
                  onPress={() => removeInvoice(item?.id)}
                />
                <View style={stylesInvoiceItem.boxCenter}>
                  <View style={{flex: 2}}>
                    <Text style={{fontWeight: 500}}>{item?.maHoaDon}</Text>
                    <Text style={{color: 'rgb(178, 183, 187)', fontSize: 14}}>
                      {format(new Date(item.ngayLapHoaDon), 'HH:mm')}
                    </Text>
                  </View>
                  <View style={{flex: 3}}>
                    <Text style={{fontWeight: 500, textAlign: 'right'}}>
                      {new Intl.NumberFormat('vi-VN').format(
                        item?.tongThanhToan ?? 0,
                      )}
                    </Text>
                    <Text
                      ellipsizeMode="tail"
                      numberOfLines={1}
                      style={{
                        textAlign: 'right',
                        color: 'rgb(178, 183, 187)',
                      }}>
                      {item?.tenKhachHang}
                    </Text>
                  </View>
                </View>

                <Icon
                  type="antdesign"
                  name="edit"
                  size={24}
                  style={{flex: 1}}
                  onPress={() => gotoEdit(item)}
                />
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
};
export default TempInvoice;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(245, 247, 244)',
    padding: 8,
  },
});
const stylesInvoiceItem = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  boxCenter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 5,
  },
});
