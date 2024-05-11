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
              color={"red"}
              onPress={() => choseItem(product)}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default function TabListProduct() {
  const [isLoading, setIsLoading] = useState(true);
  const isFirstLoad = useRef(true);
  const [txtSearchProduct, setTxtSearchProduct] = useState("");
  const [pageDataProducts, setPageDataProducts] =
    useState<IPageResult<IProductBasic>>();
  const [paramSearch, setParamSearch] = useState<IParamSearchProductDto>({
    currentPage: 0,
    pageSize: 10,
  });
  const [objModal, setObjModal] = useState({ modalNumber: -1, isShow: false });
  const [ctDoing, setCTDoing] = useState<IHoaDonChiTietDto>(
    {} as IHoaDonChiTietDto
  );

  const GetListproduct = async (txt: string) => {
    const input = { ...paramSearch };
    input.textSearch = txt;

    const data = await ProductService.GetListproduct(input);
    if (data != null) {
      setPageDataProducts({
        ...pageDataProducts,
        items: [...data?.items, ...(pageDataProducts?.items ?? [])],
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

  const addToGioHang = (item: IProductBasic) => {
    setObjModal({ ...objModal, isShow: true, modalNumber: 1 });
    // check cache
    setCTDoing({
      ...ctDoing,
      soLuong: 1,
      donGiaTruocCK: item?.giaBan ?? 0,
      thanhTienTruocCK: item?.giaBan ?? 0,
      donGiaSauCK: item?.giaBan ?? 0,
      thanhTienSauCK: item?.giaBan ?? 0,
    });
  };

  return (
    <View style={styles.container}>
      <ModalAddGioHang
        visibleModal={objModal.isShow}
        onCloseModal={() => setObjModal({ ...objModal, isShow: false })}
        productItem={ctDoing}
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
          <ProductItem product={item} choseItem={addToGioHang} />
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
    rowGap: 16,
  },
  productName: {
    fontSize: 14,
    fontWeight: "500",
  },
});
