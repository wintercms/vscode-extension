const vscode = require('vscode');
const PhpParser = require('php-parser');

class ModelScanner {
    /**
     * Model scanner.
     *
     * Scans for models in a Winter CMS instance and provides autocomplete options for various YAML configurations.
     *
     * @param {vscode} vsInst The VSCode instance
     */
    constructor(vsInst) {
        this.vsInst = vsInst;
        this.models = [];
        this.moduleWatcher = null;
        this.pluginWatcher = null;

        this.parser = new PhpParser({
            parser: {
                extractDoc: false,
                php7: true,
            },
        });
    }

    getModels() {
        return this.models.map((item) => item.model);
    }

    /**
     * Scans folders in the current workspace folders for models.
     *
     * This will look within the "modules" folders and "plugins" folders for a "models" directory. If PHP files are
     * found in these directories, these will then be scanned and made available as autocomplete options.
     */
    scan() {
        if (this.vsInst.workspace.workspaceFolders === undefined) {
            this.models = [];
            return;
        }

        // Scan current files
        this.vsInst.workspace.findFiles('modules/*/models/*.php').then(
            (results) => {
                if (results.length > 0) {
                    results.forEach((model) => {
                        this.addModel(model);
                    });
                }
            },
        );
        this.vsInst.workspace.findFiles('plugins/*/*/models/*.php').then(
            (results) => {
                if (results.length > 0) {
                    results.forEach((model) => {
                        this.addModel(model);
                    });
                }
            },
        );

        // Create and activate file watchers
        this.moduleWatcher = this.vsInst.workspace.createFileSystemWatcher(
            'modules/*/models/*.php',
        );
        this.pluginWatcher = this.vsInst.workspace.createFileSystemWatcher(
            'plugins/*/*/models/*.php',
        );
        // this.activateWatchers();
    }

    /**
     * Records a model found in the workspace, and parses it for use.
     *
     * @param {vscode.Uri} model
     */
    addModel(model) {
        this.vsInst.workspace.fs.readFile(model).then(
            (file) => {
                let tokens;

                try {
                    tokens = this.parser.tokenGetAll(file);
                } catch (error) {
                    console.log('Error parsing model for PHP tokens.', model, error);
                    return;
                }

                // Determine namespace
                const namespace = this.tokenBetween(tokens, 'T_NAMESPACE', ';').trim();
                const className = this.tokenBetween(tokens, 'T_CLASS', ['T_EXTENDS', 'T_IMPLEMENTS', '{']).trim();

                if (className !== undefined) {
                    this.models.push({
                        model: (namespace !== undefined) ? `${namespace}\\${className}` : className,
                        url: model,
                    });
                }
            },
        );
    }

    /**
     * Returns a string of content between two given token types.
     *
     * You must provide one start token, however, you can provide multiple end token that act as the delimiter.
     *
     * The content will not include the start token, but will include the end token.
     *
     * @param {Array[]} tokens
     * @param {String} startToken
     * @param {String|String[]} endToken
     *
     * @returns {String|undefined}
     */
    tokenBetween(tokens, startToken, endToken) {
        let currentIndex = 0;
        let startIndex = 0;
        let startFound = false;
        let endIndex = 0;
        let endFound = false;
        const endTokens = (typeof endToken === 'string')
            ? [endToken]
            : endToken;

        // Find starting point
        do {
            let token;

            if (typeof tokens[currentIndex] === 'string') {
                token = tokens[currentIndex];
            } else {
                [token] = tokens[currentIndex];
            }

            if (token === startToken) {
                startIndex = currentIndex + 1;
                startFound = true;
                break;
            }

            currentIndex += 1;
        } while (currentIndex < tokens.length);

        // If we could not find the starting point anywhere, return undefined
        if (!startFound) {
            return undefined;
        }

        // Find end point
        currentIndex = startIndex;

        do {
            let token;

            if (typeof tokens[currentIndex] === 'string') {
                token = tokens[currentIndex];
            } else {
                [token] = tokens[currentIndex];
            }

            if (endTokens.indexOf(token) !== -1) {
                endIndex = currentIndex;
                endFound = true;
                break;
            }

            currentIndex += 1;
        } while (currentIndex < tokens.length);

        // If we could not find an ending point anywhere, return undefined
        if (!endFound) {
            return undefined;
        }

        const contentTokens = tokens.slice(startIndex, endIndex);
        let content = '';

        contentTokens.forEach((contentToken) => {
            const tokenContent = (typeof contentToken === 'string')
                ? contentToken
                : contentToken[1];

            content = `${content}${tokenContent}`;
        });

        return content;
    }
}

module.exports = ModelScanner;
