import { ScrollView, StyleSheet, Text, View, FlatList } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import React, { useEffect, useRef, useState } from "react";
import ProductService from "../../api/products/ProductService";
import { IParamSearchProductDto, IProductBasic } from "../../api/products/dto";

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
              backgroundColor: "powderblue",
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
            {/* <Ionicons
              name="add"
              size={24}
              color={"red"}
              onPress={() => choseItem(product)}
            /> */}
            <Text onPress={() => choseItem(product)}>add</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default function TabListProduct() {
  const [lstProduct, setLstProduct] = useState<IProductBasic[]>([]);
  const [txtSearchProduct, setTxtSearchProduct] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [refresh, setRefresh] = useState(true);

  const GetListproduct = async (txt: string) => {
    const input: IParamSearchProductDto = {
      currentPage: currentPage,
      pageSize: 5,
      textSearch: txt,
    };
    console.log("input ", input);

    const data = await ProductService.GetListproduct(input);
    if (data != null) {
      setLstProduct(data?.items);
    } else {
      setLstProduct([]);
    }
    setRefresh(false);
  };

  useEffect(() => {
    GetListproduct("");
  }, [currentPage]);

  useEffect(() => {
    const getData = setTimeout(async () => {
      await GetListproduct(txtSearchProduct);
      return () => clearTimeout(getData);
    }, 2000);
  }, [txtSearchProduct]);

  const addToGioHang = (item: IProductBasic) => {
    //
  };

  return (
    <View style={styles.container}>
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
        data={lstProduct}
        // refreshing={refresh}
        // onRefresh={() => {
        //   setCurrentPage(() => currentPage + 1);
        //   console.log("cu", currentPage);
        // }}
        renderItem={({ item }) => (
          <ProductItem product={item} choseItem={addToGioHang} />
        )}
        keyExtractor={(item) => item.id}
        style={{ width: "100%" }}
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
