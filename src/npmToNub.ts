import { parse } from './command'

function convertInstallArgs (args: string[]): string[] {
  // nub's PM CLI mirrors pnpm's, so its install flags follow pnpm's: `--save`/`-S`
  // is the default and dropped, `--no-package-lock` maps to `--frozen-lockfile`,
  // and everything else (`-D`/`--save-dev`, `-g`/`--global`, `-E`/`--save-exact`,
  // `-O`/`--save-optional`, …) passes through unchanged.
  return args.map(item => {
    switch (item) {
      case '--save':
      case '-S':
        return ''
      case '--no-package-lock':
        return '--frozen-lockfile'
      default:
        return item
    }
  })
}

export function npmToNub (_m: string, command: string): string {
  let args = parse((command || '').trim())

  const index = args.findIndex(a => a === '--')
  if (index >= 0) {
    args.splice(index, 1)
  }

  let cmd = 'nub'
  switch (args[0]) {
    case 'install':
    case 'i':
      // `npm install` -> `nub install`; with packages -> `nub add <pkgs>`
      if (args.filter(item => !item.startsWith('-')).length > 1) {
        args[0] = 'add'
      }
      args = convertInstallArgs(args)
      break
    case 'uninstall':
    case 'un':
    case 'remove':
    case 'r':
    case 'rm':
      args[0] = 'remove'
      args = convertInstallArgs(args)
      break
    case 'ci':
      // clean, strict install from the lockfile
      break
    case 'dedupe':
    case 'prune':
    case 'outdated':
      break
    case 'update':
    case 'up':
      args[0] = 'update'
      break
    case 'rebuild':
    case 'rb':
      args[0] = 'rebuild'
      break
    case 'ls':
    case 'list':
      break
    case 'run':
      // nub always requires an explicit `run`; it has no implicit script shortcut,
      // so `npm run <script>` maps 1:1 and never collapses to `nub <script>`.
      break
    case 'test':
    case 't':
    case 'tst':
      // nub has no `nub test`; the `test` script runs via `nub run test`.
      args = ['run', 'test'].concat(args.slice(1))
      break
    case 'start':
    case 'stop':
      // Same rule: `npm start`/`npm stop` run scripts -> `nub run <script>`.
      args.unshift('run')
      break
    case 'init':
    case 'create':
      // nub has no `create` verb: an initializer runs its `create-*` package via
      // nubx, while a bare `npm init` scaffolds through `nub init`.
      if (args[1] && args[1].startsWith('@')) {
        cmd = 'nubx'
        args[1] = args[1].replace('/', '/create-')
        args = args.slice(1)
      } else if (args[1] && !args[1].startsWith('-')) {
        cmd = 'nubx'
        args[1] = `create-${args[1].replace('@latest', '')}`
        args = args.slice(1)
      } else {
        args[0] = 'init'
      }
      break
    case 'exec':
      // `npm exec <pkg>` fetches-and-runs -> `nubx <pkg>`.
      cmd = 'nubx'
      args.splice(0, 1)
      break
    case 'link':
    case 'ln':
      args[0] = 'link'
      break
    case 'unlink':
    case 'pack':
      break
    default:
      // No clean nub equivalent; keep the npm command.
      cmd = 'npm'
      break
  }

  const filtered = args.filter(Boolean).filter(arg => arg !== '--')
  return `${cmd} ${filtered.join(' ')}${
    cmd === 'npm' ? "\n# couldn't auto-convert command" : ''
  }`.trim()
}
