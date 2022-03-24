// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const FieldsCompletionProvider = require('./src/CompletionProviders/FieldsCompletionProvider');
const FormFieldsScanner = require('./src/Scanners/FormFieldsScanner');
const ModelScanner = require('./src/Scanners/ModelScanner');
const PartialScanner = require('./src/Scanners/PartialScanner');

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

    // Initiate form fields scanner
    const formFieldsScanner = new FormFieldsScanner();
    formFieldsScanner.scan();

    // Initiate partial scanner
    const partialScanner = new PartialScanner();
    partialScanner.scan();

    // Register completion providers
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(
        { scheme: 'file', language: 'yaml' },
        new FieldsCompletionProvider(partialScanner, modelScanner),
    ));
}

// this method is called when your extension is deactivated
function deactivate() {
    console.log('Winter CMS extension is deactivated');
}

module.exports = {
    activate,
    deactivate,
};
