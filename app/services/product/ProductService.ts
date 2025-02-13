import api from "../api";
import { IPageResultDto } from "../commonDto/IPageResultDto";
import { IParamSearchProductDto, IProductBasic } from "./dto";

class ProductSevice {
  GetListproduct = async (
    input: IParamSearchProductDto
  ): Promise<IPageResultDto<IProductBasic>> => {
    const xx = await api.post(
      `api/services/app/HangHoa/GetDMHangHoa`,
      input
    );
    return xx;
  };
}

export default new ProductSevice();
