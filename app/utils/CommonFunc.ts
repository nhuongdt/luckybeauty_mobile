import {IHoaDonDto} from '../services/hoadon/dto';

class CommonFunc {
  getMaxNumberFromMaHoaDon = (arr: IHoaDonDto[]): number => {
    if (!arr.length) return 1;
    const maxNumber = arr.reduce((max: number, item: IHoaDonDto) => {
        const match = item.maHoaDon.match(/\d+/); // Trích xuất số từ maHoaDon
        const number = match ? parseInt(match[0], 10) : 0; // Chuyển thành số nguyên
        return Math.max(max, number); // So sánh với max hiện tại
      }, 0);

    return maxNumber + 1; //  Cộng thêm 1 vào kết quả trả về
  };
}

export default new CommonFunc();
