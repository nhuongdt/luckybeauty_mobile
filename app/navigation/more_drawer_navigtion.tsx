import { createDrawerNavigator, DrawerContentComponentProps, DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { Text } from "@rneui/base"
import { Dimensions, View } from "react-native"
import { PageHoaDon } from "../screens/quan_ly/ban_hang/page_hoa_don";
import { PageEmpty } from "../screens/components/page_empty";

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
    const navigation = props.navigation
    return (<DrawerContentScrollView {...props}>
        <DrawerItem label="Hóa đơn trong ngày" onPress={() => navigation.navigate("PageKhachHang")} />
        <DrawerItem
            label="Logout"
            onPress={() => { navigation.navigate("Login") }}
        />
    </DrawerContentScrollView>)
}

export const MoreDrawerNavigation = () => {
    const { width } = Dimensions.get("window");
    const Drawer = createDrawerNavigator();
    return <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />} defaultStatus="closed"
        screenOptions={{
            drawerStyle: {
                width: width * 0.5, // Chỉ chiếm 1/2 màn hình
                backgroundColor: "#fff",
            },
        }}>
        <Drawer.Screen name="PageEmpty" component={PageEmpty} options={{ headerShown: false }} />
    </Drawer.Navigator >
    return
}