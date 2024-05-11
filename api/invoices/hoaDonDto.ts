import { IProductBasic } from "../products/dto";

export interface IHoaDonChiTietDto extends IProductBasic {
  soLuong: number;
  donGiaTruocCK: number;
  donGiaSauCK: number;
  thanhTienTruocCK: number;
  thanhTienSauCK: number;
}
