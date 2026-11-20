import { installsPackages, unchangedCLICommands, yarnCLICommands } from './utils'
import { parse } from './command'

function convertInstallArgs (args: string[]) {
  if (args.includes('--global') || args.includes('-g')) {
    args.unshift('global')
  }

  return args.map(item => {
    switch (item) {
      case '--save-dev':
      case '-D':
        return '--dev'
      case '--save-prod':
      case '-P':
        return '--production'
      case '--no-package-lock':
        return '--no-lockfile'
      case '--save-optional':
      case '-O':
        return '--optional'
      case '--save-exact':
      case '-E':
        return '--exact'
      case '--save':
      case '-S':
      case '--global':
      case '-g':
        return ''
      default:
        return item
    }
  })
}

const npmToYarnTable = {
  install (args: string[]) {
    if (!installsPackages(args)) {
      // only flags (e.g. `npm install --production`): `yarn add` needs packages
      args[0] = 'install'
      return convertInstallArgs(args)
    }
    args[0] = 'add'

    return convertInstallArgs(args)
  },
  i (args: string[]) {
    return npmToYarnTable.install(args)
  },
  uninstall (args: string[]) {
    args[0] = 'remove'

    return convertInstallArgs(args)
  },
  un (args: string[]) {
    return npmToYarnTable.uninstall(args)
  },
  remove (args: string[]) {
    return npmToYarnTable.uninstall(args)
  },
  r (args: string[]) {
    return npmToYarnTable.uninstall(args)
  },
  rm (args: string[]) {
    return npmToYarnTable.uninstall(args)
  },
  version (args: string[]) {
    return args.map(item => {
      switch (item) {
        case 'major':
          return '--major'
        case 'minor':
          return '--minor'
        case 'patch':
          return '--patch'
        default:
          return item
      }
    })
  },
  rb (args: string[]) {
    return npmToYarnTable.rebuild(args)
  },
  rebuild (args: string[]) {
    args[0] = 'add'
    args.push('--force')
    return args
  },
  run (args: string[]) {
    if (args[1] && !unchangedCLICommands.includes(args[1]) && !yarnCLICommands.includes(args[1])) {
      args.splice(0, 1)
    }
    return args
  },
  exec (args: string[]) {
    args[0] = 'run'
    return npmToYarnTable.run(args)
  },
  ls (args: string[]) {
    args[0] = 'list'

    let ended = false
    const packages = args.filter((item, id) => {
      if (id > 0 && !ended) {
        ended = item.startsWith('-')
        return !ended
      }
      return false
    })
    if (packages.length > 0) {
      args.splice(1, packages.length, '--pattern', '"' + packages.join('|') + '"')
    }
    return args
  },
  list (args: string[]) {
    return npmToYarnTable.ls(args)
  },
  init (args: string[]) {
    if (args[1] && !args[1].startsWith('-')) {
      args[0] = 'create'
      const m = args[1].match(/(.+)@latest/)
      if (m) {
        args[1] = m[1]
      }
    }
    return args.filter(item => item !== '--scope')
  },
  create (args: string[]) {
    return npmToYarnTable.init(args)
  },
  ln: 'link',
  t: 'test',
  tst: 'test',
  outdated: 'outdated',
  pack (args: string[]) {
    return args.map(item => {
      if (item.startsWith('--pack-destination')) {
        return item.replace(/^--pack-destination[\s=]/, '--filename ')
      }
      return item
    })
  }
}

export function npmToYarn (_m: string, command: string): string {
  let args = parse((command || '').trim())

  const index = args.findIndex(a => a === '--')
  if (index >= 0) {
    args.splice(index, 1)
  }

  if (unchangedCLICommands.includes(args[0])) {
    return 'yarn ' + args.filter(Boolean).join(' ')
  } else if (args[0] in npmToYarnTable) {
    const converter = npmToYarnTable[args[0] as keyof typeof npmToYarnTable]

    if (typeof converter === 'function') {
      args = converter(args)
    } else {
      args[0] = converter
    }

    return 'yarn ' + args.filter(Boolean).join(' ')
  } else {
    return 'npm ' + command + "\n# couldn't auto-convert command"
  }
}
