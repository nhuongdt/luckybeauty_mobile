import { View, StyleSheet, FlatList, Pressable } from "react-native";
import { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Icon, SearchBar } from "@rneui/themed";
import uuid from "react-native-uuid";
import { Text } from "@rneui/base";
import ModalAddGioHang from "./modal_add_gio_hang";
import realmQuery from "../../store/realm/realmQuery";
import { HoaDonDto, IHoaDonChiTietDto } from "../../services/hoadon/dto";
import { InvoiceStatus } from "../../enum/InvoiceStatus";
import { IParamSearchProductDto, IProductBasic } from "../../services/product/dto";
import ProductService from "../../services/product/ProductService";
import { IPageResult } from "../../services/commonDto/pageResult";
import realmDatabase from "../../store/realm/database";
import { BottomTabParamList } from "../../navigation/sale_navigation";
import { ListBottomTab } from "../../enum/ListBottomTab";

type ProductSaleProps = NativeStackNavigationProp<
  BottomTabParamList,
  ListBottomTab.PRODUCT
>;

type IPropItemProduct = {
  item: IProductBasic;
  choseItem: (itemm: IProductBasic) => void;
};

export const ItemProduct = ({ item, choseItem }: IPropItemProduct) => {
  return (
    <Pressable
      style={[
        styleItemProduct.container,
        { borderBottomWidth: 1, borderBottomColor: "#ccc" },
      ]}
      onPress={() => choseItem(item)}
    >
      <View style={{ gap: 8 }}>
        <Text>{item.tenHangHoa}</Text>
        <Text style={{ color: "green" }}>{item.maHangHoa}</Text>
      </View>
      <View style={{ gap: 8 }}>
        <Text style={{ fontWeight: 500 }}>
          {new Intl.NumberFormat("vi-VN").format(item.giaBan)}
        </Text>
      </View>
    </Pressable>
  );
};

const styleItemProduct = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

const ProductSale = ({ route }: any) => {
  const firstLoad = useRef(true);
  const db = realmDatabase;
  const {
    idHoaDon = uuid.v4().toString(),
    maHoaDon = "Hóa đơn 1",
    tongThanhToan = 0,
  } = route?.params || {};
  const navigation = useNavigation<ProductSaleProps>();
  const [isShowModalAddGioHang, setIsShowModalAddGioHang] = useState(false);
  const [txtSearchProduct, setTxtSearchProduct] = useState("");
  const [paramSearchProduct, setParamSearchProduct] =
    useState<IParamSearchProductDto>({
      textSearch: "",
      currentPage: 0,
      pageSize: 10,
      idNhomHangHoas: [],
    });
  const [pageResultProduct, setPageResultProduct] = useState<
    IPageResult<IProductBasic>
  >({ items: [], totalCount: 0, totalPage: 0 });

  const [ctDoing, setCTDoing] = useState<IHoaDonChiTietDto>(
    {} as IHoaDonChiTietDto
  );

  const PageLoad = async () => {};

  useEffect(() => {
    PageLoad();
  }, []);

  useEffect(() => {
    //creatwNewHD_ifNotExist();
  }, [idHoaDon]);

  const getListProduct = async () => {
    const param = { ...paramSearchProduct };
    param.textSearch = txtSearchProduct;
    const data = await ProductService.GetListproduct(param);
    setPageResultProduct({
      ...pageResultProduct,
      items: data?.items,
      totalCount: data?.totalCount,
    });
  };

  // sử dụng khi chưa click tạo hóa đơn, mà chọn tab Sản phẩm
  const creatwNewHD_ifNotExist = async () => {
    const itemHD = realmQuery.GetHoaDon_byId(db, idHoaDon);

    if (itemHD == null) {
      const newObj = new HoaDonDto({
        id: idHoaDon,
        maHoaDon: maHoaDon,
      });
      realmQuery.InsertTo_HoaDon(db, newObj);
      navigation.setParams({
        maHoaDon: maHoaDon,
        idHoaDon: idHoaDon,
        tongThanhToan: 0,
      });
    }
  };

  useEffect(() => {
    getListProduct();
  }, [paramSearchProduct]);

  useEffect(() => {
    if (firstLoad) {
      firstLoad.current = false;
      return;
    }
    const getData = setTimeout(async () => {
      await getListProduct();
      return () => clearTimeout(getData);
    }, 2000);
  }, [txtSearchProduct]);

  const choseProduct = async (item: IProductBasic) => {
    const idQuyDoi = item?.idDonViQuyDoi;


    const itemCTHD = realmQuery.GetChiTietHoaDon_byIdQuyDoi(
      db,
      idHoaDon,
      idQuyDoi
    );

    if (itemCTHD != null) {
      setCTDoing({
        ...ctDoing,
        id: itemCTHD?.id,
        stt: itemCTHD?.stt ?? 1,
        idHoaDon: idHoaDon,
        idDonViQuyDoi: idQuyDoi,
        idHangHoa: item.idHangHoa,
        maHangHoa: item?.maHangHoa ?? "",
        tenHangHoa: item?.tenHangHoa ?? "",
        soLuong: itemCTHD.soLuong,
        donGiaTruocCK: itemCTHD?.donGiaTruocCK ?? 0,
        ptChietKhau: itemCTHD?.ptChietKhau ?? 0,
        tienChietKhau: itemCTHD?.tienChietKhau ?? 0,
        ptThue: itemCTHD?.ptThue ?? 0,
        tienThue: itemCTHD?.tienThue ?? 0,
        donGiaSauCK: itemCTHD?.donGiaSauCK ?? 0,
        thanhTienTruocCK: itemCTHD?.thanhTienTruocCK ?? 0,
        thanhTienSauCK: itemCTHD?.thanhTienSauCK ?? 0,
        thanhTienSauVAT: itemCTHD?.thanhTienSauVAT ?? 0,
      });
    } else {
      setCTDoing({
        ...ctDoing,
        stt: 1,
        id: uuid.v4().toString(),
        idHoaDon: idHoaDon,
        maHangHoa: item?.maHangHoa ?? "",
        tenHangHoa: item?.tenHangHoa ?? "",
        idDonViQuyDoi: idQuyDoi,
        idHangHoa: item.idHangHoa,
        soLuong: 1,
        ptChietKhau: 0,
        tienChietKhau: 0,
        laPTChietKhau: true,
        ptThue: 0,
        tienThue: 0,
        donGiaTruocCK: item?.giaBan ?? 0,
        thanhTienTruocCK: item?.giaBan ?? 0,
        donGiaSauCK: item?.giaBan ?? 0,
        thanhTienSauCK: item?.giaBan ?? 0,
        donGiaSauVAT: item?.giaBan ?? 0,
        thanhTienSauVAT: item?.giaBan ?? 0,
        trangThai: InvoiceStatus.HOAN_THANH,
      });
    }
    setIsShowModalAddGioHang(true);
  };

  const agreeAddGioHang = async (ctAfter: IHoaDonChiTietDto) => {
    setIsShowModalAddGioHang(false);

    // delete & add again
    const idQuyDoi = ctAfter?.idDonViQuyDoi;
    realmQuery.DeleteHoaDonChiTiet_byIdQuyDoi( idHoaDon, idQuyDoi);
    realmQuery.InsertTo_HoaDonChiTiet(db, ctAfter);
    //    const cthd = realmQuery.GetChiTietHoaDon_byIdHoaDon(db, idHoaDon);

    // update tocache
    const hdAfter = realmQuery.UpdateHD_fromCTHD(db, idHoaDon);
    if (hdAfter) {
      navigation.setParams({
        tongThanhToan: hdAfter?.tongThanhToan ?? 0,
      });
    }
  };

  return (
    <View style={styles.container}>
      <ModalAddGioHang
        isShow={isShowModalAddGioHang}
        objUpdate={ctDoing}
        onClose={() => setIsShowModalAddGioHang(false)}
        onSave={agreeAddGioHang}
      />
      <View style={{ padding: 8 }}>
        <SearchBar
          placeholder="Tìm kiếm sản phẩm"
          value={txtSearchProduct}
          onChangeText={(text) => setTxtSearchProduct(text)}
          containerStyle={{
            borderTopWidth: 0,
            padding: 0,
            borderBottomColor: "#ccc",
            backgroundColor: "white",
          }}
          inputContainerStyle={{ backgroundColor: "white" }}
        />
        <View
          style={[
            styles.flexRow,
            styles.boxContainer,
            { backgroundColor: "rgba(0,0,0,.03)" },
          ]}
        >
          <View style={styles.flexRow}>
            <Icon type="font-awesome-5" name="user" size={16} />
            <Text style={{ paddingLeft: 10 }}>Khach le</Text>
          </View>
          <Icon type="material-community" name="chevron-double-right" />
        </View>
        <View
          style={[
            styles.flexRow,
            styles.boxContainer,
            { borderBottomColor: "#ccc", borderBottomWidth: 1 },
          ]}
        >
          <View style={styles.flexRow}>
            <Icon type="ionicon" name="filter" />
            <Text style={{ paddingLeft: 8 }}>Tất cả</Text>
          </View>
          <View style={styles.flexRow}>
            <Icon type="ionicon" name="checkmark" />
            <Text style={{ paddingLeft: 8 }}>Chọn nhiều</Text>
          </View>
        </View>
        <FlatList
          data={pageResultProduct?.items}
          renderItem={({ item }) => (
            <ItemProduct item={item} choseItem={choseProduct} />
          )}
          keyExtractor={(item) => item.idDonViQuyDoi}
          style={{ paddingBottom: 8 }}
        ></FlatList>
      </View>
    </View>
  );
};
export default ProductSale;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  boxContainer: {
    justifyContent: "space-between",
    padding: 10,
  },
  boxCustomer: {
    backgroundColor: "yellow",
    padding: 8,
  },
  textRightIcon: {
    paddingLeft: 8,
  },
});
