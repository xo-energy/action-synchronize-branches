jest.unmock("../src/synchronize");

const path = require("path");
const { getChildRepositories } = require("../src/synchronize");

describe("getChildRepositories", () => {
  test("finds this repository", async () => {
    const children = await getChildRepositories("..");
    const current = path.resolve(".");
    expect(children).toContain(current);
  });
  test("finds no children of this repository", async () => {
    const children = await getChildRepositories(".");
    expect(children).toEqual([]);
  });
});
