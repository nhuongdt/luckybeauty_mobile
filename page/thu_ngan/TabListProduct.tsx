import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import React, { useEffect, useRef, useState } from "react";
import ProductService from "../../api/products/ProductService";
import { IParamSearchProductDto, IProductBasic } from "../../api/products/dto";
import { IPageResult } from "../../api/dto/CommonDto";
import ModalAddGioHang from "./ModalAddGioHang";
import { IHoaDonChiTietDto } from "../../api/invoices/hoaDonDto";
import uuid from "react-native-uuid";
import sqllite from "../../lib/sqllite";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type IPropProduct = {
  product: IProductBasic;
  choseItem: (itemm: IProductBasic) => void;
};

const ProductItem = (props: IPropProduct) => {
  const { product, choseItem } = props;
  return (
    <View style={{ padding: 4, flex: 1 }}>
      <View
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          backgroundColor: "#f0ffff",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          <View
            style={{
              gap: 8,
              padding: 8,
              flex: 6,
            }}
          >
            <Text style={styles.productName}>{product.tenHangHoa}</Text>
            <Text style={{ color: "#9aaebf" }}>
              {new Intl.NumberFormat("vi-VN").format(product.giaBan)}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              alignItems: "center",
            }}
          >
            <MaterialIcons
              name="add-circle-outline"
              size={24}
              color={"#032f54"}
              onPress={() => choseItem(product)}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default function TabListProduct({ navigation }: any) {
  const insets = useSafeAreaInsets();

  const [isLoading, setIsLoading] = useState(true);
  const [isNew, setIsNew] = useState(true);
  const isFirstLoad = useRef(true);
  const [txtSearchProduct, setTxtSearchProduct] = useState("");
  const [pageDataProducts, setPageDataProducts] =
    useState<IPageResult<IProductBasic>>();
  const [paramSearch, setParamSearch] = useState<IParamSearchProductDto>({
    currentPage: 0,
    pageSize: 20,
  });
  const [objModal, setObjModal] = useState({ modalNumber: -1, isShow: false });
  const [ctDoing, setCTDoing] = useState<IHoaDonChiTietDto>({
    tenHangHoa: "",
  } as IHoaDonChiTietDto);

  useEffect(() => {
    PageLoad();
  }, []);

  const PageLoad = async () => {
    const db = await sqllite.OpenDatabase();
    // await db.execAsync("delete FROM tblHoaDonChiTiet");
    const data = await db.getAllAsync("SELECT * FROM tblHoaDonChiTiet");
    console.log("data ", data);
  };

  const GetListproduct = async (txt: string) => {
    const input = { ...paramSearch };
    input.textSearch = txt;

    const data = await ProductService.GetListproduct(input);
    if (data != null) {
      setPageDataProducts({
        ...pageDataProducts,
        items: data?.items,
        // items: [...data?.items, ...(pageDataProducts?.items ?? [])],
        totalCount: data?.totalCount,
        totalPage: Math.ceil(data?.totalCount / (paramSearch?.pageSize ?? 10)),
      });
    } else {
      setPageDataProducts({
        ...pageDataProducts,
        items: [],
        totalCount: 0,
        totalPage: 0,
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isFirstLoad) {
      isFirstLoad.current = false;
      return;
    }
    GetListproduct("");
  }, [paramSearch.currentPage]);

  useEffect(() => {
    const getData = setTimeout(async () => {
      await GetListproduct(txtSearchProduct);
      return () => clearTimeout(getData);
    }, 2000);
  }, [txtSearchProduct]);

  const showModalChiTiet = async (item: IProductBasic) => {
    const idQuyDoi = item.idDonViQuyDoi;
    setObjModal({ ...objModal, isShow: true, modalNumber: 1 });

    const db = await sqllite.OpenDatabase();
    const itemCTHHD = await sqllite.GetFirstRow_HoaDonChiTiet(db, idQuyDoi);
    console.log("itemCTHHD ", itemCTHHD);
    if (itemCTHHD != null) {
      setIsNew(false);
      setCTDoing({
        ...ctDoing,
        stt: itemCTHHD?.stt ?? 1,
        idDonViQuyDoi: idQuyDoi,
        idHangHoa: item.idHangHoa,
        maHangHoa: item?.maHangHoa ?? "",
        tenHangHoa: item?.tenHangHoa ?? "",
        soLuong: itemCTHHD.soLuong,
        donGiaTruocCK: itemCTHHD?.donGiaTruocCK ?? 0,
        ptChietKhau: itemCTHHD?.ptChietKhau ?? 0,
        tienChietKhau: itemCTHHD?.tienChietKhau ?? 0,
        ptThue: itemCTHHD?.ptThue ?? 0,
        tienThue: itemCTHHD?.tienThue ?? 0,
        donGiaSauCK: itemCTHHD?.donGiaSauCK ?? 0,
        thanhTienTruocCK: itemCTHHD?.thanhTienTruocCK ?? 0,
        thanhTienSauCK: itemCTHHD?.thanhTienSauCK ?? 0,
        thanhTienSauVAT: itemCTHHD?.thanhTienSauVAT ?? 0,
      });
    } else {
      setIsNew(true);
      setCTDoing({
        ...ctDoing,
        stt: 1,
        id: uuid.v4().toString(),
        idHoaDon: uuid.v4().toString(),
        maHangHoa: item?.maHangHoa ?? "",
        tenHangHoa: item?.tenHangHoa ?? "",
        idDonViQuyDoi: idQuyDoi,
        idHangHoa: item.idHangHoa,
        soLuong: 1,
        ptChietKhau: 0,
        tienChietKhau: 0,
        laPTChietKhau: 1,
        ptThue: 0,
        tienThue: 0,
        donGiaTruocCK: item?.giaBan ?? 0,
        thanhTienTruocCK: item?.giaBan ?? 0,
        donGiaSauCK: item?.giaBan ?? 0,
        thanhTienSauCK: item?.giaBan ?? 0,
        donGiaSauVAT: item?.giaBan ?? 0,
        thanhTienSauVAT: item?.giaBan ?? 0,
      });
    }
  };

  const AgreeGioHang = async (itemNew: IHoaDonChiTietDto) => {
    setObjModal({ ...objModal, isShow: false, modalNumber: -1 });

    const db = await sqllite.OpenDatabase();
    if (isNew) {
      sqllite.InsertTo_HoaDonChiTiet(db, itemNew);
    } else {
      sqllite.UpdateTo_HoaDonChiTiet(db, itemNew);
    }
    // pass data to ThuNgan
    const count: { countGioHang: number }[] = await db.getAllAsync(
      "select count(Id) as countGioHang from tblHoaDonChiTiet"
    );
    try {
      console.log("nav_count ", count);
      if (count != null && count?.length > 0) {
        navigation.navigate("thungan", { countGioHang: count[0].countGioHang });
      } else {
        navigation.navigate("thungan", { countGioHang: count });
      }
    } catch (error) {
      console.log("nav ", error);
    }
  };

  return (
    <View style={styles.container}>
      <ModalAddGioHang
        isShow={objModal.isShow}
        onClose={() => setObjModal({ ...objModal, isShow: false })}
        objUpdate={ctDoing}
        onSave={AgreeGioHang}
      />
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
          padding: 16,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 20,
        }}
      >
        <MaterialIcons name="search" size={24} color="#aaa" />
        <TextInput
          placeholder="Tìm kiếm"
          value={txtSearchProduct}
          onChangeText={(newVal) => setTxtSearchProduct(newVal)}
        />
      </View>
      <FlatList
        initialNumToRender={5}
        data={pageDataProducts?.items}
        progressViewOffset={0}
        onEndReached={() => {
          if (
            (paramSearch?.currentPage ?? 1) * (paramSearch.pageSize ?? 10) <
            (pageDataProducts?.totalCount ?? 0)
          ) {
            setParamSearch({
              ...paramSearch,
              currentPage: (paramSearch?.currentPage ?? 0) + 1,
            });
          }
        }}
        renderItem={({ item }) => (
          <ProductItem product={item} choseItem={showModalChiTiet} />
        )}
        keyExtractor={(item) => item.idDonViQuyDoi}
        style={{ width: "100%" }}
        ListFooterComponent={
          isLoading ? (
            <View style={{ marginTop: 10, alignItems: "center" }}>
              <ActivityIndicator size="large" color="#1f1f1f" />
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    paddingTop: 0,
    rowGap: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: "500",
  },
});
