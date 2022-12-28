import { FC } from 'react'

import { NotificationStatus } from '../../common/types'

interface NotificationProps {
  status: NotificationStatus
}

export const Notification: FC<NotificationProps> = ({ status }) => {
  const notificationIconMap = {
    [NotificationStatus.verified]: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 text-green-400"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    [NotificationStatus.failed]: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 text-red-500"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
        />
      </svg>
    ),
  }

  const notificationMessageMap = {
    [NotificationStatus.verified]: 'Verification complete. You can return to Discord and close this tab.',
    [NotificationStatus.failed]:
      'Verification failed. If you believe this is incorrect please get in touch with an administrator of the Discord server.',
  }

  return (
    <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 mt-3">
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">{notificationIconMap[status]}</div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-300">{notificationMessageMap[status]}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Notification
