import Realm from 'realm';
const tblHangHoa: Realm.ObjectSchema = {
  name: 'idHangHoa',
  primaryKey: 'idHangHoa',
  properties: {
    idHangHoa: 'string',
    idDonViQuyDoi: 'string',
    maHangHoa: 'string',
    tenHangHoa: 'string',
    giaBan: 'float',
    tyLeChuyenDoi: 'float?',
    tenNhomHang: 'string?',
  },
};
export default tblHangHoa;
