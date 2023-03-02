import clsx from 'clsx'
import React, { FC } from 'react'

interface ContainerProps {
  className?: string
  children: React.ReactNode
}

export const Container: FC<ContainerProps> = ({ className, ...props }) => {
  return <div className={clsx('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', className)} {...props} />
}
