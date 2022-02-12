import Axios from 'axios';

import { SubSceneApi } from '../SubsceneApi';

describe('SubsceneApi', () => {
  describe('fetchSearchPage', () => {
    it('should make an axios request', () => {
      // Arrange
      const axios = Axios.create();
      const axiosRequestMock = jest.spyOn(axios, 'request');
      axiosRequestMock.mockImplementation((): Promise<string> => Promise.resolve(''));
      const testQuery = 'test';
      const sut = new SubSceneApi(axios);

      // Act
      sut.fetchSearchPage(testQuery);

      // Assert#
      expect(axiosRequestMock).toHaveBeenCalledTimes(1);
      expect(axiosRequestMock).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://subscene.com/subtitles/searchbytitle',
        data: `query=${testQuery}&l=`,
      });
    });
  });
  describe('fetchPage', () => {
    it('should make an axios request', () => {
      // Arrange
      const testUrl = '';
      const axios = Axios.create();
      const axiosRequestMock = jest.spyOn(axios, 'request');
      axiosRequestMock.mockImplementation((): Promise<string> => Promise.resolve(''));
      const sut = new SubSceneApi(axios);

      // Act
      sut.fetchPage(testUrl);

      // Assert#
      expect(axiosRequestMock).toHaveBeenCalledTimes(1);
      expect(axiosRequestMock).toHaveBeenCalledWith({ method: 'GET', url: testUrl });
    });
  });
});
