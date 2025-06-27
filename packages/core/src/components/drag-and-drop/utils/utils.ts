export class DragAndDropData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static _currentData: any | undefined = undefined;
  private static _currentDragWrapper: HTMLBrDragAndDropWrapperElement | undefined = undefined;

  static get currentData() {
    return this._currentData;
  }

  static get currentDragWrapper() {
    return this._currentDragWrapper;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static set currentData(value: any) {
    this._currentData = value;
  }

  static set currentDragWrapper(value: HTMLBrDragAndDropWrapperElement | undefined) {
    this._currentDragWrapper = value;
  }

  static clearCurrentData() {
    this._currentData = undefined;
  }

  static clearCurrentDragWrapper() {
    this._currentDragWrapper = undefined;
  }
}
