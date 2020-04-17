const core = require("@actions/core");
const { synchronizeBranches } = require("./synchronize");

async function main() {
  try {
    const path = core.getInput("path", { required: true });
    await synchronizeBranches(path);
  } catch (e) {
    core.setFailed(e.message);
  }
}

if (require.main === module) main();
