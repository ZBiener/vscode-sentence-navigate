# vscode-Sentence-Navigate

Navigate and make selection in markdown documents by jumping from sentence to sentence. Sentences follow the conventions of English. They are defined as the span between one full stop (".") and another, but allow for the typographical convention of leaving one empty space after each full stop (". "). The navigation and selection of sentences attempt to include/exclude these additional spaces as necessary.


Inspired and largely based on [Block Travel](https://github.com/sashaweiss/vscode_block_travel). 

## Features

Navigate in a text editor by jumping over full sentences.

Includes/excludes trailing white spaces as necessary.

Stop at end of paragraph, if paragraphs does not end with a full stop. Additional calls move to the next paragraph.

Stop at beginning of paragraph, if backwards search reaches the beginning of paragraph. Additional calls move to the previous paragraph.

Select the sentence under the cursor.

The following commands and corresponding default keybindings are provided:
```
sentence-navigate.selectCurrentSentence: cmd+enter
sentence-navigate.jumpBackward: cmd+left
sentence-navigate.selectBackward: cmd+shift+left
sentence-navigate.jumpForward: cmd+right
sentence-navigate.selectForward: cmd+shift+right
```

See a demo below!

![Demo gif of block-travel at work](./demo.gif)

## Issues

Lemme know.

## Release Notes
See the [CHANGELOG](./CHANGELOG.md)
