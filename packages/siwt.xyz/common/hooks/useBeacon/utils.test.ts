import { getActiveAccountPKH } from './utils'

const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => {
      return store[key] || null
    },
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
    getStore: () => store,
  }
})()

const mockLocalStorage = () =>
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  })

describe('common/beaconWallet/beaconWallet.utils', () => {
  describe('getActiveAccount', () => {
    it('should get the active account pkh', () => {
      // given ... an active account in localStorage
      mockLocalStorage()
      localStorage.setItem('beacon:active-account', 'ACCOUNT_ID')
      localStorage.setItem('beacon:accounts', JSON.stringify([{ accountIdentifier: 'ACCOUNT_ID', address: 'MYPKH' }]))

      // when ... we want to get this active accounts pkh
      const activeAccount = getActiveAccountPKH()

      // then ... it should get it as expected
      expect(activeAccount).toEqual('MYPKH')
    })

    it('should return null when no active account', () => {
      // given ... no active account in localStorage
      mockLocalStorage()
      localStorage.setItem('beacon:active-account', 'undefined')

      // when ... we want to get this active accounts pkh
      const activeAccount = getActiveAccountPKH()

      // then ... it should result in undefined
      expect(activeAccount).toEqual(null)
    })

    it('should return null when active account not found', () => {
      // given ... an active account in localStorage but no corresponding account data
      mockLocalStorage()
      localStorage.setItem('beacon:active-account', 'ACTIVE_ID')
      localStorage.setItem('beacon:accounts', JSON.stringify([{ accountIdentifier: 'ACCOUNT_ID', address: 'MYPKH' }]))

      // when ... we want to get this active accounts pkh
      const activeAccount = getActiveAccountPKH()

      // then ... it should result in undefined
      expect(activeAccount).toEqual(null)
    })
  })
})
