import { IParamSearchDto } from "../dto/CommonDto";

export interface IParamSearchProductDto extends IParamSearchDto {
  idNhomHangHoas?: string[];
}

export interface IProductBasic {
  idHangHoa: string;
  idDonViQuyDoi: string;
  maHangHoa: string;
  tenHangHoa: string;
  giaBan: number;
  tyLeChuyenDoi: number;
  tenNhomHang: string;
}
