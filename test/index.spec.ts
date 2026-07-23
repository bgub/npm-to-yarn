/* global it, expect, describe */

import convert from '../src'

describe('NPM tests', () => {
  const tests: [npm: string, yarn: string, pnpm: string, bun: string][] = [
    // install
    ['npm install', 'yarn install', 'pnpm install', 'bun install'],
    ['npm i', 'yarn install', 'pnpm i', 'bun install'],
    ['npm i squirrelly', 'yarn add squirrelly', 'pnpm add squirrelly', 'bun add squirrelly'],
    ['npm install squirrelly', 'yarn add squirrelly', 'pnpm add squirrelly', 'bun add squirrelly'],
    [
      'npm install my--save-dev',
      'yarn add my--save-dev',
      'pnpm add my--save-dev',
      'bun add my--save-dev',
    ],
    [
      'npm install squirrelly --no-package-lock',
      'yarn add squirrelly --no-lockfile',
      'pnpm add squirrelly --frozen-lockfile',
      'bun add squirrelly --no-save',
    ],
    [
      'npm install squirrelly --save-optional',
      'yarn add squirrelly --optional',
      'pnpm add squirrelly --save-optional',
      'bun add squirrelly --optional',
    ],
    [
      'npm install squirrelly -O',
      'yarn add squirrelly --optional',
      'pnpm add squirrelly -O',
      'bun add squirrelly --optional',
    ],
    [
      'npm install squirrelly --save-exact',
      'yarn add squirrelly --exact',
      'pnpm add squirrelly --save-exact',
      'bun add squirrelly --exact',
    ],
    [
      'npm install squirrelly -E',
      'yarn add squirrelly --exact',
      'pnpm add squirrelly -E',
      'bun add squirrelly --exact',
    ],
    [
      'npm install squirrelly --save-dev',
      'yarn add squirrelly --dev',
      'pnpm add squirrelly --save-dev',
      'bun add squirrelly --dev',
    ],
    [
      'npm install squirrelly -D',
      'yarn add squirrelly --dev',
      'pnpm add squirrelly -D',
      'bun add squirrelly --dev',
    ],
    [
      'npm install squirrelly --save-prod',
      'yarn add squirrelly --production',
      'pnpm add squirrelly --save-prod',
      'bun add squirrelly --production',
    ],
    [
      'npm install squirrelly -P',
      'yarn add squirrelly --production',
      'pnpm add squirrelly -P',
      'bun add squirrelly --production',
    ],
    [
      'npm install squirrelly --save',
      'yarn add squirrelly',
      'pnpm add squirrelly',
      'bun add squirrelly',
    ],
    [
      'npm install squirrelly -S',
      'yarn add squirrelly',
      'pnpm add squirrelly',
      'bun add squirrelly',
    ],
    [
      'npm install squirrelly --global',
      'yarn global add squirrelly',
      'pnpm add squirrelly --global',
      'bun add squirrelly --global',
    ],
    [
      'npm install squirrelly -g',
      'yarn global add squirrelly',
      'pnpm add squirrelly -g',
      'bun add squirrelly --global',
    ],
    [
      'npm install squirrelly --no-save',
      'yarn add squirrelly --no-save',
      'pnpm add squirrelly --no-save',
      'bun add squirrelly --no-save',
    ],
    // uninstall
    ['npm r squirrelly', 'yarn remove squirrelly', 'pnpm remove squirrelly', 'bun remove squirrelly'],
    ['npm remove squirrelly', 'yarn remove squirrelly', 'pnpm remove squirrelly', 'bun remove squirrelly'],
    ['npm uninstall squirrelly', 'yarn remove squirrelly', 'pnpm remove squirrelly', 'bun remove squirrelly'],
    [
      'npm un squirrelly',
      'yarn remove squirrelly',
      'pnpm remove squirrelly',
      'bun remove squirrelly',
    ],
    [
      'npm uninstall squirrelly --global',
      'yarn global remove squirrelly',
      'pnpm remove squirrelly --global',
      'bun remove squirrelly --global',
    ],
    // cache
    [
      'npm cache clean',
      'yarn cache clean',
      "npm cache clean\n# couldn't auto-convert command",
      'bun pm cache rm',
    ],
    // version
    [
      'npm version',
      'yarn version',
      "npm version\n# couldn't auto-convert command",
      "npm version\n# couldn't auto-convert command",
    ],
    [
      'npm version major',
      'yarn version --major',
      "npm version major\n# couldn't auto-convert command",
      "npm version major\n# couldn't auto-convert command",
    ],
    [
      'npm version minor',
      'yarn version --minor',
      "npm version minor\n# couldn't auto-convert command",
      "npm version minor\n# couldn't auto-convert command",
    ],
    [
      'npm version patch',
      'yarn version --patch',
      "npm version patch\n# couldn't auto-convert command",
      "npm version patch\n# couldn't auto-convert command",
    ],
    // rebuild
    ['npm rebuild', 'yarn add --force', 'pnpm rebuild', 'bun add --force'],
    ['npm rb', 'yarn add --force', 'pnpm rebuild', 'bun add --force'],
    [
      'npm rebuild package',
      'yarn add package --force',
      'pnpm rebuild --filter package',
      'bun add package --force',
    ],
    [
      'npm rb package',
      'yarn add package --force',
      'pnpm rebuild --filter package',
      'bun add package --force',
    ],
    // run
    ['npm run', 'yarn run', 'pnpm run', 'bun run'],
    ['npm run package', 'yarn package', 'pnpm run package', 'bun run package'],
    [
      'npm run test -- --version',
      'yarn run test --version',
      'pnpm run test --version',
      'bun run test --version',
    ],
    ['npm run test -- -v', 'yarn run test -v', 'pnpm run test -v', 'bun run test -v'],
    ['npm run custom', 'yarn custom', 'pnpm run custom', 'bun run custom'],
    ['npm run add', 'yarn run add', 'pnpm run add', 'bun run add'],
    ['npm run install', 'yarn run install', 'pnpm run install', 'bun run install'],
    ['npm run run', 'yarn run run', 'pnpm run run', 'bun run run'],
    ['npm exec custom', 'yarn custom', 'pnpm exec custom', 'bunx custom'],
    ['npm exec add', 'yarn run add', 'pnpm exec add', 'bunx add'],
    ['npm exec install', 'yarn run install', 'pnpm exec install', 'bunx install'],
    ['npm exec run', 'yarn run run', 'pnpm exec run', 'bunx run'],
    ['npm exec custom -- --version', 'yarn custom --version', 'pnpm exec custom --version', 'bunx custom --version'],
    // test
    ['npm test', 'yarn test', 'pnpm test', 'bun run test'],
    ['npm t', 'yarn test', 'pnpm test', 'bun run test'],
    ['npm tst', 'yarn test', 'pnpm test', 'bun run test'],
    [
      'npm test -- --version',
      'yarn test --version',
      'pnpm test --version',
      'bun run test --version',
    ],
    ['npm test -- -v', 'yarn test -v', 'pnpm test -v', 'bun run test -v'],
    // unchanged
    ['npm start', 'yarn start', 'pnpm start', 'bun start'],
    ['npm stop', 'yarn stop', "npm stop\n# couldn't auto-convert command", 'bun stop'],
    // unsupported
    [
      'npm whoami',
      "npm whoami\n# couldn't auto-convert command",
      "npm whoami\n# couldn't auto-convert command",
      "npm whoami\n# couldn't auto-convert command",
    ],
    // init
    ['npm init', 'yarn init', 'pnpm init', 'bun init'],
    ['npm init -y', 'yarn init -y', 'pnpm init -y', 'bun init -y'],
    ['npm init --yes', 'yarn init --yes', 'pnpm init --yes', 'bun init --yes'],
    ['npm init --scope', 'yarn init', 'pnpm init', 'bun init --scope'],
    ['npm init --private', 'yarn init --private', 'pnpm init --private', 'bun init --private'],
    [
      'npm init --unknown-arg',
      'yarn init --unknown-arg',
      'pnpm init --unknown-arg',
      'bun init --unknown-arg',
    ],
    ['npm init esm --yes', 'yarn create esm --yes', 'pnpm create esm --yes', 'bunx create-esm --yes'],
    [
      'npm init @scope/my-package',
      'yarn create @scope/my-package',
      'pnpm create @scope/my-package',
      'bunx @scope/create-my-package',
    ],
    [
      'npm init react-app ./my-react-app',
      'yarn create react-app ./my-react-app',
      'pnpm create react-app ./my-react-app',
      'bunx create-react-app ./my-react-app',
    ],
    // create
    [
      'npm create react-app ./my-react-app',
      'yarn create react-app ./my-react-app',
      'pnpm create react-app ./my-react-app',
      'bunx create-react-app ./my-react-app',
    ],
    [
      'npm create vite@latest',
      'yarn create vite',
      'pnpm create vite',
      'bunx create-vite',
    ],
    // list
    ['npm list', 'yarn list', 'pnpm list', 'bun pm ls'],
    ['npm ls', 'yarn list', 'pnpm ls', 'bun pm ls'],
    [
      'npm list --production',
      'yarn list --production',
      'pnpm list --prod',
      'bun pm ls --production',
    ],
    ['npm list --development', 'yarn list --development', 'pnpm list --dev', 'bun pm ls --dev'],
    ['npm list --global', 'yarn list --global', 'pnpm list --global', 'bun pm ls --global'],
    ['npm list --depth=0', 'yarn list --depth=0', 'pnpm list --depth 0', 'bun pm ls --depth 0'],
    ['npm list package', 'yarn list --pattern "package"', 'pnpm list package', 'bun pm ls package'],
    [
      'npm list package package2',
      'yarn list --pattern "package|package2"',
      'pnpm list package package2',
      'bun pm ls package package2',
    ],
    [
      'npm list @scope/package @scope/package2',
      'yarn list --pattern "@scope/package|@scope/package2"',
      'pnpm list @scope/package @scope/package2',
      'bun pm ls @scope/package @scope/package2',
    ],
    [
      'npm list @scope/package @scope/package2 --depth=2',
      'yarn list --pattern "@scope/package|@scope/package2" --depth=2',
      'pnpm list @scope/package @scope/package2 --depth 2',
      'bun pm ls @scope/package @scope/package2 --depth 2',
    ],
    [
      'npm list @scope/package @scope/package2 --depth 2',
      'yarn list --pattern "@scope/package|@scope/package2" --depth 2',
      'pnpm list @scope/package @scope/package2 --depth 2',
      'bun pm ls @scope/package @scope/package2 --depth 2',
    ],
    [
      'npm list @scope/package --json',
      'yarn list --pattern "@scope/package" --json',
      'pnpm list @scope/package --json',
      'bun pm ls @scope/package --json',
    ],
    // link
    ['npm ln', 'yarn link', 'pnpm link', 'bun link'],
    ['npm ln package', 'yarn link package', 'pnpm link package', 'bun link package'],
    ['npm link', 'yarn link', 'pnpm link', 'bun link'],
    ['npm link package', 'yarn link package', 'pnpm link package', 'bun link package'],
    // unlink
    ['npm unlink', 'yarn unlink', 'pnpm unlink', 'bun unlink'],
    [
      'npm unlink package',
      'yarn unlink package',
      'pnpm unlink --filter package',
      'bun unlink package',
    ],
    // outdated
    [
      'npm outdated',
      'yarn outdated',
      'pnpm outdated',
      "npm outdated\n# couldn't auto-convert command",
    ],
    [
      'npm outdated --json',
      'yarn outdated --json',
      'pnpm outdated --json',
      "npm outdated --json\n# couldn't auto-convert command",
    ],
    [
      'npm outdated --long',
      'yarn outdated --long',
      'pnpm outdated --long',
      "npm outdated --long\n# couldn't auto-convert command",
    ],
    [
      'npm outdated lodash',
      'yarn outdated lodash',
      'pnpm outdated lodash',
      "npm outdated lodash\n# couldn't auto-convert command",
    ],
    // pack
    ['npm pack', 'yarn pack', 'pnpm pack', "npm pack\n# couldn't auto-convert command"],
    [
      'npm pack --pack-destination=foobar',
      'yarn pack --filename foobar',
      'pnpm pack --pack-destination foobar',
      "npm pack --pack-destination foobar\n# couldn't auto-convert command",
    ],
  ];

  describe('to Yarn', () => {
    it.each(tests)('%s', (npmValue, yarnValue) => {
      expect(convert(npmValue, 'yarn')).toEqual(yarnValue)
    })
  })

  describe('to PNPM', () => {
    it.each(tests)('%s', (npmValue, _yarnValue, pnpmValue) => {
      expect(convert(npmValue, 'pnpm')).toEqual(pnpmValue)
    })
  })

  describe('to Bun', () => {
    it.each(tests)('%s', (npmValue, _yarnValue, _pnpmValue, bunValue) => {
      expect(convert(npmValue, 'bun')).toEqual(bunValue)
    })
  })
})

describe('Yarn to NPM tests', () => {
  const tests = [
    // install
    ['yarn', 'npm install'],
    ['yarn install', 'npm install'],
    // add
    ['yarn add squirrelly', 'npm install squirrelly'],
    ['yarn add squirrelly --no-lockfile', 'npm install squirrelly --no-package-lock'],
    ['yarn add squirrelly --optional', 'npm install squirrelly --save-optional'],
    ['yarn add squirrelly --exact', 'npm install squirrelly --save-exact'],
    ['yarn add squirrelly --production', 'npm install squirrelly --save-prod'],
    ['yarn add squirrelly --dev', 'npm install squirrelly --save-dev'],
    ['yarn add --force', 'npm rebuild'],
    ['yarn add package --force', 'npm install package --force'],
    // remove
    ['yarn remove squirrelly', 'npm uninstall squirrelly'],
    ['yarn remove squirrelly --dev', 'npm uninstall squirrelly --save-dev'],
    // cache
    ['yarn cache clean', 'npm cache clean'],
    // implied run
    ['yarn grunt', 'npm run grunt'],
    // global
    ['yarn global add squirrelly', 'npm install squirrelly --global'],
    ['yarn global remove squirrelly', 'npm uninstall squirrelly --global'],
    ['yarn global squirrelly', "npm global squirrelly \n# couldn't auto-convert command"],
    ['yarn global list', 'npm ls --global'],
    // version
    ['yarn version', 'npm version'],
    ['yarn version --major', 'npm version major'],
    ['yarn version --minor', 'npm version minor'],
    ['yarn version --patch', 'npm version patch'],
    // init
    ['yarn init', 'npm init'],
    ['yarn init -y', 'npm init -y'],
    ['yarn init --yes', 'npm init --yes'],
    ['yarn init --private', 'npm init --private'],
    ['yarn init --unknown-arg', 'npm init --unknown-arg'],
    // create
    ['yarn create esm --yes', 'npm init esm --yes'],
    ['yarn create @scope/my-package', 'npm init @scope/my-package'],
    ['yarn create react-app ./my-react-app', 'npm init react-app ./my-react-app'],
    // unchanged
    ['yarn start', 'npm start'],
    ['yarn stop', 'npm stop'],
    ['yarn test', 'npm test'],
    // run
    ['yarn run', 'npm run'],
    ['yarn custom', 'npm run custom'],
    ['yarn run custom', 'npm run custom'],
    ['yarn run add', 'npm run add'],
    ['yarn run install', 'npm run install'],
    ['yarn run run', 'npm run run'],
    ['yarn run --silent', 'npm run --silent'],
    ['yarn custom -- --version', 'npm run custom -- --version'],
    ['yarn run custom -- --version', 'npm run custom -- --version'],
    ['yarn run custom --version', 'npm run custom --version'],
    // list
    ['yarn list', 'npm ls'],
    ['yarn list --pattern "package"', 'npm ls package'],
    ['yarn list --pattern "package|package2"', 'npm ls package package2'],
    [
      'yarn list --pattern "@scope/package|@scope/package2"',
      'npm ls @scope/package @scope/package2'
    ],
    ['yarn list --depth 2', 'npm ls --depth 2'],
    ['yarn list --json', 'npm ls --json'],
    ['yarn list --production', 'npm ls --production'],
    ['yarn list --development', 'npm ls --development'],
    // link/unlink
    ['yarn link', 'npm link'],
    ['yarn link custom', 'npm link custom'],
    ['yarn unlink', 'npm unlink'],
    ['yarn unlink custom', 'npm unlink custom'],
    // outdated
    ['yarn outdated', 'npm outdated'],
    ['yarn outdated --json', 'npm outdated --json'],
    ['yarn outdated --long', 'npm outdated --long'],
    ['yarn outdated lodash', 'npm outdated lodash'],
    // pack
    ['yarn pack', 'npm pack'],
    ['yarn pack --filename foobar', 'npm pack --pack-destination foobar'],
    // unsupported
    ['yarn why', "npm why\n# couldn't auto-convert command"],
    ['yarn upgrade-interactive', "npm upgrade-interactive\n# couldn't auto-convert command"]
  ]

  it.each(tests)('%s', (yarnValue, npmValue) => {
    expect(convert(yarnValue, 'npm')).toEqual(npmValue)
  })
})

describe('to yarn dlx tests', () => {
  const tests: [npm: string, yarn: string][] = [
    // npx -> ...
    [
      'npx create-next-app',
      'yarn dlx create-next-app',
    ],
    [
      'npx prettier --help',
      'yarn dlx prettier --help',
    ],
    [
      'npx prettier -w .',
      'yarn dlx prettier -w .',
    ],
    [
      'npx @neutrinojs/create-project my-app',
      'yarn dlx @neutrinojs/create-project my-app',
    ],
    [
      'npx create-react-app my-app --template typescript',
      'yarn dlx create-react-app my-app --template typescript',
    ],
    // pnpm dlx -> ...
    [
      'pnpm dlx create-next-app',
      'yarn dlx create-next-app',
    ],
    [
      'pnpm dlx prettier --help',
      'yarn dlx prettier --help',
    ],
    [
      'pnpm dlx prettier -w .',
      'yarn dlx prettier -w .',
    ],
    [
      'pnpm dlx @neutrinojs/create-project my-app',
      'yarn dlx @neutrinojs/create-project my-app',
    ],
    [
      'pnpm dlx create-react-app my-app --template typescript',
      'yarn dlx create-react-app my-app --template typescript',
    ],
    // bun x -> ...
    [
      'bun x create-next-app',
      'yarn dlx create-next-app',
    ],
    [
      'bun x prettier --help',
      'yarn dlx prettier --help',
    ],
    [
      'bun x prettier -w .',
      'yarn dlx prettier -w .',
    ],
    [
      'bun x @neutrinojs/create-project my-app',
      'yarn dlx @neutrinojs/create-project my-app',
    ],
    [
      'bun x create-react-app my-app --template typescript',
      'yarn dlx create-react-app my-app --template typescript',
    ],
  ]

  describe('to Yarn', () => {
    it.each(tests)('%s', (npmValue, yarnValue) => {
      expect(convert(npmValue, 'yarn')).toEqual(yarnValue)
    })
  })
})

describe('to pnpm dlx tests', () => {
  const tests: [npm: string, pnpm: string][] = [
    // npx -> ...
    [
      'npx create-next-app',
      'pnpm dlx create-next-app',
    ],
    [
      'npx prettier --help',
      'pnpm dlx prettier --help',
    ],
    [
      'npx prettier -w .',
      'pnpm dlx prettier -w .',
    ],
    [
      'npx @neutrinojs/create-project my-app',
      'pnpm dlx @neutrinojs/create-project my-app',
    ],
    [
      'npx create-react-app my-app --template typescript',
      'pnpm dlx create-react-app my-app --template typescript',
    ],
    // yarn dlx -> ...
    [
      'yarn dlx create-next-app',
      'pnpm dlx create-next-app',
    ],
    [
      'yarn dlx prettier --help',
      'pnpm dlx prettier --help',
    ],
    [
      'yarn dlx prettier -w .',
      'pnpm dlx prettier -w .',
    ],
    [
      'yarn dlx @neutrinojs/create-project my-app',
      'pnpm dlx @neutrinojs/create-project my-app',
    ],
    [
      'yarn dlx create-react-app my-app --template typescript',
      'pnpm dlx create-react-app my-app --template typescript',
    ],
    // bun x -> ...
    [
      'bun x create-next-app',
      'pnpm dlx create-next-app',
    ],
    [
      'bun x prettier --help',
      'pnpm dlx prettier --help',
    ],
    [
      'bun x prettier -w .',
      'pnpm dlx prettier -w .',
    ],
    [
      'bun x @neutrinojs/create-project my-app',
      'pnpm dlx @neutrinojs/create-project my-app',
    ],
    [
      'bun x create-react-app my-app --template typescript',
      'pnpm dlx create-react-app my-app --template typescript',
    ],
  ]

  describe('to PNPM', () => {
    it.each(tests)('%s', (npmValue, pnpmValue) => {
      expect(convert(npmValue, 'pnpm')).toEqual(pnpmValue)
    })
  })
})

describe('to bun x tests', () => {
  const tests: [npm: string, bun: string][] = [
    // npx -> ...
    [
      'npx create-next-app',
      'bun x create-next-app',
    ],
    [
      'npx prettier --help',
      'bun x prettier --help',
    ],
    [
      'npx prettier -w .',
      'bun x prettier -w .',
    ],
    [
      'npx @neutrinojs/create-project my-app',
      'bun x @neutrinojs/create-project my-app',
    ],
    [
      'npx create-react-app my-app --template typescript',
      'bun x create-react-app my-app --template typescript',
    ],
    // yarn dlx -> ...
    [
      'yarn dlx create-next-app',
      'bun x create-next-app',
    ],
    [
      'yarn dlx prettier --help',
      'bun x prettier --help',
    ],
    [
      'yarn dlx prettier -w .',
      'bun x prettier -w .',
    ],
    [
      'yarn dlx @neutrinojs/create-project my-app',
      'bun x @neutrinojs/create-project my-app',
    ],
    [
      'yarn dlx create-react-app my-app --template typescript',
      'bun x create-react-app my-app --template typescript',
    ],
    // pnpm dlx -> ...
    [
      'pnpm dlx create-next-app',
      'bun x create-next-app',
    ],
    [
      'pnpm dlx prettier --help',
      'bun x prettier --help',
    ],
    [
      'pnpm dlx prettier -w .',
      'bun x prettier -w .',
    ],
    [
      'pnpm dlx @neutrinojs/create-project my-app',
      'bun x @neutrinojs/create-project my-app',
    ],
    [
      'pnpm dlx create-react-app my-app --template typescript',
      'bun x create-react-app my-app --template typescript',
    ],
  ]

  describe('to Bun', () => {
    it.each(tests)('%s', (npmValue, bunValue) => {
      expect(convert(npmValue, 'bun')).toEqual(bunValue)
    })
  })
})

describe('NPM to Deno tests', () => {
  const tests: [npm: string, deno: string][] = [
    // install
    ['npm install', 'deno install'],
    ['npm i', 'deno install'],
    ['npm install squirrelly', 'deno add squirrelly'],
    ['npm i squirrelly', 'deno add squirrelly'],
    ['npm install foo bar', 'deno add foo bar'],
    ['npm install squirrelly --save-dev', 'deno add squirrelly --dev'],
    ['npm install squirrelly -D', 'deno add squirrelly --dev'],
    ['npm install squirrelly --save', 'deno add squirrelly'],
    ['npm install squirrelly --save-exact', 'deno add squirrelly --save-exact'],
    ['npm install squirrelly -E', 'deno add squirrelly --save-exact'],
    [
      'npm install squirrelly --save-optional',
      'deno add squirrelly --save-optional',
    ],
    ['npm install squirrelly -O', 'deno add squirrelly --save-optional'],
    ['npm install squirrelly --no-save', 'deno add squirrelly --no-save'],
    // package names that merely contain an executor substring are not executors
    ['npm install npx', 'deno add npx'],
    ['npm install npx-prettier', 'deno add npx-prettier'],
    ['npm install -g squirrelly', 'deno install -g squirrelly'],
    ['npm install squirrelly -g', 'deno install -g squirrelly'],
    // uninstall / remove
    ['npm uninstall squirrelly', 'deno remove squirrelly'],
    ['npm remove squirrelly', 'deno remove squirrelly'],
    ['npm r squirrelly', 'deno remove squirrelly'],
    ['npm rm squirrelly', 'deno remove squirrelly'],
    ['npm uninstall -g squirrelly', 'deno uninstall --global squirrelly'],
    // ci / outdated / update
    ['npm ci', 'deno ci'],
    ['npm outdated', 'deno outdated'],
    ['npm update', 'deno update'],
    ['npm update foo', 'deno update foo'],
    // run / test / start / stop
    ['npm run', 'deno task'],
    ['npm run build', 'deno task build'],
    ['npm test', 'deno task test'],
    ['npm t', 'deno task test'],
    ['npm start', 'deno task start'],
    ['npm stop', 'deno task stop'],
    // init / create
    ['npm init', 'deno init'],
    ['npm init -y', 'deno init -y'],
    ['npm init esm --yes', 'deno create --npm esm --yes'],
    ['npm create vite', 'deno create --npm vite'],
    ['npm create @scope/foo', 'deno create --npm @scope/foo'],
    // exec
    ['npm exec custom', 'deno x custom'],
    ['npm exec custom -- --version', 'deno x custom --version'],
    // npx -> deno x
    ['npx create-next-app', 'deno x create-next-app'],
    ['npx prettier --help', 'deno x prettier --help'],
    ['npx prettier -w .', 'deno x prettier -w .'],
    [
      'npx @neutrinojs/create-project my-app',
      'deno x @neutrinojs/create-project my-app',
    ],
    // no clean Deno equivalent -> keep npm command
    ['npm dedupe', "npm dedupe\n# couldn't auto-convert command"],
  ]

  it.each(tests)('%s', (npmValue, denoValue) => {
    expect(convert(npmValue, 'deno')).toEqual(denoValue)
  })
})

describe('NPM to Nub tests', () => {
  const tests: [npm: string, nub: string][] = [
    // install
    ['npm install', 'nub install'],
    ['npm i', 'nub i'],
    ['npm install squirrelly', 'nub add squirrelly'],
    ['npm i squirrelly', 'nub add squirrelly'],
    ['npm install foo bar', 'nub add foo bar'],
    ['npm install squirrelly --save-dev', 'nub add squirrelly --save-dev'],
    ['npm install squirrelly -D', 'nub add squirrelly -D'],
    ['npm install squirrelly --save', 'nub add squirrelly'],
    ['npm install squirrelly -S', 'nub add squirrelly'],
    ['npm install squirrelly --save-exact', 'nub add squirrelly --save-exact'],
    ['npm install squirrelly -E', 'nub add squirrelly -E'],
    ['npm install squirrelly --save-optional', 'nub add squirrelly --save-optional'],
    ['npm install squirrelly -O', 'nub add squirrelly -O'],
    ['npm install squirrelly --no-package-lock', 'nub add squirrelly --frozen-lockfile'],
    // package names that merely contain an executor substring are not executors
    ['npm install nubx', 'nub add nubx'],
    ['npm install nubx-prettier', 'nub add nubx-prettier'],
    // global
    ['npm install -g squirrelly', 'nub add -g squirrelly'],
    ['npm install squirrelly --global', 'nub add squirrelly --global'],
    // uninstall / remove
    ['npm uninstall squirrelly', 'nub remove squirrelly'],
    ['npm remove squirrelly', 'nub remove squirrelly'],
    ['npm r squirrelly', 'nub remove squirrelly'],
    ['npm rm squirrelly', 'nub remove squirrelly'],
    ['npm uninstall -g squirrelly', 'nub remove -g squirrelly'],
    // ci / dedupe / prune / outdated / update
    ['npm ci', 'nub ci'],
    ['npm dedupe', 'nub dedupe'],
    ['npm prune', 'nub prune'],
    ['npm outdated', 'nub outdated'],
    ['npm update', 'nub update'],
    ['npm update foo', 'nub update foo'],
    ['npm up', 'nub update'],
    // rebuild / list / link
    ['npm rebuild', 'nub rebuild'],
    ['npm rb', 'nub rebuild'],
    ['npm ls', 'nub ls'],
    ['npm list', 'nub list'],
    ['npm link', 'nub link'],
    ['npm ln', 'nub link'],
    ['npm unlink', 'nub unlink'],
    ['npm pack', 'nub pack'],
    // run: nub always needs an explicit `run`, never a bare-script shortcut
    ['npm run', 'nub run'],
    ['npm run build', 'nub run build'],
    ['npm run dev', 'nub run dev'],
    // test / start / stop run scripts -> `nub run <script>`
    ['npm test', 'nub run test'],
    ['npm t', 'nub run test'],
    ['npm start', 'nub run start'],
    ['npm stop', 'nub run stop'],
    // init / create: nub has no `create` verb
    ['npm init', 'nub init'],
    ['npm init -y', 'nub init -y'],
    ['npm init esm --yes', 'nubx create-esm --yes'],
    ['npm create vite', 'nubx create-vite'],
    ['npm create @scope/foo', 'nubx @scope/create-foo'],
    // exec -> nubx
    ['npm exec custom', 'nubx custom'],
    ['npm exec custom -- --version', 'nubx custom --version'],
    // npx -> nubx
    ['npx create-next-app', 'nubx create-next-app'],
    ['npx prettier --help', 'nubx prettier --help'],
    ['npx prettier -w .', 'nubx prettier -w .'],
    ['npx @neutrinojs/create-project my-app', 'nubx @neutrinojs/create-project my-app'],
    // no clean nub equivalent -> keep npm command
    ['npm doctor', "npm doctor\n# couldn't auto-convert command"],
  ]

  it.each(tests)('%s', (npmValue, nubValue) => {
    expect(convert(npmValue, 'nub')).toEqual(nubValue)
  })
})

describe('to nubx tests', () => {
  const tests: [source: string, nub: string][] = [
    // npx -> ...
    ['npx create-next-app', 'nubx create-next-app'],
    ['npx prettier --help', 'nubx prettier --help'],
    ['npx prettier -w .', 'nubx prettier -w .'],
    ['npx @neutrinojs/create-project my-app', 'nubx @neutrinojs/create-project my-app'],
    ['npx create-react-app my-app --template typescript', 'nubx create-react-app my-app --template typescript'],
    // yarn dlx -> ...
    ['yarn dlx create-next-app', 'nubx create-next-app'],
    ['yarn dlx prettier --help', 'nubx prettier --help'],
    // pnpm dlx -> ...
    ['pnpm dlx create-next-app', 'nubx create-next-app'],
    ['pnpm dlx prettier --help', 'nubx prettier --help'],
    // bun x -> ...
    ['bun x create-next-app', 'nubx create-next-app'],
    ['bun x prettier --help', 'nubx prettier --help'],
  ]

  it.each(tests)('%s', (sourceValue, nubValue) => {
    expect(convert(sourceValue, 'nub')).toEqual(nubValue)
  })
})
