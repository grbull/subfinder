import { WtrResult } from 'whats-the-release';

import { OrdinalConverter } from '../../utilities/OrdinalConverter';
import { SubsceneFormatter } from '../SubsceneFormatter';

describe('SubsceneFormatter', () => {
  describe('formatRelease', () => {
    it('should correctly format the movie with a year', () => {
      // Arrange
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
      const testFormattedResult = 'Movie Name (2021)';
      const sut = new SubsceneFormatter(new OrdinalConverter());

      // Act
      const result = sut.formatRelease(testWtrResult);

      // Assert
      expect(result).toEqual(testFormattedResult);
    });

    it('should correctly format the movie without a year', () => {
      // Arrange
      const testWtrResult: WtrResult = {
        filename: 'Movie.Name.2021.1080p.WEB-DL.DDP5.1.Atmos.H.264-moo',
        type: 'Movie',
        name: 'Movie Name',
        resolution: '1080p',
        source: 'WEB-DL',
        codecs: { audio: 'DDP5.1', video: 'X264' },
        container: undefined,
        mimeType: undefined,
        tags: [],
        releaseGroup: 'moo',
      };
      const testFormattedResult = 'Movie Name';
      const sut = new SubsceneFormatter(new OrdinalConverter());

      // Act
      const result = sut.formatRelease(testWtrResult);

      // Assert
      expect(result).toEqual(testFormattedResult);
    });

    it('should correctly format the show', () => {
      // Arrange
      const testWtrResult: WtrResult = {
        filename: 'Series.2022.S01E01.1080p.WEB.h264-moo',
        type: 'Show',
        name: 'Series',
        year: '2022',
        resolution: '1080p',
        source: 'WEB',
        codecs: { video: 'X264' },
        container: undefined,
        mimeType: undefined,
        tags: [],
        releaseGroup: 'moo',
        season: '01',
        episode: '01',
      };
      const testFormattedResult = 'Series - First Season';
      const ordinalConverter = new OrdinalConverter();
      const convertMock = jest.spyOn(ordinalConverter, 'convert');
      const sut = new SubsceneFormatter(ordinalConverter);

      // Act
      const result = sut.formatRelease(testWtrResult);

      // Assert
      expect(result).toEqual(testFormattedResult);
      expect(convertMock).toHaveBeenCalledTimes(1);
    });
  });
});
