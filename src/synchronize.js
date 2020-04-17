const core = require("@actions/core");
const { context } = require("@actions/github");
const fs = require("fs");
const simpleGit = require("simple-git/promise");
const { basename, join: joinPath, resolve: resolvePath } = require("path");

/**
 * Get the path to each git repository in a directory.
 * @param {string} path the directory to search
 * @returns {Promise<string[]>} an array of paths
 */
async function getChildRepositories(path) {
  const dir = fs.opendirSync(path);
  const children = [];
  let entry;

  // eslint-disable-next-line no-await-in-loop
  while ((entry = await dir.read())) {
    const resolved = resolvePath(path, entry.name);
    if (entry.isDirectory() && fs.existsSync(joinPath(resolved, ".git"))) {
      children.push(resolved);
    }
  }

  dir.closeSync();
  return children;
}

/**
 * Attempt to fetch a matching branch in every git repository in a directory
 * @param {string} path the directory containing the repositories to synchronize
 */
async function synchronizeBranches(path) {
  if (context.ref === "refs/heads/master" || context.ref.startsWith("refs/tags/")) {
    core.info(`Skipping synchronize for ${context.ref}`);
    return;
  }

  const branch = basename(context.ref);
  const children = (await getChildRepositories(path)).filter(
    (child) => basename(child) !== context.repo.repo
  );

  for (let i = 0; i < children.length; ++i) {
    const child = children[i];
    const name = basename(child);
    const git = simpleGit(child);

    // try to fetch a branch with the same name
    // eslint-disable-next-line no-await-in-loop
    await git
      .silent(true)
      .fetch(["--no-tags", "--prune", "--no-recurse-submodules", "--depth=1", "origin", branch])
      .then(
        () => {
          core.info(`Checking out ${name} ${branch}`);
          git.checkout(["--force", "-B", branch, "FETCH_HEAD"]);
        },
        (e) => {
          if (e.message && e.message.includes("couldn't find remote ref")) {
            const reason = e.message
              .trim()
              .split(/(?:[\r\n]+|\s*:\s*)/)
              .pop();
            core.info(`Not synchronized in ${name}: ${reason}`);
          } else {
            throw e;
          }
        }
      );
  }
}

module.exports = { getChildRepositories, synchronizeBranches };
