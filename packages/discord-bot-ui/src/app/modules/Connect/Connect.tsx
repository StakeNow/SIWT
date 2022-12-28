import axios from 'axios'
import { prop } from 'ramda'
import { useEffect, useState } from 'react'

import Logo from '../../../assets/siwt-icon.svg'
import login from '../../common/signIn/signIn'
import { NotificationStatus } from '../../common/types'
import { getRequestId } from '../../common/utils'
import { Notification } from '../Notification'

export const Connect = () => {
  const [user, setUser] = useState('')
  const [notification, setNotification] = useState('' as NotificationStatus)
  const requestId = getRequestId()

  useEffect(() => {
    if (!requestId) return
    console.log(requestId)
    const getUserInformation = async () => {
      try {
        const data = await axios.get(`${process.env.NX_API_URL ||''}/verification/${requestId}/user`)

        setUser(prop('data')(data))
      } catch (error) {
        throw new Error(
          'Verification failed. If you believe this is incorrect please get in touch with an administrator of the Discord server.',
        )
      }
    }

    if (!user) {
      getUserInformation()
    }
  }, [requestId])

  const Avatar = () =>
    user ? (
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center">
          <div>
            <img
              className="inline-block h-12 w-12 rounded-full"
              src={prop('avatar')(user)}
              alt={`${prop('username')(user)} ${prop('guild')(user)}`}
            />
          </div>
          <div className="mt-3 text-center">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-gray-900">
              {prop('username')(user)}
            </p>
          </div>
        </div>
      </div>
    ) : (
      <></>
    )

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto h-12 w-12">
          <Logo />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-200">
          Sign in with Tezos
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-900 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div>
            <Avatar />
            {notification ? <Notification status={notification} /> : null}
            <div className="mt-4">
              { user && <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-orange py-2 px-4 text-sm font-bold tracking-wide text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                onClick={() => login(setNotification)}
              >
                Verify on {prop('guild')(user)}
              </button> }
            </div>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-800" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white dark:bg-gray-900 px-2 text-gray-500">What to expect</span>
              </div>
            </div>

            <div className="mt-6 bg-gray-100 dark:bg-gray-800 p-5 rounded-lg text-black dark:text-gray-300">
              <ul className="text-sm leading-loose">
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  Connect Wallet
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  Sign the verification message in the wallet
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  Return to this page to view verification status
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  Close this page and return to Discord
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
