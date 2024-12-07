import { useNavigation } from '@react-navigation/native';
import { useEffect, useRef,useState } from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import uuid from "react-native-uuid";
import { IParamSearchProductDto, IProductBasic } from '../../services/product/dto';
import { Text } from '@rneui/base';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabParamList } from '../../navigation/sale_navigation';
import { ListBottomTab } from '../../enum/ListBottomTab';
import { IPageResult } from '../../services/commonDto/pageResult';
import { IHoaDonChiTietDto } from '../../services/hoadon/dto';
import ProductService from '../../services/product/ProductService';

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

export default function Products({ route }: any) {
  const firstLoad = useRef(true);
  //const db = useSQLiteContext();
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

  
  const getListProduct = async () => {
    const param = { ...paramSearchProduct };
    param.textSearch = txtSearchProduct;
    const data = await ProductService.GetListproduct(param);
    console.log('listproduct ',data?.items)
    setPageResultProduct({
      ...pageResultProduct,
      items: data?.items,
      totalCount: data?.totalCount,
    });
  };

  useEffect(() => {
    getListProduct();
  }, [paramSearchProduct]);

  return <View></View>;
}
