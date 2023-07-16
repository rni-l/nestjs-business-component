import { getEnvListByMode } from '../src/configService';

describe('configService', () => {
  describe('getEnvListByMode', () => {
    it('should return the development environment list', () => {
      process.env.MODE = 'development';
      expect(getEnvListByMode()).toEqual(['.env.development', '.env']);
    });

    it('should return the test environment list', () => {
      process.env.MODE = 'test';
      expect(getEnvListByMode()).toEqual(['.env.test', '.env']);
    });

    it('should return the production environment list', () => {
      process.env.MODE = 'production';
      expect(getEnvListByMode()).toEqual(['.env.production', '.env']);
    });

    it('should return the local environment list', () => {
      process.env.MODE = 'local';
      expect(getEnvListByMode()).toEqual(['.env.local', '.env']);
    });

    it('should return the production environment list by default', () => {
      process.env.MODE = undefined;
      expect(getEnvListByMode()).toEqual(['.env.production', '.env']);
    });
  });
});
