export type InvoiceStackParamList = {
    TempInvoice: {idHoaDon: string;};
    TempInvoiceDetails: {
      idHoaDon: string;
      idKhachHang?: string;
    };
    ThanhToan: {idHoaDon: string, tongPhaiTra?: number};
    Product: {
      idHoaDon: string;
      idLoaiChungTu?: number;
      countProduct?: number;
    };
  };