export class MenuItemFilter {
  private static _currentFilter: string = '';

  static get currentFilter() {
    return this._currentFilter;
  }

  static set currentFilter(value: string) {
    this._currentFilter = value;
  }

  static clearCurrentFilter() {
    this._currentFilter = '';
  }
}
