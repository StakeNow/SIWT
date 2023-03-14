// @ts-nocheck
import { CloudFrontRequestEvent } from 'aws-lambda'
import { allPass, append, complement, join, lensProp, over, path, pipe, split, test, when } from 'ramda'

const hasExtension = /(.+)\.[a-zA-Z0-9]{2,5}$/
const hasTrailingSlash = /\/$/
const pathComponents = split('/')

const appendString = (string: string) => pipe(append(string), join(''))

const formatUrl = () =>
  pipe(
    when(allPass([complement(test)(hasExtension), complement(test)(hasTrailingSlash)]), appendString('/')),
    when(test(hasTrailingSlash), appendString('index.html')),
  )

export const rewriteRequestUri = pipe(path(['Records', 0, 'cf', 'request']), over(lensProp('uri'), formatUrl()))

export const routeHandler = async (event: CloudFrontRequestEvent) => {
  console.log('REQUEST EVENT: ', event)
  const rewrittenRequest = rewriteRequestUri(event)
  console.log('RETURNED EVENT: ', rewrittenRequest)
  return rewrittenRequest
}
