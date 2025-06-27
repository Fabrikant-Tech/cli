import {
  Component,
  h,
  Prop,
  State,
  Event,
  EventEmitter,
  Watch,
  Element,
  Host,
  Method,
} from '@stencil/core';
import { basicSetup } from 'codemirror';
import { drawSelection, EditorView, ViewUpdate, keymap } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { yaml } from '@codemirror/lang-yaml';
import { SizeUnit, ThemeDefault } from '../../generated/types/variables';
import { Theme } from '../../generated/types/types';
import { BaseSize, BaseSizes, BaseTextArea } from '../../reserved/editor-types';
import { defaultHighlightStyle, defaultTheme } from './types/code-editor-types';
import { syntaxHighlighting } from '@codemirror/language';
import { search } from '@codemirror/search';
import { indentWithTab } from '@codemirror/commands';

/**
 * The Code Editor component is used to display and edit code snippets.
 * @category Display
 */
@Component({
  tag: 'br-code-editor',
  styleUrl: './css/code-editor.css',
  shadow: true,
})
export class CodeEditor {
  /**
   * Stores the editor container.
   */
  private editorContainer!: HTMLDivElement;
  /**
   * A reference to the search panel.
   */
  private searchPanelRef: HTMLBrCodeEditorSearchElement | null;
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrCodeEditorElement;
  /**
   * Stores the editor view.
   */
  @State() editorView?: EditorView;
  /**
   * Stores whethe the editor view is focused.
   */
  @State() focused?: boolean;
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;
  @Watch('theme')
  themeChanged() {
    if (this.searchPanelRef) {
      this.searchPanelRef.theme = this.theme;
    }
  }
  /**
   * Defines the value of the component.
   * @category Data
   * @visibility persistent
   */
  @Prop() value: BaseTextArea<string> | undefined;
  @Watch('value')
  handleValueChange(newValue: string) {
    if (this.editorView && !this.focused) {
      const transaction = this.editorView.state.update({
        changes: { from: 0, to: this.editorView.state.doc.length, insert: newValue },
      });
      this.editorView.dispatch(transaction);
    }
  }
  /**
   * Determines if the component expands to fill the available horizontal space.
   * @category Dimensions
   * @visibility hidden
   * @order 0
   */
  @Prop({ reflect: true }) fullWidth?: boolean;
  /**
   * Determines if the component expands to fill the available vertical space.
   * @category Dimensions
   * @visibility hidden
   * @order 0
   */
  @Prop({ reflect: true }) fullHeight?: boolean;
  /**
   * The width in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) width?: BaseSize<BaseSizes>;
  /**
   * The height in px or percentage. Token variables and calc strings are also supported.
   * @category Dimensions
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) height?: BaseSize<BaseSizes>;
  /**
   * Event emitted when the content changes.
   */
  @Event() codeChange: EventEmitter<string>;
  /**
   * Method that returns the Editor view.
   */
  @Method()
  async getEditorView() {
    return this.editorView;
  }

  componentDidLoad() {
    this.initializeEditor();
  }

  private initializeEditor() {
    this.searchPanelRef = document.createElement('br-code-editor-search');
    if (this.searchPanelRef) {
      this.searchPanelRef.theme = this.theme;
    }
    const disableDefaultSearch = search({
      scrollToMatch: (range) => EditorView.scrollIntoView(range), // Scroll to the match
      createPanel: () => ({
        dom: this.searchPanelRef || document.createElement('div'),
      }),
    });
    const extensions = [
      basicSetup,
      keymap.of([indentWithTab]),
      yaml(),
      defaultTheme,
      syntaxHighlighting(defaultHighlightStyle),
      drawSelection(),
      disableDefaultSearch,
      EditorView.scrollMargins.of(() => ({
        top: Number(SizeUnit.replace('px', '')) * 4,
        bottom: Number(SizeUnit.replace('px', '')) * 4,
      })),
      EditorView.updateListener.of((update: ViewUpdate) => {
        if (update.docChanged) {
          this.codeChange.emit(this.editorView!.state.doc.toString());
        }
      }),
    ];

    this.editorView = new EditorView({
      state: EditorState.create({
        doc: this.value,
        extensions,
      }),
      parent: this.editorContainer,
    });
  }

  render() {
    return (
      <Host
        style={{
          width: this.width,
          height: this.height,
        }}
        onFocusin={() => (this.focused = true)}
        onFocusout={() => (this.focused = false)}
      >
        <div class="editor-container" ref={(el) => (this.editorContainer = el as HTMLDivElement)} />
      </Host>
    );
  }
}
