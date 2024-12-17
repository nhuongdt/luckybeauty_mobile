import api from "../api";
import { IPageResult } from "../commonDto/IPageResultDto";
import { IParamSearchProductDto, IProductBasic } from "./dto";

class ProductSevice {
  GetListproduct = async (
    input: IParamSearchProductDto
  ): Promise<IPageResult<IProductBasic>> => {
    const xx = await api.post(
      `api/services/app/HangHoa/GetDMHangHoa`,
      input
    );
    return xx;
  };
}

export default new ProductSevice();
