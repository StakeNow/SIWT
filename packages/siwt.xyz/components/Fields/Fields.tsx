import React, { FC, ReactNode } from 'react'
import clsx from 'clsx'

const formClasses =
  'block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-blue-500 sm:text-sm'

const Label = ({ id, children }: { id: string, children: ReactNode }) => {
  return (
    <label
      htmlFor={id}
      className="mb-3 block text-sm font-medium text-gray-700"
    >
      {children}
    </label>
  )
}

interface TextFieldProps {
  id: string
  label: string
  type: 'text' | 'email' | 'password'
  className: string
}

export const TextField: FC<TextFieldProps> = ({
  id,
  label,
  type = 'text',
  className = '',
  ...props
}) => {
  return (
    <div className={className}>
      {label && <Label id={id}>{label}</Label>}
      <input id={id} type={type} {...props} className={formClasses} />
    </div>
  )
}

interface SelectFieldProps {
  id: string
  label: string
  className: string
}

export const SelectField: FC<SelectFieldProps> = ({ id, label, className = '', ...props }) => {
  return (
    <div className={className}>
      {label && <Label id={id}>{label}</Label>}
      <select id={id} {...props} className={clsx(formClasses, 'pr-8')} />
    </div>
  )
}
