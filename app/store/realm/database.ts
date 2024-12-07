import Realm from 'realm';
import tblHoaDon from './tblHoaDon';
import tblHoaDonChiTiet from './tblHoaDonChiTiet';
const realmDatabase = new Realm({
  schema: [tblHoaDon, tblHoaDonChiTiet],
  // nếu sau này sửa đổi cấu trúc Database thì bỏ comment
//   schemaVersion: 2,
//   onMigration: (oldRealm, newRealm) => {
//     // todo: if change data
//   },
});
export default realmDatabase;
