const vscode = require('vscode');

class PluginFileScanner {
    /**
     * Plugin file scanner.
     *
     * Scans for paths to the "Plugin.php" files found in plugins, and the "ServiceProvider.php" file within modules.
     */
    constructor() {
        this.paths = [];
        this.pathWatcher = null;
    }

    getPaths(relative) {
        return this.paths.map((path) => ((relative === false) ? path.path : path.relative));
    }

    /**
     * Scans folders in the current workspace folders for plugin and module provider files.
     */
    scan() {
        if (vscode.workspace.workspaceFolders === undefined) {
            this.paths = [];
            return;
        }

        // Scan current files
        vscode.workspace.findFiles('{modules}/*/ServiceProvider.php').then(
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
        vscode.workspace.findFiles('{plugins}/*/*/Plugin.php').then(
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

module.exports = PluginFileScanner;
