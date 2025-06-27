# @designbase/cli

Designbase CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@designbase/cli.svg)](https://npmjs.org/package/@designbase/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@designbase/cli.svg)](https://npmjs.org/package/@designbase/cli)

<!-- toc -->

- [Usage](#usage)
- [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g @designbase/cli
$ designbase COMMAND
running command...
$ designbase (--version)
@designbase/cli/0.0.0 darwin-arm64 node-v22.7.0
$ designbase --help [COMMAND]
USAGE
  $ designbase COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`designbase hello PERSON`](#designbase-hello-person)
- [`designbase hello world`](#designbase-hello-world)
- [`designbase help [COMMAND]`](#designbase-help-command)
- [`designbase plugins`](#designbase-plugins)
- [`designbase plugins add PLUGIN`](#designbase-plugins-add-plugin)
- [`designbase plugins:inspect PLUGIN...`](#designbase-pluginsinspect-plugin)
- [`designbase plugins install PLUGIN`](#designbase-plugins-install-plugin)
- [`designbase plugins link PATH`](#designbase-plugins-link-path)
- [`designbase plugins remove [PLUGIN]`](#designbase-plugins-remove-plugin)
- [`designbase plugins reset`](#designbase-plugins-reset)
- [`designbase plugins uninstall [PLUGIN]`](#designbase-plugins-uninstall-plugin)
- [`designbase plugins unlink [PLUGIN]`](#designbase-plugins-unlink-plugin)
- [`designbase plugins update`](#designbase-plugins-update)

## `designbase hello PERSON`

Say hello

```
USAGE
  $ designbase hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ designbase hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/fabrikant-tech/cli/blob/v0.0.0/src/commands/hello/index.ts)_

## `designbase hello world`

Say hello world

```
USAGE
  $ designbase hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ designbase hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/fabrikant-tech/cli/blob/v0.0.0/src/commands/hello/world.ts)_

## `designbase help [COMMAND]`

Display help for designbase.

```
USAGE
  $ designbase help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for designbase.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.29/src/commands/help.ts)_

## `designbase plugins`

List installed plugins.

```
USAGE
  $ designbase plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ designbase plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.42/src/commands/plugins/index.ts)_

## `designbase plugins add PLUGIN`

Installs a plugin into designbase.

```
USAGE
  $ designbase plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into designbase.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the DESIGNBASE_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the DESIGNBASE_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ designbase plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ designbase plugins add myplugin

  Install a plugin from a github url.

    $ designbase plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ designbase plugins add someuser/someplugin
```

## `designbase plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ designbase plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ designbase plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.42/src/commands/plugins/inspect.ts)_

## `designbase plugins install PLUGIN`

Installs a plugin into designbase.

```
USAGE
  $ designbase plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into designbase.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the DESIGNBASE_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the DESIGNBASE_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ designbase plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ designbase plugins install myplugin

  Install a plugin from a github url.

    $ designbase plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ designbase plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.42/src/commands/plugins/install.ts)_

## `designbase plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ designbase plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ designbase plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.42/src/commands/plugins/link.ts)_

## `designbase plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ designbase plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ designbase plugins unlink
  $ designbase plugins remove

EXAMPLES
  $ designbase plugins remove myplugin
```

## `designbase plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ designbase plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.42/src/commands/plugins/reset.ts)_

## `designbase plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ designbase plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ designbase plugins unlink
  $ designbase plugins remove

EXAMPLES
  $ designbase plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.42/src/commands/plugins/uninstall.ts)_

## `designbase plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ designbase plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ designbase plugins unlink
  $ designbase plugins remove

EXAMPLES
  $ designbase plugins unlink myplugin
```

## `designbase plugins update`

Update installed plugins.

```
USAGE
  $ designbase plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.42/src/commands/plugins/update.ts)_

<!-- commandsstop -->
