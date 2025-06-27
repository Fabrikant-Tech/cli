To add tags to the tag input, use the `value` prop.

```jsx live
<BrTagInput placeholder="Type in a value and press enter" value={['tag1', 'tag2']}></BrTagInput>
```

Add the label and value as a key-value pair to create a tag value that's different from the tag label.

```jsx live
<BrTagInput
  placeholder="Type in a value and press enter"
  value={[
    { label: 'tag1', value: 'tag1Value' },
    { label: 'tag2', value: 'tag2Value' },
  ]}
></BrTagInput>
```

Elements can also be added to the tag input compositionally. Use the default slot to pass the tags to the tag input, by setting the slot as `{value}-tag-content`.

```jsx live
<BrTagInput placeholder="Type in a value and press enter" value={['Hello', 'World']}>
  <BrTag slot="Hello-tag-content" fillStyle="Ghost" colorType="Constructive">
    Hello
  </BrTag>
  <BrTag slot="World-tag-content" fillStyle="Ghost" colorType="Destructive">
    World
  </BrTag>
</BrTagInput>
```
