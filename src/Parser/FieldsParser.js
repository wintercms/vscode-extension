const YAML = require('yaml');
const vscode = require('vscode');

class FieldsParser {
    constructor(document, position) {
        this.document = document;
        this.structure = YAML.parseDocument(document.getText(new vscode.Range(
            new vscode.Position(0, 0),
            position,
        )));

        this.currentHierarchy = this.getCurrentHierarchy();
        this.currentValue = this.getCurrentValue();
    }

    isNestedWithin(...hierarchy) {
        const startIndex = this.scurrentHierarchy.indexOf(hierarchy[0]);

        if (startIndex === -1) {
            return false;
        }

        const currentHierarchy = this.getCurrentHierarchy().slice(startIndex, hierarchy.length);
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
}

module.exports = FieldsParser;
