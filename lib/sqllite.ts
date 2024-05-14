import * as SQLite from "expo-sqlite";
import { IHoaDonChiTietDto } from "../api/invoices/hoaDonDto";

class SqliteClass {
  OpenDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
    const db = await SQLite.openDatabaseAsync("Luckybeauty_Sqllite");
    return db;
  };
  CreateTable_KhachHang = async (db: SQLite.SQLiteDatabase) => {
    db.execAsync(`CREATE TABLE IF NOT EXISTS tblKhachHang (Id text PRIMARY KEY, MaKhachHang text, TenKhachHang text, SoDienThoai text, DiaChi text, GioiTinhNam integer, 
        Avatar real,  TongTichDiem real)`);
  };
  CreateTable_KhachHangCheckIn = async (db: SQLite.SQLiteDatabase) => {
    db.execAsync(`CREATE TABLE IF NOT EXISTS tblKhachHangCheckIn (Id text PRIMARY KEY, IdKhachHang text, IdChiNhanh text, DatetimeCheckIn text, TrangThai integer, 
        FOREIGN KEY (IdKhachHang) 
        REFERENCES tblKhachHang (Id) 
           ON DELETE CASCADE 
           ON UPDATE NO ACTION))`);
  };
  CreateTable_CheckInHoaDon = async (db: SQLite.SQLiteDatabase) => {
    db.execAsync(`CREATE TABLE IF NOT EXISTS tblCheckInHoaDon (Id text PRIMARY KEY, IdCheckIn text, IdBooking text, IdHoaDon text, TrangThai integer, 
        FOREIGN KEY (IdCheckIn) 
        REFERENCES tblKhachHangCheckIn (Id), 
        FOREIGN KEY (IdHoaDon) 
        REFERENCES tblHoaDon (Id))`);
  };
  CreateTable_HoaDon = async (db: SQLite.SQLiteDatabase) => {
    db.execAsync(
      `CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY NOT NULL, value TEXT NOT NULL, intValue INTEGER)`
    );
    db.execAsync(`CREATE TABLE IF NOT EXISTS tblHoaDon (Id text PRIMARY KEY, MaHoaDon text, NgayLapHoaDon text, IdChiNhanh text, IdKhachHang text, IdNhanVien text, 
        TongTienHangChuaChietKhau real,  PTChietKhauHang real default 0, TongChietKhauHangHoa real, TongTienHang real, PTThueHD real default 0, TongTienThue real default 0,
        TongTienHDSauVAT real, PTGiamGiaHD real, TongGiamGiaHD real, ChiPhiTraHang real default 0, TongThanhToan real, ChiPhiHD real default 0, GhiChuHD text, TrangThai integer default 3 
       `);
  };
  CreateTable_HoaDonChiTiet = async (db: SQLite.SQLiteDatabase) => {
    db.execAsync(`CREATE TABLE IF NOT EXISTS tblHoaDonChiTiet (Id text PRIMARY KEY, IdHoaDon text, STT integer, IdDonViQuyDoi text, IdHangHoa text, IdChiTietHoaDon text, 
        SoLuong real,  DonGiaTruocCK real, ThanhTienTruocCK real, laPTChietKhau integer default 1, PTChietKhau real default 0, TienChietKhau real, DonGiaSauCK real, ThanhTienSauCK real,
        PTThue real default 0, TienThue real default 0, DonGiaSauVAT real, ThanhTienSauVAT real, GhiChu text, TrangThai integer default 1
        `);
  };
  InsertTo_HoaDonChiTiet = async (
    db: SQLite.SQLiteDatabase,
    itemNew: IHoaDonChiTietDto
  ) => {
    try {
      await db.runAsync(
        `INSERT INTO tblHoaDonChiTiet (Id, IdHoaDon, IdDonViQuyDoi, IdHangHoa,
        STT, SoLuong, DonGiaTruocCK, ThanhTienTruocCK,
        DonGiaSauCK, ThanhTienSauCK ,
        DonGiaSauVAT, ThanhTienSauVAT)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        itemNew.id,
        itemNew?.idHoaDon,
        itemNew?.idDonViQuyDoi,
        itemNew?.idDonViQuyDoi,
        itemNew?.stt,
        itemNew?.soLuong,
        itemNew?.donGiaTruocCK,
        itemNew?.thanhTienTruocCK,
        itemNew?.donGiaSauCK,
        itemNew?.thanhTienSauCK,
        itemNew?.donGiaSauVAT,
        itemNew?.thanhTienSauVAT
      );
    } catch (error) {
      console.log("InsertTo_HoaDonChiTiet ", error);
    }
  };
  UpdateTo_HoaDonChiTiet = async (
    db: SQLite.SQLiteDatabase,
    itemNew: IHoaDonChiTietDto
  ) => {
    try {
      await db.runAsync(
        `UPDATE tblHoaDonChiTiet SET SoLuong = ?, ThanhTienTruocCK = ?,  ThanhTienSauCK = ?, ThanhTienSauVAT = ?
      WHERE idDonViQuyDoi = ?`,
        itemNew?.soLuong,
        itemNew?.donGiaTruocCK * itemNew.soLuong,
        itemNew?.donGiaSauCK * itemNew.soLuong,
        itemNew?.donGiaSauVAT * itemNew.soLuong,
        itemNew?.idDonViQuyDoi
      );
    } catch (error) {
      console.log("UpdateTo_HoaDonChiTiet ", error);
    }
  };
  GetFirstRow_HoaDonChiTiet = async (
    db: SQLite.SQLiteDatabase,
    idDonViQuyDoi: string
  ): Promise<IHoaDonChiTietDto | null> => {
    try {
      const data = await db.getFirstAsync(
        `SELECT * FROM tblHoaDonChiTiet where IdDonViQuyDoi= '${idDonViQuyDoi}'`
      );
      return data as unknown as IHoaDonChiTietDto;
    } catch (error) {
      console.log("GetFirstRow_HoaDonChiTiet ", error);
    }
    return null;
  };
}

export default new SqliteClass();
