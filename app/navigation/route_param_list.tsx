import { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
    MainNavigation: NavigatorScreenParams<MainDrawerParamList>;
    PageNotFound: undefined;
};
export type MainDrawerParamList = {
    SaleManagerStack: NavigatorScreenParams<SaleManagerStackParamList>;
    Customer: undefined;
    Dashboard: undefined;
};

export type SaleManagerStackParamList = {
    SaleManagerTab: NavigatorScreenParams<SaleManagerTabParamList>,
    TempInvoiceDetails: {
        idHoaDon: string;
        idKhachHang?: string;
    };
    ThanhToan: { idHoaDon: string; tongPhaiTra?: number };
}
export type SaleManagerTabParamList = {
    TempInvoice: { idHoaDon: string };
    Product: {
        idHoaDon: string;
        idLoaiChungTu?: number;
        countProduct?: number;
    };
}