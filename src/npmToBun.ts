import { parse } from './command'
import { installsPackages } from './utils'

function convertInstallArgs (args: string[]) {
  // bun uses -g and --global flags
  // bun mostly conforms to Yarn's CLI
  return args.map(item => {
    switch (item) {
      case '--save-dev':
      case '--development':
      case '-D':
        return '--dev'
      case '--save-prod':
      case '-P':
        return '--production'
      case '--no-package-lock':
        return '--no-save'
      case '--save-optional':
      case '-O':
        return '--optional'
      case '--save-exact':
      case '-E':
        return '--exact'
      case '--save':
      case '-S':
        // this is default in bun
        return ''
      case '--global':
      case '-g':
        return '--global'
      default:
        return item
    }
  })
}

export const bunCLICommands = [
  'init',
  'run',
  'add',
  'pm',
  'help',
  'install',
  'remove',
  'upgrade',
  'version'
] as const
type bunCLICommands = typeof bunCLICommands[number]

export function npmToBun (_m: string, command: string): string {
  let args = parse((command || '').trim())

  const index = args.findIndex(a => a === '--')
  if (index >= 0) {
    args.splice(index, 1)
  }

  let cmd = 'bun'
  switch (args[0]) {
    case 'install':
    case 'i':
      args[0] = installsPackages(args) ? 'add' : 'install'
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
    case 'cache':
      if (args[1] === 'clean') {
        args = ['pm', 'cache', 'rm'].concat(args.slice(2))
      } else {
        cmd = 'npm'
      }
      break
    case 'rebuild':
    case 'rb':
      args[0] = 'add'
      args.push('--force')
      break
    case 'run':
      break
    case 'list':
    case 'ls':
      // 'npm ls' => 'bun pm ls'
      args = convertInstallArgs(args)
      args[0] = 'ls'
      args.unshift('pm')
      break
    case 'init':
    case 'create':
      if (args[1]) {
        if (args[1].startsWith('@')) {
          cmd = 'bunx'

          args[1] = args[1].replace('/', '/create-')
          args = args.slice(1)
        } else if (!args[1].startsWith('-')) {
          cmd = 'bunx'
          args[1] = `create-${args[1].replace('@latest', '')}`
          args = args.slice(1)
        } else {
          args[0] = 'init'
        }
      }
      break

    case 'link':
    case 'ln':
      args = convertInstallArgs(args)
      args[0] = 'link'
      break
    case 'stop':
    case 'start':
    case 'unlink':
      break
    case 'test':
    case 't':
    case 'tst':
      args[0] = 'test'
      args.unshift('run')
      break
    case 'exec':
      cmd = 'bunx'
      args.splice(0, 1)
      break
    default:
      // null == keep `npm` command
      cmd = 'npm'
      break
  }

  const filtered = args.filter(Boolean).filter(arg => arg !== '--')
  return `${cmd} ${filtered.join(' ')}${
    cmd === 'npm' ? "\n# couldn't auto-convert command" : ''
  }`.replace('=', ' ')
}
