import axios from 'axios';
import { WtrResult } from 'whats-the-release';

import { IDomSelector } from '../interfaces/IDomSelector';
import { IFileDownloader } from '../interfaces/IFileDownloader';
import { IFormatter } from '../interfaces/IFormatter';
import { IOption } from '../interfaces/IOption';
import { IOptionRated } from '../interfaces/IOptionRated';
import { IOptionRater } from '../interfaces/IOptionRater';
import { ISubsceneApi } from '../interfaces/ISubsceneApi';
import { ISubsceneParser } from '../interfaces/ISubsceneParser';
import { ISubsceneUnzipper } from '../interfaces/ISubsceneUnzipper';
import { ISubtitleSource } from '../interfaces/ISubtitleSource';
import { DomSelector } from '../utilities/DomSelector';
import { FileDownloader } from '../utilities/FileDownloader';
import { OptionRater } from '../utilities/OptionRater';
import { OrdinalConverter } from '../utilities/OrdinalConverter';
import { SubSceneApi } from './SubsceneApi';
import { SubsceneFormatter } from './SubsceneFormatter';
import { SubsceneParser } from './SubsceneParser';
import { SubsceneUnzipper } from './SubsceneUnzipper';

export class SubsceneSource implements ISubtitleSource {
  private readonly _domSelector: IDomSelector;
  private readonly _subsceneApi: ISubsceneApi;
  private readonly _subsceneParser: ISubsceneParser;
  private readonly _fileDownloader: IFileDownloader;
  private readonly _subsceneUnzipper: ISubsceneUnzipper;
  private readonly _optionRater: IOptionRater;
  private readonly _formatter: IFormatter;

  constructor(
    domSelector: IDomSelector,
    subsceneApi: ISubsceneApi,
    subsceneParser: ISubsceneParser,
    fileDownloader: IFileDownloader,
    subsceneUnzipper: ISubsceneUnzipper,
    optionRater: IOptionRater,
    formatter: IFormatter
  ) {
    this._domSelector = domSelector;
    this._subsceneApi = subsceneApi;
    this._subsceneParser = subsceneParser;
    this._fileDownloader = fileDownloader;
    this._subsceneUnzipper = subsceneUnzipper;
    this._optionRater = optionRater;
    this._formatter = formatter;
  }

  static create(): ISubtitleSource {
    return new SubsceneSource(
      new DomSelector(),
      new SubSceneApi(axios.create()),
      new SubsceneParser(),
      new FileDownloader(),
      new SubsceneUnzipper(),
      new OptionRater(),
      new SubsceneFormatter(new OrdinalConverter())
    );
  }

  /**
   * Searches subscene for the media, parses the web page for media options and then rates them.
   *
   * @param release The media to search for.
   * @returns The rated options as an array.
   */
  public async searchMediaOptions(release: WtrResult): Promise<IOptionRated[]> {
    const data = await this._subsceneApi.fetchSearchPage(release.name);
    const optionElements = this._domSelector.selectMany<HTMLAnchorElement>(data, 'div.title > a');
    const options = this._subsceneParser.parseMediaOptions(optionElements);
    const matchString = this._formatter.formatRelease(release);
    const ratedOptions = this._optionRater.rateManyOptions(options, matchString);

    return ratedOptions;
  }

  /**
   * Gets the subtitle options by fetching the media page, parsing the web page
   * for subtitle options and then rating them.
   *
   * @param mediaOption The selected media option.
   * @param release The media the subtitles are for.
   * @returns The rated options as an array.
   */
  public async getMediaSubtitleOptions(mediaOption: IOption, release: WtrResult): Promise<IOptionRated[]> {
    const data = await this._subsceneApi.fetchPage(mediaOption.url);
    const optionElements = this._domSelector.selectMany<HTMLTableDataCellElement>(data, 'table > tbody > tr > td.a1');
    const options = this._subsceneParser.parseMediaOptions(optionElements);
    const matchString = this._formatter.formatRelease(release);
    const ratedOptions = this._optionRater.rateManyOptions(options, matchString);

    // If we're dealing with a show we filter out incorrect episodes
    // TODO: Look into this, I'm not completely sure what I meant
    if (release.type === 'Show') {
      return ratedOptions.filter((option) => option.title.toUpperCase().includes(`E${release.episode}`));
    }

    return ratedOptions;
  }

  /**
   * Downloads the subtitles by fetching the subtitles page, parsing it for the
   * download url, download the zip file to a temporary folder, unzip it,
   * find the subtitle file and then place it in the destination path.
   *
   * @param subtitleOption The selected subtitle option.
   * @param destinationPath The path to save the subtitle file.
   */
  public async downloadSubtitles(subtitleOption: IOption, destinationPath: string): Promise<void> {
    const data = await this._subsceneApi.fetchPage(subtitleOption.url);
    const downloadUrl = this._domSelector.selectOne<HTMLAnchorElement>(
      data,
      'div.download >  a#downloadButton.button'
    ).href;
    // TODO: Validate URL
    const zipFile = `/tmp/subfinder-${Date.now()}.zip`;
    await this._fileDownloader.downloadFile(downloadUrl, zipFile);
    this._subsceneUnzipper.unzip(zipFile, destinationPath);
  }
}
