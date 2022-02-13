const vscode = require('vscode');
const FieldsParser = require('../Parser/FieldsParser');

class FieldsCompletionProvider {
    /**
     * Model completion provider.
     *
     * Provides auto-completion options for YAML files that use a "model" key.
     */
    constructor() {
        this.keywords = {
            defaultFrom: this.processDefaultFrom,
            dependsOn: this.processDependsOn,
        };
    }

    provideCompletionItems(document, position, token) {
        const line = document.lineAt(position);

        if (line.isEmptyOrWhitespace || token.isCancellationRequested) {
            return [];
        }

        const { text } = line;
        let foundKeyword = null;

        Object.keys(this.keywords).forEach((keyword) => {
            const regex = new RegExp(`^( *${keyword}: )`, 'i');
            if (regex.test(text)) {
                foundKeyword = keyword;
            }
        });

        if (foundKeyword === null) {
            return [];
        }

        // Parse YAML document up to this point
        const parser = new FieldsParser(document, position);

        switch (foundKeyword) {
            case 'dependsOn':
                return this.processDependsOn(parser, document, position);
            default:
                break;
        }

        return [];
    }

    processDependsOn(parser, document, position) {
        if (!parser.isNestedWithin('fields', '*', 'dependsOn')) {
            return [];
        }

        return [];
    }
}

module.exports = FieldsCompletionProvider;
