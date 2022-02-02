// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const ModelScanner = require('./src/ModelScanner');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('Winter CMS extension is activated');

    // Initiate Model scanner
    const modelScanner = new ModelScanner(vscode);
    modelScanner.scan();

    // Register auto-completion for model keys
    vscode.languages.registerCompletionItemProvider(
        {
            scheme: 'file',
            language: 'yaml',
        },
        {
            provideCompletionItems: (document, position, token) => {
                const line = document.lineAt(position);

                if (line.isEmptyOrWhitespace || token.isCancellationRequested) {
                    return [];
                }

                const text = line.text.trim();
                if (/^model:/i.test(text)) {
                    return modelScanner.getModels().map((model) => ({ label: model }));
                }

                return [];
            },
        },
        ':',
    );
}

// this method is called when your extension is deactivated
function deactivate() {
    console.log('Winter CMS extension is deactivated');
}

module.exports = {
    activate,
    deactivate,
};
