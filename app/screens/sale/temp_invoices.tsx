import {View, StyleSheet, Pressable, ScrollView} from 'react-native';
import {Icon, Button} from '@rneui/themed';
import {useEffect, useRef, useContext, useState} from 'react';
import uuid from 'react-native-uuid';
import {format} from 'date-fns';
import {
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Input, Text} from '@rneui/base';
import {ListBottomTab} from '../../enum/ListBottomTab';
import realmDatabase from '../../store/realm/database';
import realmQuery from '../../store/realm/realmQuery';
import {HoaDonDto, IHoaDonDto} from '../../services/hoadon/dto';
import {
  LoaiChungTu,
  TenLoaiChungTu,
} from '../../enum/LoaiChungTu';
import CommonFunc from '../../utils/CommonFunc';
import {IconType} from '../../enum/IconType';
import {InvoiceStackParamList} from '../../type/InvoiceStackParamList';
import {ListInvoiceStack} from '../../enum/ListInvoiceStack';

type TempInvoiceProps = NativeStackNavigationProp<
  InvoiceStackParamList,
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

const styleHeader = StyleSheet.create({
  boxItem: {
    gap: 8,
    minWidth: 120,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  boxItemActive: {
    backgroundColor: '#FA6800',
  },
  boxItemNotActive: {
    backgroundColor: '#F5F5F5',
  },
  boxAdd: {
    backgroundColor: 'white',
  },
});

const TempInvoices = () => {
  const firstLoad = useRef(true);
  const db = realmDatabase;
  const navigation = useNavigation<TempInvoiceProps>();
  const route = useRoute<TempInvoiceRouteProp>();

  const {idHoaDon = '', tongThanhToan = 0} = route.params || {};
  const [idHoaDonChosing, setIdHoaDonChosing] = useState('');
  const [lstHoaDon, setLstHoaDon] = useState<IHoaDonDto[]>([]);
  const [tabActive, setTabActive] = useState(LoaiChungTu.HOA_DON_BAN_LE);

  const arrTab = [
    {id: LoaiChungTu.HOA_DON_BAN_LE, text: 'Hóa đơn'},
    {id: LoaiChungTu.GOI_DICH_VU, text: 'Gói dịch vụ'},
  ];

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

  const createNewInvoice = () => {
    const max = CommonFunc.getMaxNumberFromMaHoaDon(lstHoaDon);
    const kiHieuMaChungTu =
      tabActive == LoaiChungTu.HOA_DON_BAN_LE
        ? TenLoaiChungTu.HOA_DON_BAN_LE
        : TenLoaiChungTu.GOI_DICH_VU;

    const newHD = new HoaDonDto({
      id: uuid.v4().toString(),
      idLoaiChungTu: tabActive,
      maHoaDon: `${kiHieuMaChungTu} ${max}`,
    });
    setLstHoaDon([newHD, ...lstHoaDon]);

    setIdHoaDonChosing(newHD?.id);

    realmQuery.HoaDon_ResetValueForColumn_isOpenLastest(tabActive);
    realmQuery.InsertTo_HoaDon(db, newHD);

    navigation.navigate(ListBottomTab.PRODUCT, {
      maHoaDon: newHD?.maHoaDon,
      idHoaDon: newHD?.id,
      tongThanhToan: 0,
      idLoaiChungTu: tabActive
    });
  };

  const onChangeTab = (tabActive: number) => {
    getHoaDonFromCache(tabActive);
    setTabActive(tabActive);
  };

  const removeInvoice = async (id: string) => {
    realmQuery.RemoveHoaDon_byId(id);
    setLstHoaDon(lstHoaDon?.filter(x => x.id !== id));
  };

  const goInvoiceDetail = (item: IHoaDonDto) => {
    navigation.navigate(ListInvoiceStack.TEMP_INVOICE_DETAIL, {
      idHoaDon: item?.id,
      maHoaDon: item?.maHoaDon,
      tongThanhToan: item?.tongThanhToan,
    });
    setIdHoaDonChosing(item?.id);
  };

  const getInforHoadon_byId = async () => {
    const data = realmQuery.GetHoaDon_byId(idHoaDonChosing);
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
      <View style={styles.container}>
        <View
          style={{
            gap: 12,
            flex: 1,
            padding: 20,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
          }}>
          <Icon type={IconType.FOUNDATION} name="page-add" size={20} />
          <Text style={{textAlign: 'center', fontSize: 16}}>
            Không có hóa đơn tạm
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 8,
          backgroundColor: '#FFF2CC',
        }}>
        {arrTab?.map(item => (
          <Pressable
            key={item.id}
            style={[
              styleHeader.boxItem,
              tabActive === item.id
                ? styleHeader.boxItemActive
                : styleHeader.boxItemNotActive,
            ]}
            onPress={() => onChangeTab(item.id)}>
            <Icon
              name="documents-outline"
              type={IconType.IONICON}
              size={18}
              color={tabActive === item.id ? 'white' : 'black'}
            />
            <Text
              style={{
                color: tabActive === item.id ? 'white' : 'black',
                fontWeight: 500,
              }}>
              {item.text}
            </Text>
          </Pressable>
        ))}

        <View style={[styleHeader.boxItem, styleHeader.boxAdd]}>
          <Pressable onPress={createNewInvoice}>
            <Icon name="add" size={20} />
            <Text style={{fontWeight: 500}}>Tạo đơn mới</Text>
          </Pressable>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}>
        <Input
          leftIcon={{type: 'ionicon', name: 'search'}}
          placeholder="Tìm hóa đơn"
          containerStyle={{
            backgroundColor: 'white',
            borderRadius: 4,
            borderColor: '#F5F5F5',
          }}
          inputStyle={{fontSize: 14}}
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
    </View>
  );
};
export default TempInvoices;
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
