const vscode = require('vscode');

class ModelCompletionProvider {
    /**
     * Model completion provider.
     *
     * Provides auto-completion options for YAML files that use a "model" key.
     */
    constructor(modelScanner) {
        this.modelScanner = modelScanner;
        this.keywords = {
            model: this.model,
        };
    }

    provideCompletionItems(document, position, token) {
        const line = document.lineAt(position);

        if (line.isEmptyOrWhitespace || token.isCancellationRequested) {
            return [];
        }

        const { text } = line;
        if (/^( *model: )/i.test(text)) {
            const startPos = new vscode.Position(position.line, /^( *model: )/i.exec(text)[1].length);
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
