# CLI

This CLI provides additional ways to interact with Designbase services that can replace or supplement workflows that might be more cumbersome in the web UI, like pushing code. The CLI is still a work in progress, so feel free to request new features or report any bugs you might find.

## Installation

This CLI is currently distributed via `npm`. We recommend installing it globally so you can call it from any directory.

```sh
npm i -g @designbase/cli

# Verify it works
designbase
```

## Setup

You'll need to be authenticated to run most of the commands. To authenticate, run `designbase login` and provide your email address and password. A JWT will be cached in a config directory and used for future requests.

You can always check your authentication status with `designbase whoami`. Most commands will verify your token is still valid before proceeding with any requests.

## Commands

### login

This command will authenticate your access to Designbase via the same email & password you use to login to the web UI. If you run and complete a login while you're already logged in, your token will be refreshed (or changed, if you logged in as a different user.)

```sh
USAGE
  $ designbase login
```

### pull

Similar to `git pull`, this command will retrieve files from the Designbase server for a specified design system version (published or unpublished) and write them as files on your local filesystem.

```sh
USAGE
  $ designbase pull [-v <value>] [-d <value>] [-f]

FLAGS
  -d, --directory=<value>  [default: .] Directory to write source files to.
  -f, --force              Write the source files without a confirmation prompt
  -v, --version=<value>    Id or published version number to pull files from. For example: v0.0.43, 0.0.43, or 66461c33e633cbb0adf030ab
```

### push

Similar to `git push`, this command push design system files from your local filesystem to the Designbase server. This command will only work for versions that are unpublished.

```sh
USAGE
  $ designbase push [--acceptTokensJson] [--acceptIconSvgs] [--deletePathsNotSpecified] [-d <value>] [-e <value>...] [-v <value>]

FLAGS
  -d, --directory=<value>        [default: .] Directory to read source files from.
  -e, --exclude=<value>...       Glob pattern to exclude from pushing. For example, designbase push --exclude "**/*.md" would recursively exclude any markdown files.
  -v, --versionId=<value>        Id to push files to. For example: 66461c33e633cbb0adf030ab. Published version numbers are not accepted because published versions cannot be modified.
      --acceptIconSvgs           Push changes to SVG files in the packages/core/assets/icon directory.
      --acceptTokensJson         Push changes to the tokens.json file.
      --deletePathsNotSpecified  Delete existing paths on the Designbase server that are not present in  push.
```

> [!NOTE]  
> By default, changes to SVG files in the `packages/core/assets/icon` directory will be ignored unless explicitly opted in with the `--acceptIconSvgs` flag, since they don't change as often and are likely managed by a designer.

> [!NOTE]  
> By default, changes to the `tokens.json` file will not be ignored unless explicitly opted in with the `--acceptTokensJson` flag, since they don't change as often and are likely managed by a designer.

> [!CAUTION]  
> Pushes are "upsert-only" by default. This means that existing source files, icons, or tokens won't be deleted if they are not provided in the push (i.e. excluded via the `--exclude` flag, changes to the `tokens.json` file without `--acceptTokensJson`, etc.). If you want to delete existing resources that are not provided in the push, you can specify the `--deletePathsNotSpecified` flag, which will delete any resources that are present on the server but not in the push.

### whoami

This command will display your current authentication status. If you're logged in, you'll see what email address you're authenticated with. If your token is invalid or expired, it should tell you to login again.

```sh
USAGE
  $ designbase whoami
```

## Advanced

### Building from source for local development

For local development, follow the instructions below to clone the repo, install dependencies and run a build. After the CLI is built and installed globally, you can run `npm run build:watch` in another tab to easily test changes.

```sh
# Clone the repository and navigate to it
git clone git@github.com:Fabrikant-Tech/cli.git && cd cli

# Ensure you're using the right node version
nvm use

# Install dependencies required to run the cli
npm i

# Run a production build
npm run build

# Install the CLI globally so it is available in your path
npm i -g .

# Verify it works
designbase

# You can also double check that you're pointing to the local version of the CLI
# If it's pointing to your local version instead of a version from npm, you should see a referenced directory
# For example: └── @designbase/cli@0.0.1 -> ./../../../../../cli
npm ls -g @designbase/cli
```

### Specifying the API base url

If you need to target a different API (such as the development API, or a local API server), you can set the `DESIGNBASE_API_BASE_URL` environment variable when running commands.

```sh
DESIGNBASE_API_BASE_URL=http://localhost:8080 designbase login
```
