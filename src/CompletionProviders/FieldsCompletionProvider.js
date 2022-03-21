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

    provideCompletionItems(document, position, token, context) {
        const line = document.lineAt(position);

        if (line.isEmptyOrWhitespace || token.isCancellationRequested) {
            return [];
        }

        // Parse YAML document up to this point
        const parser = new FieldsParser(document, position);

        // Handle "dependsOn" completion
        if (parser.isNestedWithin('fields', '*', 'dependsOn')) {
            return this.processDependsOn(parser, document, position);
        }

        return [];
    }

    processDependsOn(parser, document, position) {
        const fields = parser.getFieldNames();
        const line = document.lineAt(position);
        const { text } = line;

        // Find correct starting point, as dependsOn can be a string or an array
        let startPos;
        let endPos;

        if (/^ *dependsOn: *\[/i.test(text)) {
            // Single-line array - NOT SUPPORTED: Seems to clash with our square bracket support for nested fields

            // startPos = (text.lastIndexOf(',', position.character) !== -1)
            //     ? text.lastIndexOf(',', position.character)
            //     : text.indexOf('[');
            // startPos = new vscode.Position(position.line, startPos);

            // endPos = (text.indexOf(',', position.character) !== -1)
            //     ? text.indexOf(',', position.character)
            //     : text.indexOf(']');
            // if (endPos === -1) {
            //     endPos = position;
            // } else {
            //     endPos = new vscode.Position(position.line, endPos);
            // }
            return [];
        }
        if (/^ *dependsOn: *[^[]/i.test(text)) {
            // String
            startPos = new vscode.Position(position.line, /^( *dependsOn: )/i.exec(text)[1].length);
            endPos = position;
        } else if (/^ *- /.test(text)) {
            // Multi-line array
            startPos = new vscode.Position(position.line, /^( *- )/i.exec(text)[1].length);
            endPos = position;
        }

        return fields.map((field) => ({
            label: field,
            insertText: field,
            range: new vscode.Range(startPos, endPos),
        }));
    }
}

module.exports = FieldsCompletionProvider;
