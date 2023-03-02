import { always, equals, find, ifElse, isNil, pipe, propEq, propOr, unless } from 'ramda'

export const getActiveAccountPKH = (): unknown =>
  ifElse(
    (x: string | null) => !isNil(x) && !equals('undefined')(x),
    pipe((activeAccountIdentifier: string) =>
      unless(
        (x: string | null) => isNil(x) || equals('undefined')(x),
        pipe(JSON.parse, find(propEq('accountIdentifier', activeAccountIdentifier)), propOr(null, 'address')),
      )(localStorage.getItem('beacon:accounts') as any),
    ),
    always(null),
  )(localStorage.getItem('beacon:active-account') as any)
