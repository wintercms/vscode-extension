const vscode = require('vscode');

class PartialScanner {
    /**
     * Form config scanner.
     *
     * Scans for paths to the "fields.yaml" files found in modules and plugins.
     */
    constructor() {
        this.paths = [];
        this.pathWatcher = null;
    }

    getPaths(relative) {
        return this.paths.map((path) => ((relative === false) ? path.path : path.relative));
    }

    /**
     * Scans folders in the current workspace folders for form configs.
     *
     * This will look within the "modules" folders and "plugins" folders for any files that match the following
     * filenames:
     *
     * - config_form.yaml
     * - config-form.yaml
     * - form_config.yaml
     * - form-config.yaml
     */
    scan() {
        if (vscode.workspace.workspaceFolders === undefined) {
            this.paths = [];
            return;
        }

        // Scan current files
        vscode.workspace.findFiles('{modules,plugins}/**/*.{htm,html}').then(
            (results) => {
                if (results.length > 0) {
                    results.forEach((path) => {
                        this.paths.push({
                            path: path.path,
                            relative: path.path.replace(
                                vscode.workspace.getWorkspaceFolder(vscode.Uri.file(path.path)).uri.path,
                                '~',
                            ),
                        });
                    });
                }
            },
        );

        // Create and activate file watchers
        // this.pathWatcher = vscode.workspace.createFileSystemWatcher(
        //     '{modules,plugins}/**/{config_form,config-form,form_config,form-config}.yaml',
        // );
        // this.activateWatchers();
    }

}

module.exports = PartialScanner;
