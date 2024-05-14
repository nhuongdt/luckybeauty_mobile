import { IProductBasic } from "../products/dto";

export interface IHoaDonDto {
  id: string;
  idKhachHang: string;
  idChiNhanh: string;
  idNhanVien: string;
  maHoaDon: string;
  ngayLapHoaDon: string;

  tongTienHangChuaChietKhau: number;
  ptChietKhauHang: number;
  tongChietKhauHangHoa: number;
  tongTienHang: number;
  ptThueHD: number;
  tongTienThue: number;
  tongTienHDSauVAT: number;
  pTGiamGiaHD: number;
  tongGiamGiaHD: number;
  chiPhiTraHang: number;
  tongThanhToan: number;
  chiPhiHD: number;
  ghiChuHD: string;
  trangThai: number;
}

export interface IHoaDonChiTietDto extends IProductBasic {
  id: string;
  idHoaDon: string;
  stt: number;
  soLuong: number;
  donGiaTruocCK: number;
  ptChietKhau: number;
  tienChietKhau: number;
  laPTChietKhau: number;
  donGiaSauCK: number;
  thanhTienTruocCK: number;
  thanhTienSauCK: number;
  ptThue: number;
  tienThue: number;
  donGiaSauVAT: number;
  thanhTienSauVAT: number;
  ghiChu: string;
  trangThai: number;
}
