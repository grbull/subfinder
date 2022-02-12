export interface IDomSelector {
  selectOne<T extends Element>(html: string, selector: string): T;
  selectMany<T extends Element>(html: string, selector: string): T[];
}
