/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */

import clsx from 'clsx'
import React, { FC } from 'react'

import { Network } from '../../types'

interface TabBarProps {
  tabs: { name: string; label: string; current: boolean }[]
  onChange: (tab: string) => void
  type: 'bar' | 'underline'
}

export const TabBar: FC<TabBarProps> = ({ tabs, onChange, type }) => {
  const renderTabs = () => {
    if (type === 'bar') {
      return (
        <div className="hidden sm:block">
          <nav className="isolate flex divide-x divide-gray-200 rounded-lg shadow" aria-label="Tabs">
            {tabs.map((tab, tabIdx) => (
              <button
                key={tab.name}
                className={clsx(
                  tab.current ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700',
                  tabIdx === 0 ? 'rounded-l-lg' : '',
                  tabIdx === tabs.length - 1 ? 'rounded-r-lg' : '',
                  'group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-sm font-medium text-center hover:bg-gray-50 focus:z-10',
                )}
                aria-current={tab.current ? 'page' : undefined}
                onClick={() => onChange(tab.name)}
              >
                <span>{tab.label}</span>
                <span
                  aria-hidden="true"
                  className={clsx(tab.current ? 'bg-gray-500' : 'bg-transparent', 'absolute inset-x-0 bottom-0 h-0.5')}
                />
              </button>
            ))}
          </nav>
        </div>
      )
    } else if (type === 'underline') {
      return (
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex" aria-label="Tabs">
              {tabs.map(tab => (
                <button
                  key={tab.name}
                  className={clsx(
                    tab.current
                      ? 'border-black-500 text-black-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    'w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm',
                  )}
                  aria-current={tab.current ? 'page' : undefined}
                  onClick={() => onChange(tab.name)}
                >
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )
    }
  }

  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 focus:border-gray-500 focus:ring-gray-500"
          defaultValue={tabs.find(tab => tab.current)?.name}
          onChange={event => onChange(event.currentTarget.value as Network)}
        >
          {tabs.map(tab => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      {renderTabs()}
    </div>
  )
}
