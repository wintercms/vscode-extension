const YAML = require('yaml');
const vscode = require('vscode');

class FieldsParser {
    constructor(document, position) {
        this.document = document;
        this.structure = YAML.parseDocument(this.document.getText(new vscode.Range(
            new vscode.Position(0, 0),
            position,
        )));

        this.currentHierarchy = this.getCurrentHierarchy();
        this.currentValue = this.getCurrentValue();
    }

    isNestedWithin(...hierarchy) {
        const startIndex = this.currentHierarchy.indexOf(hierarchy[0]);

        if (startIndex === -1) {
            return false;
        }

        const currentHierarchy = this.getCurrentHierarchy().slice(startIndex, startIndex + hierarchy.length);
        const dropIndexes = [];

        for (let i = 0; i < hierarchy.length; i += 1) {
            if (hierarchy[i] === '*') {
                dropIndexes.push(i);
            }
        }

        dropIndexes.forEach((index) => {
            currentHierarchy.splice(index, 1);
            hierarchy.splice(index, 1);
        });

        return JSON.stringify(currentHierarchy) === JSON.stringify(hierarchy);
    }

    getCurrentHierarchy() {
        const hierarchy = [];

        return this.parseHierarchy(hierarchy, null, this.structure.contents.items);
    }

    parseHierarchy(hierarchy, key, items) {
        if (key) {
            hierarchy.push(key);
        }

        if (items.length) {
            const last = items[items.length - 1];

            if (last.value.type === 'MAP') {
                this.parseHierarchy(hierarchy, last.key.value, last.value.items);
            } else {
                hierarchy.push(last.key.value);
            }
        }

        return hierarchy;
    }

    getCurrentValue() {

    }

    getParsedFullStructure() {
        return YAML.parse(this.document.getText());
    }

    getFieldNames() {
        const fields = [];
        const fullStructure = this.getParsedFullStructure();

        if (fullStructure.fields) {
            Object.keys(fullStructure.fields).forEach((field) => {
                if (fields.indexOf(field) === -1) {
                    fields.push(field);
                }
            });
        }

        if (fullStructure.tabs && fullStructure.tabs.fields) {
            Object.keys(fullStructure.tabs.fields).forEach((field) => {
                if (fields.indexOf(field) === -1) {
                    fields.push(field);
                }
            });
        }

        if (fullStructure.secondaryTabs && fullStructure.secondaryTabs.fields) {
            Object.keys(fullStructure.secondaryTabs.fields).forEach((field) => {
                if (fields.indexOf(field) === -1) {
                    fields.push(field);
                }
            });
        }

        fields.sort();

        return fields;
    }
}

module.exports = FieldsParser;
