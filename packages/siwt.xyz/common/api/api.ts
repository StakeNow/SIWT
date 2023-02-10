export const fetcher = (...args: any[]) => fetch.apply(null, ...args).then(res => res.json())
