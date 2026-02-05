# PR #65 Review: Adding support for Deno

## Summary

This PR adds Deno as a fifth conversion target for npm-to-yarn, introducing `src/npmToDeno.ts`, updating the routing in `src/index.ts`, extending the test suite, and updating the README. While the intent is good and Deno support would be a valuable addition, the PR has significant issues that prevent it from working correctly.

## Build-Breaking Issues

### 1. Test suite does not compile (7 test tuples missing the Deno column)

The test array type was updated to a 5-tuple `[npm, yarn, pnpm, bun, deno]`, but several test entries still only have 4 elements. This causes TypeScript compilation errors that prevent **any** tests from running:

- `npm whoami` (line 225)
- `npm outdated` / `npm outdated --json` / `npm outdated --long` / `npm outdated lodash` (lines 338-361)
- `npm pack` / `npm pack --pack-destination=foobar` (lines 363-369)

Each of these needs a 5th element with the expected Deno output.

## Correctness Issues (hidden behind compilation failure)

Because the test suite cannot compile, the following mismatches between the implementation in `npmToDeno.ts` and the test expectations are currently hidden:

### 2. `npm test` / `npm t` / `npm tst`

- **Code produces**: `deno test`
- **Test expects**: `deno run test` (line 210)

### 3. `npm run test` drops extra arguments

The `run` case (line 105-118) only uses `scriptName` and discards all additional arguments. For `npm run test -- --version`, the code produces `deno task test` but the test expects `deno run test -- --version`.

### 4. `npm exec` conversion mismatch

- **Code produces**: `deno run -A --allow-scripts npm:custom`
- **Test expects**: `deno run custom` (line 204)

Also, `-A` (all permissions) already implies `--allow-scripts`, making the flags redundant.

### 5. `npm cache clean` mismatch

- **Code produces**: `deno clean` (line 159)
- **Test expects**: `deno cache --reload` (line 141)

### 6. `npm create` mismatch

- **Code produces**: `deno init --npm react-app ./my-react-app` (using non-existent `deno init --npm`)
- **Test expects**: `deno npm:create-react-app ./my-react-app` (line 265)

### 7. `npm init` loses flags and arguments

The `init` case (line 137-138) only returns `deno init` without forwarding any flags or arguments. `npm init -y` should produce `deno init -y`, `npm init esm --yes` should produce `deno init esm`, etc.

### 8. `npm start` mismatch

- **Code produces**: `deno run start` (line 154)
- **Test expects**: `deno start` (line 222)

### 9. Multiple commands not handled (fall through to default)

The following commands have no case in the switch statement and fall through to the default, producing an unhelpful fallback message instead of the expected Deno equivalent:

- `npm rebuild` / `npm rb` — tests expect `deno run npm:rebuild`
- `npm list` / `npm ls` — tests expect `deno list`
- `npm link` / `npm ln` — tests expect `deno link`
- `npm unlink` — tests expect `deno unlink`
- `npm stop` — tests expect `deno stop`

### 10. Executor command mapping produces wrong output

`executorCommands.deno` is set to `'deno run --allow-all npm:'` in `utils.ts`, but the executor tests (lines 710-795) expect output like `deno run npm:create-next-app` (no `--allow-all`). Additionally, since the conversion uses simple string replacement (`str.replace(executor, executorCommands[to])`), replacing `npx` in `npx create-next-app` with `deno run --allow-all npm:` produces `deno run --allow-all npm: create-next-app` (note the spurious space before the package name).

## Semantic Concerns

### 11. `npm update` → `deno upgrade` is incorrect

`deno upgrade` upgrades the Deno runtime itself, not project dependencies. The npm equivalent would be more like `deno outdated --update` or may not have a direct equivalent.

### 12. `deno init --npm` does not exist

The `create` case uses `deno init --npm`, which is not a valid Deno CLI command.

## Style & Convention Issues

### 13. Structural pattern mismatch

The existing converters (`npmToYarn`, `npmToPnpm`, `npmToBun`) use a table/object-based dispatch pattern. The Deno converter uses a large switch statement. While functionally equivalent, this diverges from the established codebase conventions.

### 14. Fallback message differs from convention

Other converters use `"npm " + command + "\n# couldn't auto-convert command"`. The Deno converter uses a much longer message with a documentation URL. This creates inconsistency in error output format across targets.

### 15. Minor JSDoc formatting issue

Line 13 of `npmToDeno.ts` is missing a leading space:
```
* npm install express → deno install npm:express
* npm run test → deno test          ← missing leading space
```

### 16. README additions duplicate existing content

The new "Features" and "Usage" sections appended at the bottom repeat information already present in the README's existing API documentation section.

## Recommendations

1. **Fix the 7 incomplete test tuples** so the test suite compiles.
2. **Align the implementation with the test expectations** (or vice versa) — currently many conversions don't match. It would help to decide on the correct Deno equivalents first, then update both code and tests together.
3. **Handle missing commands** (`list`, `link`, `unlink`, `stop`, `rebuild`) or explicitly route them through the fallback.
4. **Fix the executor command** — either remove `--allow-all` from the mapping or update the test expectations. Also address the trailing-space issue with string replacement for `npm:` prefixed executors.
5. **Verify Deno CLI semantics** — commands like `deno upgrade`, `deno init --npm`, and `deno cache --reload` should be checked against current Deno documentation.
6. **Consider adopting the table-based pattern** used by other converters for consistency.
7. **Remove the duplicate README sections** at the bottom.
