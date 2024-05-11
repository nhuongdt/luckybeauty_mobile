export interface IParamSearchDto {
  idChiNhanhs?: string[];
  textSearch?: string;
  currentPage?: number;
  pageSize?: number;
  columnSort?: string;
  typeSort?: string;
  trangThais?: number[];
}

export interface IPageResult<T> {
  totalCount: number;
  totalPage: number;
  items: T[];
}
