const { cpuUsage } = require('process')
var vscode = require('vscode')


/**
 * Get the all occurrences of "." or ". " in a line
 * This is not the most efficient search, but can be expanded to allow for 
 * punctionation, longer tags, etc.
 * @param {Text} lineText The active text editor
 * @returns {array} 
 */
function matchLine(lineText) {
    var re = new RegExp('\\. |\\.', 'g');
    var results = []
    while (matches = re.exec(lineText)) 
    results.push(matches);
    return results
}

/**
 * For a given line, determine the nearest match earlier in the text than
 * the  startIndex position
 */
// unlike findFullStopForwards, the backwards function uses regexp. It is very likely
// less efficient, but can be expanded to allow for more complicated searches.    
function searchBackward(lineText, startIndex, isFirstSearchLine ) {
    results = matchLine(lineText)
    for (var i = results.length - 1; i >= 0; i--) {
        var endIndex = results[i].index + results[i][0].length
        // If this is the first line of the search, different rules apply, since
        // we expect to skip the first full stop. We get around this by pushing
        // the startIndex 'deeper' into the line.
        if (isFirstSearchLine == true) { startIndex -= results[i][0].length}
        // Determine if the last character of the search match (endIndex)
        // is before the startIndex or if the first match is at the very end of the line. 
        // The last condition can only applies isFirstSearchLine is false. In otherwords, it is only relevant if we start the search on a
        // line other than the current line. 
        if ((endIndex < startIndex ) || (startIndex >= lineText.length )) 
        {return endIndex}     
        }
    return false

}

function searchForward(lineText, startIndex) {
    results = matchLine(lineText)
    for (var i = 0; i < results.length; i++) {
        var endIndex = results[i].index + results[i][0].length
        if (endIndex > startIndex ) {return endIndex}     
        }
    return false
}




/**
 * Get the nearest full stop below the cursor, or the last line in the file.
 * @param {TextEditor} editor,  The active text editor
 * @returns {vscode.Position}
 */
function nextFullStop(editor) {
    const document = editor.document
    var line = editor.selection.active.line
    var startIndex = editor.selection.active.character
    var eol = document.lineAt(line).range.end.character
    var newCol = false
    if (eol == startIndex) {line += 1}
    max = document.lineCount - 1 //line -= 1 // to offset the initial ++line in the 
    do {
        var lineText = document.lineAt(line).text
        newCol = searchForward(lineText, startIndex)
        if  (!newCol && 
            (document.lineAt(line + 1).isEmptyOrWhitespace) && 
            !(document.lineAt(line).isEmptyOrWhitespace)) {newCol = lineText.trimEnd().length} 
        startIndex = 0
    } while ( (line < max) && (newCol === false) && line++) 
    // return the new position. Column is incremented by one to push cursor past the fullstop.
    var newPosn = new vscode.Position(line, newCol)
    return newPosn
}

   
function previousFullStop(editor) {
    const document = editor.document
    var line = editor.selection.active.line
    var startIndex = editor.selection.active.character
    var lineText = document.lineAt(line).text
    var newCol = false
    var isFirstSearchLine = true
    if (startIndex == 0) {line -= 1}
    do {
        lineText = document.lineAt(line).text.trimRight()
        newCol = searchBackward(lineText, startIndex, isFirstSearchLine)
        if  (!newCol && 
            (document.lineAt(line - 1).isEmptyOrWhitespace) &&          // line above is empty
            !(document.lineAt(line).isEmptyOrWhitespace)) {newCol = 0 } // but this line is not, go to begiining of line
        startIndex = document.lineAt(line - 1).range.end.character  // reset search start startIndexumn to the length of the next line
        isFirstSearchLine = false
    } while ( (line > 0) && (newCol === false) && line--) 
    var newPosn = new vscode.Position(line, newCol)
    return newPosn
}



/**
 * Move the cursor to a new position, unselecting selected text.
 * @param {TextEditor} editor The active text editor
 * @param {Position} newPosn The new position
 */
function changeActive(editor, newPosn) {
    // const anchor = editor.selection.anchor
    var newSelection = new vscode.Selection(newPosn, newPosn)
    editor.selection = newSelection
    editor.revealRange(new vscode.Range(newPosn, newPosn))
}

/**
 * Move the cursor to a new position, preserving text selection.
 * @param {TextEditor} editor The active text editor
 * @param {Positon} newPosn The new position
 */
function changeActiveSelect(editor, newPosn) {
    const anchor = editor.selection.anchor
    var newSelection = new vscode.Selection(anchor, newPosn)
    editor.selection = newSelection
    editor.revealRange(new vscode.Range(newPosn, newPosn))
}

// Move or Select forward or backwards
function sentenceJumpForward(editor) {
    changeActive(editor, nextFullStop(editor))
}

function sentenceSelectForward(editor) {
    changeActiveSelect(editor, nextFullStop(editor))
}

function sentenceJumpBackward(editor) {
    changeActive(editor, previousFullStop(editor))
}
function sentenceSelectBackward(editor) {
    changeActiveSelect(editor, previousFullStop(editor))
}

function selectCurrentSentence(editor) {
    const startPosn = previousFullStop(editor)
    const endPosn = nextFullStop(editor)
    var newSelection = new vscode.Selection(startPosn, endPosn)
    editor.selection = newSelection
    editor.revealRange(new vscode.Range(startPosn, endPosn))
}

exports.sentenceJumpBackward = sentenceJumpBackward
exports.sentenceJumpForward = sentenceJumpForward
exports.sentenceSelectBackward = sentenceSelectBackward
exports.sentenceSelectForward = sentenceSelectForward
exports.selectCurrentSentence = selectCurrentSentence
