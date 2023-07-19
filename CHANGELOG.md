# Changelog

## v0.4.0 - 19th July, 2023

- Added highlighting of Block templates for the Winter CMS [Blocks plugin](https://github.com/wintercms/wn-blocks-plugin).
- Fixed `lazy` property for tabs definition (thanks @AIC-BV)
- Added note about enabling Emmet shortcuts to readme (thanks @joaocosta-azores)

## v0.3.1 - 12th January, 2023

- Updated Node dependencies to fix potential security issue.

## v0.3.0 - 9th January, 2023

- Added highlighting of Syntax Parser variables and tags within Twig content.
- Added highlighting of interpolated variables within Twig double-quoted strings.
- Added definitions of additional configuration options for several fields and widgets, including dropdowns, color pickers, code editors and tabs.
- Fixed support for custom field types.
- Added support for short-hand preset definition.

## v0.2.0 - 21st March, 2022

- Added all field types and widgets to form definition.
- Added all base configuration values to the form definition.
- Added autocomplete for all values that use fields (ie. `trigger`, `preset`, `defaultFrom`). You should be able to see an autocomplete of all fields available in the current form.
- Improved highlighting of the INI section for CMS templates.
- Improved highlighting of brackets in the Twig section for CMS templates.

## v0.1.1 - 16th February, 2022

- HTML/Twig-only Winter templates no longer need a section boundary (==) to be interpreted correctly
- Commenting now works in all sections

## v0.1.0 - 11th February, 2022

- Initial release of extension.
- Added syntax highlight of CMS templates.
- Added Twig filters and functions provided by Winter.
