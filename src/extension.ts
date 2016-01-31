import * as vscode from 'vscode';
var fixmyjs = require('fixmyjs');

export function activate(context: vscode.ExtensionContext) {

    var disposable = vscode.commands.registerCommand('extensions.fixmyjs', () => {

        let config: any = vscode.workspace.getConfiguration().get('extensions.fixmyjs');

        if (config.path) {
            try {
                config = require(vscode.workspace.rootPath + config.path);
            }
            catch (error) {
                showError(error.message);
                return;
            }
        }

        let editor = vscode.window.activeTextEditor;
        let fileText = editor.document.getText();
        let stringOfCode = '';

        try {
            stringOfCode = fixmyjs.fix(fileText, config);
        }
        catch (error) {
            showError(error.message);
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

function showError(message) {
    vscode.window.showInformationMessage(message);
}

// this method is called when your extension is deactivated
export function deactivate() {
}