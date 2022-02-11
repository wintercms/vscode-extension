const vscode = require('vscode');

class ModelCompletionProvider {
    /**
     * Model completion provider.
     *
     * Provides auto-completion options for YAML files that use a "model" key.
     */
    constructor(modelScanner) {
        this.modelScanner = modelScanner;
    }

    provideCompletionItems(document, position, token) {
        const line = document.lineAt(position);
        console.log(line);

        if (line.isEmptyOrWhitespace || token.isCancellationRequested) {
            return [];
        }

        const { text } = line;
        console.log(text);
        if (/^( *model(Class)?: )/i.test(text)) {
            console.log('Hit model');
            const startPos = new vscode.Position(position.line, /^( *model(Class)?: )/i.exec(text)[1].length);
            const endPos = position;

            return this.modelScanner.getModels().map((model) => ({
                label: model,
                insertText: model,
                range: new vscode.Range(startPos, endPos),
            }));
        }

        return [];
    }
}

module.exports = ModelCompletionProvider;
