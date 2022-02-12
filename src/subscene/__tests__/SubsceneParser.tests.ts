import { IOption } from '../../interfaces/IOption';
import { SubsceneParser } from '../SubsceneParser';

describe('SubsceneParser', () => {
  describe('parseMediaOptions', () => {
    it('should return option when item and url exist', () => {
      // Arrange
      const testTitle = 'title';
      const testUrl = 'url';
      const testElement = document.createElement('a');
      testElement.innerHTML = testTitle;
      testElement.href = testUrl;
      const testOption: IOption = { title: testTitle, url: testUrl };
      const sut = new SubsceneParser();

      // Act
      const result = sut.parseMediaOptions([testElement]);

      // Assert
      expect(result[0]).toStrictEqual(testOption);
    });
    it('it should not return option if title is missing', () => {
      // Arrange
      const testTitle = '';
      const testUrl = 'url';
      const testElement = document.createElement('a');
      testElement.innerHTML = testTitle;
      testElement.href = testUrl;
      const sut = new SubsceneParser();

      // Act
      const result = sut.parseMediaOptions([testElement]);

      // Assert
      expect(result.length).toBe(0);
    });
    it('it should not return option if url is missing', () => {
      // Arrange
      const testTitle = 'title';
      const testUrl = '';
      const testElement = document.createElement('a');
      testElement.innerHTML = testTitle;
      testElement.href = testUrl;
      const sut = new SubsceneParser();

      // Act
      const result = sut.parseMediaOptions([testElement]);

      // Assert
      expect(result.length).toBe(0);
    });
  });

  describe('parseMediaSubtitleOptions', () => {
    it('should return option when item and url exist, and the language is english', () => {
      // Arrange
      const testTitle = 'title';
      const testUrl = 'url';
      const testLanguage = 'English';

      const testEl = document.createElement('td') as HTMLTableDataCellElement;
      testEl.innerHTML = `
        <a href="${testUrl}">
          <span class="l r positive-icon">
            ${testLanguage}
          </span>
          <span>
            ${testTitle} 
          </span>
        </a>`;

      const testOption: IOption = { title: testTitle, url: testUrl };
      const sut = new SubsceneParser();

      // Act
      const result = sut.parseMediaSubtitleOptions([testEl]);

      // Assert
      expect(result[0]).toStrictEqual(testOption);
    });
    it('should not return option when item and url exist, and the language is not english', () => {
      // Arrange
      const testTitle = 'title';
      const testUrl = 'url';
      const testLanguage = 'NotEnglish';

      const testEl = document.createElement('td') as HTMLTableDataCellElement;
      testEl.innerHTML = `
          <a href="${testUrl}">
            <span class="l r positive-icon">
              ${testLanguage}
            </span>
            <span>
              ${testTitle} 
            </span>
          </a>`;
      const testOption: IOption = { title: testTitle, url: testUrl };
      const sut = new SubsceneParser();

      // Act
      const result = sut.parseMediaSubtitleOptions([testEl]);

      // Assert
      expect(result.length).toBe(0);
    });
    it('it should not return option if title is missing', () => {
      // Arrange
      const testTitle = '';
      const testUrl = 'url';
      const testLanguage = 'English';

      const testEl = document.createElement('td') as HTMLTableDataCellElement;
      testEl.innerHTML = `
          <a href="${testUrl}">
            <span class="l r positive-icon">
              ${testLanguage}
            </span>
            <span>
              ${testTitle} 
            </span>
          </a>`;

      const testOption: IOption = { title: testTitle, url: testUrl };
      const sut = new SubsceneParser();

      // Act
      const result = sut.parseMediaSubtitleOptions([testEl]);

      // Assert
      expect(result.length).toBe(0);
    });
    it('it should not return option if url is missing', () => {
      // Arrange
      const testTitle = 'title';
      const testUrl = '';
      const testLanguage = 'English';

      const testEl = document.createElement('td') as HTMLTableDataCellElement;
      testEl.innerHTML = `
          <a href="${testUrl}">
            <span class="l r positive-icon">
              ${testLanguage}
            </span>
            <span>
              ${testTitle} 
            </span>
          </a>`;
      const testOption: IOption = { title: testTitle, url: testUrl };
      const sut = new SubsceneParser();

      // Act
      const result = sut.parseMediaSubtitleOptions([testEl]);

      // Assert
      expect(result.length).toBe(0);
    });
  });
});
