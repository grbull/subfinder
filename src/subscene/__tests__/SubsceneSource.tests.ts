/* eslint-disable init-declarations */
import Axios, { AxiosInstance } from 'axios';
import { TextEncoder } from 'util';
import { WtrResult } from 'whats-the-release';

import { ISubsceneApi } from '../../interfaces/ISubsceneApi';
import { DomSelector } from '../../utilities/DomSelector';
import { FileDownloader } from '../../utilities/FileDownloader';
import { OptionRater } from '../../utilities/OptionRater';
import { OrdinalConverter } from '../../utilities/OrdinalConverter';
import { SubsceneApi } from '../SubsceneApi';
import { SubsceneFormatter } from '../SubsceneFormatter';
import { SubsceneParser } from '../SubsceneParser';
import { SubsceneSource } from '../SubsceneSource';
import { SubsceneUnzipper } from '../SubsceneUnzipper';

global.TextEncoder = TextEncoder;

// Be wise about the setup, it will make the testing easier.
// We should rename the Formatter interface
// We could apply
// Test that it resolves the options correctly from a real world snippet of their website

describe('SubsceneSource', () => {
  const testWtrResult: WtrResult = {
    filename: 'Movie.Name.2021.1080p.WEB-DL.DDP5.1.Atmos.H.264-moo',
    type: 'Movie',
    name: 'Movie Name',
    year: '2021',
    resolution: '1080p',
    source: 'WEB-DL',
    codecs: { audio: 'DDP5.1', video: 'X264' },
    container: undefined,
    mimeType: undefined,
    tags: [],
    releaseGroup: 'moo',
  };
  let axios: AxiosInstance;
  let domSelector: DomSelector;
  let subsceneApi: ISubsceneApi;
  let subsceneParser: SubsceneParser;
  let fileDownloader: FileDownloader;
  let subsceneUnzipper: SubsceneUnzipper;
  let optionRater: OptionRater;
  let formatter: SubsceneFormatter;
  let sut: SubsceneSource;

  beforeEach(() => {
    axios = Axios.create();
    domSelector = new DomSelector();
    subsceneApi = new SubsceneApi(axios);
    subsceneParser = new SubsceneParser();
    fileDownloader = new FileDownloader();
    subsceneUnzipper = new SubsceneUnzipper();
    optionRater = new OptionRater();
    formatter = new SubsceneFormatter(new OrdinalConverter());
  });

  describe('searchMediaOptions', () => {
    it('should return the search results as options', () => {
      // Arrange
      const testHTML = `
    <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Document</title>
        </head>
        <body>
          <ul>
            <li>
              <div class="title">
                <a href="/subtitles/aquaman">Aquaman (2007)</a>
              </div>
              <div class="subtle count">4 subtitles</div>
            </li>
            <li>
              <div class="title">
                <a href="/subtitles/aquaman-2018">Aquaman (2018)</a>
              </div>
              <div class="subtle count">308 subtitles</div>
            </li>
            <li>
              <div class="title">
                <a href="/subtitles/aquaman-1967">Aquaman (1967)</a>
              </div>
              <div class="subtle count">36 subtitles</div>
            </li>
          </ul>
        </body>
      </html>
      `;
      const fetchSearchPageMock = jest.spyOn(subsceneApi, 'fetchSearchPage');
      fetchSearchPageMock.mockImplementation((): Promise<string> => Promise.resolve(testHTML));

      // Act
      const result = sut.searchMediaOptions(testWtrResult);

      // Assert
      expect(result).toEqual({});
    });
  });
  // describe('getMediaSubtitleOptions', () => {
  //   it('should return the subtitle options for a release', () => {
  //     // Arrange
  //     const testHTML = ``;
  //     const fetchPageMock = jest.spyOn(subsceneApi, 'fetchPage');
  //     fetchPageMock.mockImplementation((): Promise<string> => Promise.resolve(testHTML));

  //     // Act
  //     const result = sut.searchMediaOptions(testWtrResult);

  //     // Assert
  //     axiosRe;
  //   });
  // });
  // describe('downloadSubtitles', () => {
  //   it('should fetch the download page', () => {
  //     // Arrange
  //     const testHTML = ``;
  //     const fetchPageMock = jest.spyOn(subsceneApi, 'fetchPage');
  //     fetchPageMock.mockImplementation((): Promise<string> => Promise.resolve(testHTML));

  //     // Act
  //     const result = sut.searchMediaOptions(testWtrResult);

  //     // Assert
  //     axiosRe;
  //   });
  //   it('should select the downlaod url', () => {
  //     // Arrange
  //     const testHTML = ``;
  //     const fetchPageMock = jest.spyOn(subsceneApi, 'fetchPage');
  //     fetchPageMock.mockImplementation((): Promise<string> => Promise.resolve(testHTML));

  //     // Act
  //     const result = sut.searchMediaOptions(testWtrResult);

  //     // Assert
  //     axiosRe;
  //   });
  //   it('should download the zip file', () => {
  //     // Arrange
  //     const testHTML = ``;
  //     const fetchPageMock = jest.spyOn(subsceneApi, 'fetchPage');
  //     fetchPageMock.mockImplementation((): Promise<string> => Promise.resolve(testHTML));

  //     // Act
  //     const result = sut.searchMediaOptions(testWtrResult);

  //     // Assert
  //     axiosRe;
  //   });
  //   it('should unzip and move file to destination', () => {
  //     // Arrange
  //     const testHTML = ``;
  //     const fetchPageMock = jest.spyOn(subsceneApi, 'fetchPage');
  //     fetchPageMock.mockImplementation((): Promise<string> => Promise.resolve(testHTML));

  //     // Act
  //     const result = sut.searchMediaOptions(testWtrResult);

  //     // Assert
  //     axiosRe;
  //   });
  // });
});
