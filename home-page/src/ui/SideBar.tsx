'use client';

import { widgets, type Item } from '@/lib/widgets';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { useState } from 'react';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useRef, useEffect } from 'react';
import { GlobalNavItem } from '@/components/GlobalNavItem';

export function SideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);
  const ref = useRef(null)

  const [selectedWidget, setSelectedWidget] = useState<Item | null>(null);


  return (
    <DndProvider backend={HTML5Backend}>
    <div ref={ref} className="fixed top-0 z-10 flex w-full flex-col border-b border-gray-800 bg-black lg:bottom-0 lg:z-auto lg:w-72 lg:border-b-0 lg:border-r lg:border-gray-800">
      <div className="flex h-14 items-center px-4 py-4 lg:h-auto">
        <Link
          href="/"
          className="group flex w-full items-center gap-x-2.5"
          onClick={close}
        >

          <h3 className="font-semibold tracking-wide text-gray-400 group-hover:text-gray-50">
            App Router
          </h3>
        </Link>
      </div>

      <button
        type="button"
        className="group absolute right-0 top-0 flex h-14 items-center gap-x-2 px-4 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="font-medium text-gray-100 group-hover:text-gray-400">
          Menu
        </div>
        {isOpen ? (
          <XMarkIcon className="block w-6 text-gray-400" />
        ) : (
          <Bars3Icon className="block w-6 text-gray-400" />
        )}
      </button>
      {isOpen || (
        <div className="hidden lg:block">
          <nav className="space-y-6 px-2 pb-24 pt-5">
        {widgets.map((section) => {
          return (
            <div key={section.name}>
          <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400/80">
            <div>{section.name}</div>
          </div>

          <div className="space-y-1">
            {section.items.map((item) => (
              <GlobalNavItem key={item.id} item={item} />
            ))}
          </div>
            </div>
          );
        })}
          </nav>
          {selectedWidget && (
        <div>
          {selectedWidget.component && (
            <selectedWidget.component item={selectedWidget} />
          )}
        </div>
          )}
        </div>
      )}



      
      </div>

    </DndProvider>
  );
}

export default SideBar;