/**
 * You may safely remove this file once other typescript exists.
 * This is simply a test for how to integrate new ts functionality into existing code.
 */
export function thisIsATest(input: number | undefined): number {
  if (input === undefined) {
    return -1
  }
  return input + 2
}
