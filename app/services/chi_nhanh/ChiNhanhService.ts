import api from '../api';
import { IChiNhanhBasicDto } from './ChiNhanhDto';

class ChiNhanhService {
  GetChiNhanhByUser = async (): Promise<IChiNhanhBasicDto[]> => {
    const result = await api.get('api/services/app/ChiNhanh/GetChiNhanhByUser');
    return result;
  };
}
export default new ChiNhanhService();
