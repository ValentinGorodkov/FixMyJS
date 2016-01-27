import * as vscode from 'vscode';
var fixmyjs = require('fixmyjs');

export function activate(context: vscode.ExtensionContext) {

    var disposable = vscode.commands.registerCommand('extension.fixmyjs', () => {

        let config = vscode.workspace.getConfiguration().get('extension.fixmyjs');

        let editor = vscode.window.activeTextEditor;
        let fileText = editor.document.getText();
        let stringOfCode = '';
        
        try {
            let stringOfCode = fixmyjs.fix(fileText, config);
        }
        catch (error) {
            vscode.window.showInformationMessage(error.message);
            return;
        }

        editor.edit(builder => {
            let document = editor.document;
            let lastLine = document.lineAt(document.lineCount - 1);

            let start = new vscode.Position(0, 0);
            let end = new vscode.Position(document.lineCount - 1, lastLine.text.length);

            builder.replace(new vscode.Range(start, end), stringOfCode);
        });
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}