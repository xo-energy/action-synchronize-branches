# GitHub Action - Synchronize Branches

This GitHub Action (written in JavaScript) checks out a branch with the same name as the context (`github.ref`) branch in each repository in a directory. This helps synchronize multi-repo builds when working on related feature branches in different repositories.

## Usage

### Inputs

- `path`: Directory containing the repositories to synchronize. Defaults to the workspace working directory.
