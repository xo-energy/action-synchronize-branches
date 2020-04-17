const core = require("@actions/core");
const { synchronizeBranches } = require("./synchronize");

async function main() {
  try {
    await synchronizeBranches();
  } catch (e) {
    core.setFailed(e.message);
  }
}

if (require.main === module) main();
