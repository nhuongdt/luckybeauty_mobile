import { IPageResult } from "../dto/CommonDto";
import htpService from "../httpService";
import { IParamSearchProductDto, IProductBasic } from "./dto";

class ProductSevice {
  GetListproduct = async (
    input: IParamSearchProductDto
  ): Promise<IPageResult<IProductBasic>> => {
    const xx = await htpService.post(
      `api/services/app/HangHoa/GetDMHangHoa`,
      input
    );
    return xx;
  };
}

export default new ProductSevice();
