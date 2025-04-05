import { View, StyleSheet, FlatList, Pressable, Dimensions, Modal } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { Icon, Input, SearchBar, Text } from '@rneui/themed';
import { IconType } from '../../enum/IconType';
import { ItemProductSale } from '../components/ItemProductSale';
import { IPageResultDto } from '../../services/commonDto/IPageResultDto';
import { IParamSearchProductDto, IProductBasic } from '../../services/product/dto';
import ProductService from '../../services/product/ProductService';
import realmQuery from '../../store/realm/realmQuery';
import { PropModal } from '../../type/PropModal';
import { ModalTitle } from '../components/ModalTitle';

export const ModalListProduct = ({ isShow, onClose, onSave }: PropModal<IProductBasic>) => {
  const [txtSearchProduct, setTxtSearchProduct] = useState('');
  const [pageResultProduct, setPageResultProduct] = useState<IPageResultDto<IProductBasic>>({
    items: [],
    totalCount: 0,
    totalPage: 0
  });
  const [paramSearchProduct, setParamSearchProduct] = useState<IParamSearchProductDto>({
    textSearch: '',
    currentPage: 0,
    pageSize: 10,
    idNhomHangHoas: []
  });

  useEffect(() => {
    getListProduct();
  }, [paramSearchProduct]);

  const getListProduct = async () => {
    const param = {
      ...paramSearchProduct
    };
    param.textSearch = txtSearchProduct;
    const data = await ProductService.GetListproduct(param);

    if (data?.items?.length > 0) {
      setPageResultProduct({
        ...pageResultProduct,
        items: data?.items,
        totalCount: data?.totalCount
      });
    } else {
      const lst: IProductBasic[] = realmQuery.GetListHangHoa_fromCacche();
      if (lst?.length == 0) {
        realmQuery.Init_DanhMucHangHoa();
      }

      setPageResultProduct({
        ...pageResultProduct,
        items: lst,
        totalCount: lst?.length
      });
    }
  };

  const choseProduct = (item: IProductBasic) => {
    onSave(item);
  };

  return (
    <Modal visible={isShow} transparent={true} animationType="slide">
      <View style={styles.container}>
        <ModalTitle title="Chọn hàng bán" onClose={onClose} />

        <View
          style={{
            padding: 8
          }}>
          <Input
            leftIcon={{
              type: IconType.IONICON,
              name: 'search',
              size: 14,
              style: {
                color: '#ccc'
              }
            }}
            rightIcon={{
              type: IconType.IONICON,
              name: 'add'
            }}
            placeholder="Tìm kiếm sản phẩm"
            containerStyle={{
              borderColor: '#ccc',
              padding: 0
            }}
            inputStyle={{
              fontSize: 14
            }}
          />

          {(pageResultProduct?.totalCount ?? 0) == 0 ? (
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16
              }}>
              Không có dữ liệu
            </Text>
          ) : (
            <View>
              <View
                style={[
                  styles.flexRow,
                  styles.boxContainer,
                  {
                    borderBottomColor: '#ccc',
                    borderBottomWidth: 1
                  }
                ]}>
                <View style={styles.flexRow}>
                  <Icon type="ionicon" name="filter" />
                  <Text
                    style={{
                      paddingLeft: 8
                    }}>
                    Tất cả
                  </Text>
                </View>
                <View style={styles.flexRow}>
                  <Icon type="ionicon" name="checkmark" />
                  <Text
                    style={{
                      paddingLeft: 8
                    }}>
                    Chọn nhiều
                  </Text>
                </View>
              </View>
              <FlatList
                data={pageResultProduct?.items}
                renderItem={({ item }) => <ItemProductSale item={item} choseItem={choseProduct} />}
                keyExtractor={item => item.idDonViQuyDoi}
                style={{
                  paddingBottom: 8
                }}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  boxContainer: {
    justifyContent: 'space-between',
    padding: 10
  },
  textRightIcon: {
    paddingLeft: 8
  }
});
