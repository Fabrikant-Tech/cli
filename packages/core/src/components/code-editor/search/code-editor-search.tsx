import { Component, Element, h, Host, Prop, State, Watch } from '@stencil/core';
import { ThemeDefault } from '../../../generated/types/variables';
import { Theme } from '../../../generated/types/types';
import {
  SearchQuery,
  setSearchQuery,
  findNext,
  findPrevious,
  getSearchQuery,
} from '@codemirror/search';

/**
 * The Code Editor search component is used to search and replace text in the code editor.
 * @category Display
 * @visibility hidden
 */
@Component({
  tag: 'br-code-editor-search',
  styleUrl: './css/code-editor-search.css',
  shadow: true,
})
export class CodeEditorSearch {
  /**
   * A reference to the parent code editor.
   */
  private parentCodeEditor: HTMLBrCodeEditorElement | null;
  /**
   * A reference to the host and component.
   */
  @Element() elm: HTMLBrCodeEditorSearchElement;
  /**
   * Stores the search string.
   */
  @State() search = '';
  @Watch('search')
  searchChanged() {
    this.searchInEditor(this.search);
  }
  /**
   * Stores the replacement string.
   */
  @State() replacement = '';
  @Watch('search')
  replacementChanged() {
    this.searchInEditor(this.search);
  }
  /**
   * Stores if search is regexp.
   */
  @State() isRegexp = false;
  @Watch('isRegexp')
  isRegexpChanged() {
    this.searchInEditor(this.search);
  }
  /**
   * Stores if search is case sensitive.
   */
  @State() caseSensitive = false;
  @Watch('caseSensitive')
  caseSensitiveChanged() {
    this.searchInEditor(this.search);
  }
  /**
   * Defines the theme of the component.
   * @category Appearance
   * @visibility persistent
   * @order 0
   */
  @Prop({ reflect: true }) theme: Theme = ThemeDefault;

  componentDidLoad() {
    const getParentCodeEditor = () => {
      const parent = this.elm.parentElement;
      const rootNode = parent?.getRootNode();
      if (rootNode) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (rootNode as any).host;
      } else {
        return null;
      }
    };
    this.parentCodeEditor = getParentCodeEditor();
  }

  private applySearchValue = (e: CustomEvent<{ value: string | undefined }>) => {
    this.search = e.detail.value || '';
  };

  private searchInEditor = async (searchString: string | undefined) => {
    if (!this.parentCodeEditor) {
      return;
    }
    const editorView = await this.parentCodeEditor.getEditorView();
    if (!editorView) {
      return;
    }
    // Open the search panel
    const newQuery = new SearchQuery({
      search: searchString || '',
      caseSensitive: this.caseSensitive,
      regexp: this.isRegexp,
      wholeWord: false,
    });
    // Apply the new search query
    editorView.dispatch({ effects: setSearchQuery.of(newQuery) });
  };

  private replaceNextOccurence = async () => {
    if (!this.parentCodeEditor) {
      return;
    }
    const editorView = await this.parentCodeEditor.getEditorView();
    if (!editorView) {
      return;
    }

    const query = getSearchQuery(editorView.state);
    if (!query) return;

    const text = editorView.state.doc.toString();
    const match = query.caseSensitive
      ? text.indexOf(query.search)
      : text.toLowerCase().indexOf(query.search.toLowerCase());

    if (match === -1) return;

    editorView.dispatch({
      changes: [{ from: match, to: match + query.search.length, insert: this.replacement }],
    });
    this.cycleDownResults();
  };

  private replaceAllOccurences = async () => {
    if (!this.parentCodeEditor) {
      return;
    }
    const editorView = await this.parentCodeEditor.getEditorView();
    if (!editorView) {
      return;
    }

    const query = getSearchQuery(editorView.state);
    if (!query) return;

    const text = editorView.state.doc.toString();
    const regex = new RegExp(query.search, query.caseSensitive ? 'g' : 'gi');
    const changes = [];

    let match;
    while ((match = regex.exec(text)) !== null) {
      changes.push({
        from: match.index,
        to: match.index + query.search.length,
        insert: this.replacement,
      });
    }

    if (changes.length > 0) {
      editorView.dispatch({ changes });
    }
  };

  private cycleDownResults = async () => {
    if (!this.parentCodeEditor) {
      return;
    }
    const editorView = await this.parentCodeEditor.getEditorView();
    if (!editorView) {
      return;
    }

    findNext(editorView);
  };

  private cycleUpResults = async () => {
    if (!this.parentCodeEditor) {
      return;
    }
    const editorView = await this.parentCodeEditor.getEditorView();
    if (!editorView) {
      return;
    }

    findPrevious(editorView);
  };

  render() {
    return (
      <Host>
        <br-container direction="row" fullWidth={true} horizontalGap={`var(--size-unit)`}>
          <br-input
            value={this.search}
            onInput={(e) => this.applySearchValue(e as CustomEvent<{ value: string | undefined }>)}
            onChange={(e) => this.applySearchValue(e as CustomEvent<{ value: string | undefined }>)}
            theme={this.theme}
            size="Small"
            placeholder="Search"
            showClearButton={false}
            fullWidth={true}
          >
            <br-container
              slot="right-icon"
              direction="row"
              style={{
                pointerEvents: 'all',
              }}
              height="var(--actionable-element-height-x-small)"
            >
              <br-tooltip theme={this.theme}>
                <br-tooltip-content theme={this.theme}>
                  <span style={{ fontSize: 'calc(var(--size-unit) * 3)' }}>Use RegExp</span>
                </br-tooltip-content>
                <br-button
                  slot="target"
                  height="var(--actionable-element-height-x-small)"
                  width="var(--actionable-element-height-x-small)"
                  active={this.isRegexp}
                  onClick={() => (this.isRegexp = !this.isRegexp)}
                  theme={this.theme}
                  size="Small"
                  fillStyle="Ghost"
                  colorType="Neutral"
                >
                  <br-icon slot="left-icon" iconName="Asterisk" />
                </br-button>
              </br-tooltip>
              <br-tooltip theme={this.theme}>
                <br-tooltip-content theme={this.theme}>
                  <span style={{ fontSize: 'calc(var(--size-unit) * 3)' }}>Case sensitive</span>
                </br-tooltip-content>
                <br-button
                  slot="target"
                  height="var(--actionable-element-height-x-small)"
                  width="var(--actionable-element-height-x-small)"
                  active={this.caseSensitive}
                  onClick={() => (this.caseSensitive = !this.caseSensitive)}
                  theme={this.theme}
                  size="Small"
                  fillStyle="Ghost"
                  colorType="Neutral"
                >
                  <br-icon iconName="A" />
                </br-button>
              </br-tooltip>
            </br-container>
          </br-input>
          <br-container direction="row">
            <br-tooltip theme={this.theme}>
              <br-tooltip-content theme={this.theme}>
                <span style={{ fontSize: 'calc(var(--size-unit) * 3)' }}>Previous</span>
              </br-tooltip-content>
              <br-button
                slot="target"
                onClick={this.cycleUpResults}
                theme={this.theme}
                size="Small"
                fillStyle="Ghost"
                colorType="Neutral"
              >
                <br-icon slot="left-icon" iconName="ChevronUp" />
              </br-button>
            </br-tooltip>
            <br-tooltip theme={this.theme}>
              <br-tooltip-content theme={this.theme}>
                <span style={{ fontSize: 'calc(var(--size-unit) * 3)' }}>Next</span>
              </br-tooltip-content>
              <br-button
                slot="target"
                onClick={this.cycleDownResults}
                theme={this.theme}
                size="Small"
                fillStyle="Ghost"
                colorType="Neutral"
              >
                <br-icon slot="left-icon" iconName="ChevronDown" />
              </br-button>
            </br-tooltip>
          </br-container>
        </br-container>
        <br-container direction="row" fullWidth={true} horizontalGap={`var(--size-unit)`}>
          <br-input
            value={this.replacement}
            theme={this.theme}
            size="Small"
            placeholder="Replace"
            showClearButton={false}
            fullWidth={true}
            onInput={(e) => (this.replacement = (e as CustomEvent<{ value: string }>).detail.value)}
            onChange={(e) =>
              (this.replacement = (e as CustomEvent<{ value: string }>).detail.value)
            }
          />
          <br-container direction="row">
            <br-tooltip theme={this.theme}>
              <br-tooltip-content theme={this.theme}>
                <span style={{ fontSize: 'calc(var(--size-unit) * 3)' }}>Replace next</span>
              </br-tooltip-content>
              <br-button
                slot="target"
                onClick={this.replaceNextOccurence}
                theme={this.theme}
                size="Small"
                fillStyle="Ghost"
                colorType="Neutral"
              >
                <br-icon slot="left-icon" iconName="SingleValue" />
              </br-button>
            </br-tooltip>
            <br-tooltip theme={this.theme}>
              <br-tooltip-content theme={this.theme}>
                <span style={{ fontSize: 'calc(var(--size-unit) * 3)' }}>Replace all</span>
              </br-tooltip-content>
              <br-button
                slot="target"
                onClick={this.replaceAllOccurences}
                theme={this.theme}
                size="Small"
                fillStyle="Ghost"
                colorType="Neutral"
              >
                <br-icon slot="left-icon" iconName="Subtract" />
              </br-button>
            </br-tooltip>
          </br-container>
        </br-container>
      </Host>
    );
  }
}
