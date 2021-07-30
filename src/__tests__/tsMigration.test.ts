/**
 * this test is a trivial case testing typescript integration.
 * it can be safely removed once real-world ts code exists.
 */
import API from '../api'

it('should handle code from typescript', () => {
  const api = new API()
  expect(api._typescriptIntegrationTest()).toEqual(-1)
  expect(api._typescriptIntegrationTest(3)).toEqual(5)
  expect(api._typescriptIntegrationTest('asd')).toMatchInlineSnapshot(`"asd2"`)
})
