# Winter VSCode Extension

![Banner](https://github.com/wintercms/vscode-extension/raw/main/assets/banner.png?raw=true)

The official Visual Studio Code extension for Winter CMS, providing syntax highlighting, code completion and useful assistive features for developers working on Winter projects.

This extension is currently in preview and is not feature-complete.

## Features

**Currently available**

- Syntax highlighting for CMS template files and Winter CMS Block templates.
- Twig definition for Winter-provided Twig functions and filters.

**Planned for v1.0.0**

- YAML schema validation and code completion for the following configurations:
    - Form field definitions (`fields.yaml`)
    - List column definitions (`columns.yaml`)
    - Form behaviour configuration (`config_form.yaml`)
    - List behaviour configuration (`config_list.yaml`)
    - Relation behaviour configuration (`config_releation.yaml`)
    - Reorder behaviour configuration (`config_reorder.yaml`)
    - Import/export behaviour configuration (`config_import_export.yaml`)
- Code completion for CMS templates:
    - Main template definitions in INI section
    - Component configuration in INI section
    - Component variables in `{% component %}` tag

## Screenshot

![Screenshot](https://github.com/wintercms/vscode-extension/raw/main/assets/screenshot.png?raw=true)

## Requirements

The YAML validation will require the [YAML plugin](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml) provided by Red Hat. This will be installed automatically with this extension.

## Additional notes

To enable [Emmet features](https://docs.emmet.io/) in theme templates, add the following to the `emmet.includeLanguages` setting in your `settings.json` in VSCode.

```
"emmet.includeLanguages": {
    "wintercms": "html"
}
```
