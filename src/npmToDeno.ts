import { parse } from './command'

function convertInstallArgs (args: string[]): string[] {
  // Map npm's install flags onto `deno add`'s equivalents. `deno add` supports
  // `--dev`, `--save-exact` and `--save-optional` (as of Deno 2.9.3), so those
  // pass through; npm's default `--save`/`--save-prod` are implicit (Deno
  // always writes to the config file unless told otherwise) and dropped.
  return args.map(item => {
    switch (item) {
      case '--save-dev':
      case '--development':
      case '-D':
        return '--dev'
      case '--save-exact':
      case '-E':
        return '--save-exact'
      case '--save-optional':
      case '-O':
        return '--save-optional'
      case '--save':
      case '-S':
      case '--save-prod':
      case '-P':
        return ''
      default:
        return item
    }
  })
}

export function npmToDeno (_m: string, command: string): string {
  let args = parse((command || '').trim())

  const index = args.findIndex(a => a === '--')
  if (index >= 0) {
    args.splice(index, 1)
  }

  let cmd = 'deno'
  switch (args[0]) {
    case 'install':
    case 'i':
    case 'add':
      if (args.length === 1) {
        args = ['install']
      } else if (args.some(a => a === '-g' || a === '--global')) {
        // Global installs map to Deno's global tool installer.
        const packages = args.slice(1).filter(a => !a.startsWith('-'))
        args = ['install', '-g'].concat(packages)
      } else {
        args[0] = 'add'
        args = convertInstallArgs(args)
      }
      break
    case 'uninstall':
    case 'un':
    case 'remove':
    case 'r':
    case 'rm':
      if (args.some(a => a === '-g' || a === '--global')) {
        // Global removals use Deno's bin uninstaller (`deno uninstall --global`).
        args = ['uninstall', '--global'].concat(
          args.slice(1).filter(a => !a.startsWith('-'))
        )
      } else {
        args[0] = 'remove'
        args = args.filter(a => a !== '--save-dev' && a !== '-D')
      }
      break
    case 'ci':
      // `npm ci` -> `deno ci`
      break
    case 'outdated':
      // `npm outdated` -> `deno outdated`
      break
    case 'update':
    case 'up':
      // `npm update` -> `deno update` (alias of `deno outdated --update`)
      args[0] = 'update'
      break
    case 'run':
      // `npm run <script>` -> `deno task <script>`
      args[0] = 'task'
      break
    case 'test':
    case 't':
    case 'tst':
      // `npm test` runs the `test` script -> `deno task test`
      args[0] = 'test'
      args.unshift('task')
      break
    case 'start':
    case 'stop':
      // `npm start` -> `deno task start`
      args.unshift('task')
      break
    case 'init':
    case 'create':
      // `npm init` -> `deno init`;
      // `npm create <starter>` -> `deno create --npm <starter>`
      if (args[1] && !args[1].startsWith('-')) {
        args[0] = 'create'
        args.splice(1, 0, '--npm')
      } else {
        args[0] = 'init'
      }
      break
    case 'exec':
      // `npm exec <pkg>` -> `deno x <pkg>`
      args.splice(0, 1)
      args.unshift('x')
      break
    default:
      // No clean Deno equivalent; keep the npm command.
      cmd = 'npm'
      break
  }

  const filtered = args.filter(Boolean).filter(arg => arg !== '--')
  return `${cmd} ${filtered.join(' ')}${
    cmd === 'npm' ? "\n# couldn't auto-convert command" : ''
  }`.trim()
}
