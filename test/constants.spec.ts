import {
  baseConstants,
  baseTransform,
  setConstants,
  setConstantByKey,
  setTransformByKey,
} from '../src/constants';

describe('constants', () => {
  describe('baseConstants', () => {
    it('should have the correct default values', () => {
      expect(baseConstants).toEqual({
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
      });
    });

    it('should be able to set constants', () => {
      setConstants({
        reLoginCode: '402',
        commonErrorCode: '501',
        commonSuccessCode: '201',
        pageSize: 20,
        pageNumber: 2,
        pageSizeKey: 'page_size',
        pageNumberKey: 'page_number',
        totalKey: 'total_count',
        dataKey: 'data_list',
        queryPageSizeKey: 'page_size',
        queryPageNumberKey: 'page_number',
      });
      expect(baseConstants).toEqual({
        reLoginCode: '402',
        commonErrorCode: '501',
        commonSuccessCode: '201',
        pageSize: 20,
        pageNumber: 2,
        pageSizeKey: 'page_size',
        pageNumberKey: 'page_number',
        totalKey: 'total_count',
        dataKey: 'data_list',
        queryPageSizeKey: 'page_size',
        queryPageNumberKey: 'page_number',
      });
    });

    it('should be able to set a constant by key', () => {
      setConstantByKey('pageSize', 30);
      expect(baseConstants).toEqual({
        reLoginCode: '402',
        commonErrorCode: '501',
        commonSuccessCode: '201',
        pageSize: 30,
        pageNumber: 2,
        pageSizeKey: 'page_size',
        pageNumberKey: 'page_number',
        totalKey: 'total_count',
        dataKey: 'data_list',
        queryPageSizeKey: 'page_size',
        queryPageNumberKey: 'page_number',
      });
    });
  });

  describe('baseTransform', () => {
    it('should have the correct default values', () => {
      expect(baseTransform).toEqual({
        transformSuccessData: expect.any(Function),
        transformErrorData: expect.any(Function),
      });
    });

    it('should be able to set a transform function by key', () => {
      const transformSuccessData = jest.fn();
      setTransformByKey('transformSuccessData', transformSuccessData);
      expect(baseTransform).toEqual({
        transformSuccessData,
        transformErrorData: expect.any(Function),
      });
    });
  });
});
