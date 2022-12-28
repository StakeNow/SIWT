import { pipe, prop, replace } from 'ramda'

export const getRequestId = () => pipe(prop('pathname'), replace('/', ''))(new URL(window.location.href))
