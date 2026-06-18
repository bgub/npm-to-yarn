import { parse } from './command'

function convertInstallArgs (args: string[]): string[] {
  // Deno's `deno add` mostly conforms to the other managers' add flags, but it
  // has no concept of the various npm `--save*` flags (dependencies are always
  // written to the config file), so those are dropped.
  return args.map(item => {
    switch (item) {
      case '--save-dev':
      case '--development':
      case '-D':
        return '--dev'
      case '--save':
      case '-S':
      case '--save-prod':
      case '-P':
      case '--save-exact':
      case '-E':
      case '--no-save':
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
        // Global installs map to Deno's global tool installer, which needs an
        // explicit `npm:` specifier since there is no local config to resolve from.
        const rest = args.slice(1).filter(a => a !== '-g' && a !== '--global')
        const packages = rest.filter(a => !a.startsWith('-')).map(p => `npm:${p}`)
        const flags = rest.filter(a => a.startsWith('-'))
        args = ['install', '-g'].concat(packages).concat(flags)
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
      args[0] = 'remove'
      args = args.filter(
        a => a !== '-g' && a !== '--global' && a !== '--save-dev' && a !== '-D'
      )
      break
    case 'run':
      // `npm run <script>` -> `deno task <script>`
      args[0] = 'task'
      break
    case 'test':
    case 't':
    case 'tst':
      args[0] = 'test'
      break
    case 'start':
    case 'stop':
      // `npm start` -> `deno task start`
      args.unshift('task')
      break
    case 'init':
    case 'create':
      if (args[1]) {
        if (args[1].startsWith('@')) {
          // `npm init @scope/foo` -> `deno run -A npm:@scope/create-foo`
          cmd = 'deno run -A'
          args[1] = `npm:${args[1].replace('/', '/create-')}`
          args = args.slice(1)
        } else if (!args[1].startsWith('-')) {
          // `npm create foo` -> `deno run -A npm:create-foo`
          cmd = 'deno run -A'
          args[1] = `npm:create-${args[1].replace('@latest', '')}`
          args = args.slice(1)
        } else {
          args[0] = 'init'
        }
      } else {
        args[0] = 'init'
      }
      break
    case 'exec':
      // `npm exec <pkg>` -> `deno run -A npm:<pkg>`
      cmd = 'deno run -A'
      args.splice(0, 1)
      if (args[0]) {
        args[0] = `npm:${args[0]}`
      }
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
