export interface IBaseConstants {
  reLoginCode: string;
  commonErrorCode: string;
  commonSuccessCode: string;
  pageSize: number;
  pageNumber: number;
  pageSizeKey: string;
  pageNumberKey: string;
  totalKey: string;
  dataKey: string;
  queryPageSizeKey: string;
  queryPageNumberKey: string;
}
export interface IBaseTransform {
  transformSuccessData: (data: any) => any;
  transformErrorData: (msg: string) => any;
}

export const baseConstants: IBaseConstants = {
  reLoginCode: '401',
  commonErrorCode: '500',
  commonSuccessCode: '200',
  pageSize: 10,
  pageNumber: 1,
  pageSizeKey: 'pageSize',
  pageNumberKey: 'pageNumber',
  totalKey: 'total',
  dataKey: 'list',
  queryPageSizeKey: 'pageSize',
  queryPageNumberKey: 'pageNumber',
};
export const baseTransform: IBaseTransform = {
  transformSuccessData: (data) => ({
    code: baseConstants.commonSuccessCode,
    success: true,
    data,
  }),
  transformErrorData: (msg) => ({
    msg,
    code: baseConstants.commonErrorCode,
    success: false,
  }),
};

export const setConstants = (params: IBaseConstants) => {
  Object.entries(params).forEach((v) => {
    baseConstants[v[0]] = v[1];
  });
};

export const setConstantByKey = <K extends keyof IBaseConstants>(
  key: K,
  value: IBaseConstants[K],
) => {
  baseConstants[key] = value;
};

export const setTransformByKey = <K extends keyof IBaseTransform>(
  key: K,
  value: IBaseTransform[K],
) => {
  baseTransform[key] = value;
};

export const DECORATOR_PAGE_CONTROLLER = 'DECORATOR_PAGE_CONTROLLER';
export const DECORATOR_RAW_CONTROLLER = 'DECORATOR_RAW_CONTROLLER';
export const DECORATOR_OMIT_AUTH = 'DECORATOR_OMIT_AUTH';
