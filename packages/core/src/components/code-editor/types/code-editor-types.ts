import { EditorView } from 'codemirror';
import { HighlightStyle } from '@codemirror/language';
import { tags } from '@lezer/highlight';

export const defaultTheme = EditorView.baseTheme({
  '.cm-gutters': {
    backgroundColor: 'color-mix(in srgb, var(--code-editor-color-gutter) 100%, transparent)',
    borderRight: `1px solid var(--code-editor-color-border)`,
    color: `var(--code-gutter-text-color)`,
  },
  '&.cm-focused .cm-cursor': { borderLeftColor: 'var(--code-editor-color-caret)' },
  '& ::selection': { backgroundColor: 'var(--code-editor-color-selection)' },
  '.cm-selectionBackground': {
    backgroundColor: 'var(--code-editor-color-selection)',
  },
  '&.cm-focused .cm-selectionBackground': {
    backgroundColor: 'var(--code-editor-color-selection)',
  },
  '&.cm-focused .cm-scroller .cm-selectionLayer .cm-selectionBackground': {
    backgroundColor: 'var(--code-editor-color-selection)',
  },
  '.cm-activeLine': { backgroundColor: 'var(--code-editor-color-active-line)' },
  '.cm-activeLineGutter': {
    backgroundColor: 'var(--code-editor-color-active-line)',
  },
  '.cm-scroller': { overflow: 'auto', whiteSpace: 'pre' },
  '.cm-content': { minHeight: 'fit-content' },
});

export const defaultHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: 'var(--code-editor-color-keyword)', fontWeight: 'bold' },
  { tag: tags.string, color: 'var(--code-editor-color-string)' },
  { tag: tags.number, color: 'var(--code-editor-color-number)' },
  { tag: tags.variableName, color: 'var(--code-editor-color-variable)' },
  { tag: tags.function(tags.variableName), color: 'var(--code-editor-color-function)' },
  { tag: tags.typeName, color: 'var(--code-editor-color-type)' },
  { tag: tags.propertyName, color: 'var(--code-editor-color-property)' },
  { tag: tags.punctuation, color: 'var(--code-editor-color-punctuation)' },
  { tag: tags.operator, color: 'var(--code-editor-color-operator)' },
  { tag: tags.comment, color: 'var(--code-editor-color-comment)', fontStyle: 'italic' },
  { tag: tags.invalid, color: 'var(--code-editor-color-invalid)', fontWeight: 'bold' },
]);
