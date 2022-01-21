// because no type defs exist, i just override the module with `any`
// someday hopefully we will add these to js-sdk
declare module '@toznysecure/sdk/node' {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore we can use any as a value below because we are just replacing the real thing with
  // a fake type.
  export default any
}
