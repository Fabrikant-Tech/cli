export class DebugMode {
  private static _currentDebug: boolean = false;

  static get currentDebug() {
    return this._currentDebug;
  }

  static setCurrentDebug(value: boolean) {
    this._currentDebug = value;
  }

  static clearCurrentDebug() {
    this._currentDebug = false;
  }
}
