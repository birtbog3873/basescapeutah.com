// Shim for undici in Cloudflare Workers environment.
// Workers has native fetch/Request/Response/Headers.
// Payload CMS uses undici.Agent for SSRF protection in safeFetch —
// Workers runtime provides its own network security layer.

export class Agent {
  constructor(_opts?: any) {}
}

export const fetch = globalThis.fetch.bind(globalThis)
export const Request = globalThis.Request
export const Response = globalThis.Response
export const Headers = globalThis.Headers
export const FormData = globalThis.FormData

export class MessagePort {}
export class MessageChannel {
  port1 = new MessagePort()
  port2 = new MessagePort()
}

export default { fetch, Request, Response, Headers, FormData, Agent }
