import { yarnToNPM } from './yarnToNpm'
import { npmToYarn } from './npmToYarn'
import { npmToPnpm } from './npmToPnpm'
import { npmToBun } from './npmToBun'
import { npmToDeno } from './npmToDeno'
import { npmToNub } from './npmToNub'

import { executorCommands } from './utils'

/**
 * Converts between npm and yarn command
 */
export default function convert (str: string, to: 'npm' | 'yarn' | 'pnpm' | 'bun' | 'deno' | 'nub'): string {
  // Detect executor commands (npx / yarn dlx / …) only when they lead the
  // command, so package names that merely contain an executor substring
  // (e.g. `npm install npx-prettier`) still go through the normal mapping.
  const trimmed = str.trimStart()
  const executor = ['npx', 'yarn dlx', 'pnpm dlx', 'bun x', 'nubx'].find(
    e => trimmed === e || trimmed.startsWith(e + ' ')
  )
  if (executor) {
    return str.replace(executor, executorCommands[to])
  } else if (to === 'npm') {
    return str.replace(/yarn(?: +([^&\n\r]*))?/gm, yarnToNPM)
  } else if (to === 'pnpm') {
    return str.replace(/npm(?: +([^&\n\r]*))?/gm, npmToPnpm)
  } else if (to === 'bun') {
    return str.replace(/npm(?: +([^&\n\r]*))?/gm, npmToBun)
  } else if (to === 'deno') {
    return str.replace(/npm(?: +([^&\n\r]*))?/gm, npmToDeno)
  } else if (to === 'nub') {
    return str.replace(/npm(?: +([^&\n\r]*))?/gm, npmToNub)
  } else {
    return str.replace(/npm(?: +([^&\n\r]*))?/gm, npmToYarn)
  }
}
