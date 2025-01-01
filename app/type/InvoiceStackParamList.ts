export type InvoiceStackParamList = {
    TempInvoice: {idHoaDon: string; maHoaDon?: string,  tongThanhToan?: number;};
    TempInvoiceDetails: {
      idHoaDon: string;
      maHoaDon?: string;
      tongThanhToan?: number;
      idKhachHang?: string;
    };
    ThanhToan: {idHoaDon: string};
    Product: {
      idHoaDon: string;
      idLoaiChungTu?: number;
      maHoaDon?: string;
      tongThanhToan?: number;
    };
  };