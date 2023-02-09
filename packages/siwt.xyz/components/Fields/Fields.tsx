import clsx from 'clsx'
import React, { FC, ReactNode } from 'react'

const formClasses =
  'block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-blue-500 sm:text-sm'

const Label = ({ id, children }: { id: string; children: ReactNode }) => {
  return (
    <label htmlFor={id} className="mb-3 block text-sm font-medium text-gray-700">
      {children}
    </label>
  )
}

interface TextFieldProps {
  id: string
  label: string
  type?: 'text' | 'email' | 'password' | 'number'
  explainer?: string
  className?: string
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const TextField: FC<TextFieldProps> = ({
  id,
  label,
  type = 'text',
  explainer = '',
  className = '',
  value,
  onChange,
  ...props
}) => {
  return (
    <>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {explainer && <span className="text-xs text-gray-500">{explainer}</span>}
      <div className="mt-1">
        <input
          type="text"
          name={id}
          id={id}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-border-black sm:text-sm"
          value={value}
          onChange={onChange}
          {...props}
        />
      </div>
    </>
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

interface RadioButtonSetProps {
  id: string
  label: string
  className?: string
  options: { id: string; label: string }[]
  value: string
  onChange: (id: string) => void
}

export const RadioButtonSet: FC<RadioButtonSetProps> = ({
  id,
  label,
  className = '',
  onChange,
  value,
  options,
  ...props
}) => (
  <fieldset className={`mt-6 ${className}`}>
    <label htmlFor={id} className="block text-2xl font-medium leading-6 text-gray-900">
      {label}
    </label>
    <legend className="sr-only">{label}</legend>
    <div className="grid grid-cols-4 mt-4">
      {options.map(option => (
        <div key={option.id} className="flex items-center p-1">
          <input
            id={option.id}
            name={id}
            type="radio"
            defaultChecked={option.id === value}
            onChange={() => onChange(option.id)}
            className="h-4 w-4 border-gray-300 text-gray-600 focus:ring-gray-500"
            {...props}
          />
          <label htmlFor={option.id} className="ml-3 block text-sm font-medium text-gray-700">
            {option.label}
          </label>
        </div>
      ))}
    </div>
  </fieldset>
)

interface CheckboxSetProps {
  id: string
  label: string
  options: string[]
  checked?: string[]
  className?: string
  onChange: (id: string) => void
}

export const CheckboxSet: FC<CheckboxSetProps> = ({ label, id, options, checked = [], onChange, className = '' }) => (
  <fieldset className={className}>
    <legend className="sr-only">{label}</legend>
    <div className="relative flex flex-col items-start">
      {options.map(option => (
        <div key={option} className="flex flex-row space-y-1 h-5 items-center mb-2">
          <input
            id={option}
            name={id}
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-gray-600 focus:ring-gray-500"
            checked={checked.includes(option)}
            onChange={() => onChange(option)}
          />
          <div className="ml-3 text-sm">
            <label htmlFor="terms-conditions" className="font-medium text-gray-700">
              {option}
            </label>
          </div>
        </div>
      ))}
    </div>
  </fieldset>
)
