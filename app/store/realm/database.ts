import Realm from 'realm';
import tblHoaDon from './tblHoaDon';
import tblHoaDonChiTiet from './tblHoaDonChiTiet';
import realmQuery from './realmQuery';
import tblHangHoa from './tblHangHoa';
const realmDatabase = new Realm({
  schema: [tblHoaDon, tblHoaDonChiTiet, tblHangHoa],
  schemaVersion: 2,
  onMigration: (oldRealm, newRealm) => {
  },
});
export default realmDatabase;
