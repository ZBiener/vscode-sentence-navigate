var vscode = require('vscode');
var sentences = require('./sentences.js');

function activate(context) {

    console.log('sentence-navigate activated, registering commands...');

    var jumpBackward = vscode.commands.registerTextEditorCommand("sentence-navigate.jumpBackward", function(editor) {
        sentences.sentenceJumpBackward(editor)
    });
    var selectBackward = vscode.commands.registerTextEditorCommand("sentence-navigate.selectBackward", function(editor) {
        sentences.sentenceSelectBackward(editor)
    })
    var jumpForward = vscode.commands.registerTextEditorCommand("sentence-navigate.jumpForward", function(editor) {
        sentences.sentenceJumpForward(editor)
    });
    var selectForward = vscode.commands.registerTextEditorCommand("sentence-navigate.selectForward", function(editor) {
        sentences.sentenceSelectForward(editor)
    });
    var selectCurrentSentence = vscode.commands.registerTextEditorCommand("sentence-navigate.selectCurrentSentence", function(editor) {
        sentences.selectCurrentSentence(editor)
    })

    context.subscriptions.push(jumpBackward, selectBackward, jumpForward, selectForward, selectCurrentSentence);
    console.log("Commands registered.")
}
exports.activate = activate;

function deactivate() {
    // Currently nothing...
}
exports.deactivate = deactivate;