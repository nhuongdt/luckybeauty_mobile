import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Pressable, Modal, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import { IHoaDonChiTietDto } from "../../api/invoices/hoaDonDto";

const productImg = require("../../assets/product_goidau.jpg");

export default function ModalAddGioHang({
  visibleModal,
  onCloseModal,
  productItem,
}: any) {
  const [ctDoing, setCTDoing] = useState<IHoaDonChiTietDto>(
    {} as IHoaDonChiTietDto
  );

  useEffect(() => {
    setCTDoing({
      ...ctDoing,
      soLuong: productItem.soLuong,
      donGiaTruocCK: productItem?.donGiaTruocCK ?? 0,
      thanhTienTruocCK: productItem?.thanhTienTruocCK ?? 0,
      thanhTienSauCK: productItem?.thanhTienSauCK ?? 0,
    });
  }, [visibleModal]);

  const onShowModal = () => {
    setCTDoing({
      ...ctDoing,
      soLuong: productItem.soLuong,
      donGiaTruocCK: productItem?.donGiaTruocCK ?? 0,
      thanhTienTruocCK: productItem?.thanhTienTruocCK ?? 0,
      thanhTienSauCK: productItem?.thanhTienSauCK ?? 0,
    });
  };

  return (
    <View style={styles.container}>
      <Modal
        visible={visibleModal}
        transparent={true}
        animationType="slide"
        onRequestClose={onCloseModal}
        // onShow={onShowModal}
      >
        <View style={styles.modalView}>
          <Pressable onPress={onCloseModal}>
            <Ionicons name="close" size={24} color={"#c0c0c0"} />
          </Pressable>
          <View style={{ gap: 16, alignItems: "center" }}>
            <Image source={productImg} resizeMode="stretch" />
            <Text style={styles.productName}>{productItem?.tenHangHoa}</Text>
            <Text style={styles.productPrice}>
              {new Intl.NumberFormat("vi-VN").format(
                productItem?.donGiaTruocCK
              )}
            </Text>

            <View
              style={{
                gap: 24,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ textAlign: "left" }}>Số lượng</Text>
              <Ionicons name="remove-circle-outline" size={30} color={"#ccc"} />
              <Text style={[styles.productPrice, { textAlign: "center" }]}>
                1
              </Text>
              <Ionicons name="add-circle-outline" size={30} color={"#ccc"} />
            </View>
          </View>
          <View
            style={{
              marginTop: 20,
              borderTopColor: "#cccc",
              borderTopWidth: 1,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 20,
              }}
            >
              <Text style={[styles.productPrice]}>Tổng tiền</Text>
              <Text style={[styles.productName]}>
                {" "}
                {new Intl.NumberFormat("vi-VN").format(ctDoing?.thanhTienSauCK)}
              </Text>
            </View>
            <Pressable
              style={[styles.button, styles.buttonOpen]}
              onPress={onCloseModal}
            >
              <Text>Thêm vào giỏ hàng</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  productName: { fontSize: 16, fontWeight: "600" },
  productPrice: { fontSize: 14, fontWeight: "500" },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    alignItems: "center",
  },
  buttonOpen: {
    backgroundColor: "#ffe4c4",
    marginTop: 16,
  },
});
