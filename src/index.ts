import { yarnToNPM } from './yarnToNpm'
import { npmToYarn } from './npmToYarn'
import { npmToPnpm } from './npmToPnpm'
import { npmToBun } from './npmToBun'
import { npmToDeno } from './npmToDeno'

import { executorCommands } from './utils'

/**
 * Converts between npm and yarn command
 */
export default function convert (str: string, to: 'npm' | 'yarn' | 'pnpm' | 'bun' | 'deno'): string {
  if (
    str.includes('npx') ||
    str.includes('yarn dlx') ||
    str.includes('pnpm dlx') ||
    str.includes('bun x')
  ) {
    const executor = str.includes('npx')
      ? 'npx'
      : str.includes('yarn dlx')
      ? 'yarn dlx'
      : str.includes('pnpm dlx')
      ? 'pnpm dlx'
      : 'bun x'
    return str.replace(executor, executorCommands[to])
  } else if (to === 'npm') {
    return str.replace(/yarn(?: +([^&\n\r]*))?/gm, yarnToNPM)
  } else if (to === 'pnpm') {
    return str.replace(/npm(?: +([^&\n\r]*))?/gm, npmToPnpm)
  } else if (to === 'bun') {
    return str.replace(/npm(?: +([^&\n\r]*))?/gm, npmToBun)
  } else if (to === 'deno') {
    return str.replace(/npm(?: +([^&\n\r]*))?/gm, npmToDeno)
  } else {
    return str.replace(/npm(?: +([^&\n\r]*))?/gm, npmToYarn)
  }
}
