'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { TrashIcon, ArchiveBoxIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (permanent: boolean) => void | Promise<void>
  itemName: string
  itemType?: string
  isDeleting?: boolean
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType = 'item',
  isDeleting = false
}: DeleteConfirmationModalProps) {
  
  const handleSoftDelete = async () => {
    await onConfirm(false)
    onClose()
  }

  const handlePermanentDelete = async () => {
    await onConfirm(true)
    onClose()
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center mb-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <TrashIcon className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <Dialog.Title
                      as="h3"
                      className="text-2xl font-semibold leading-6 text-gray-900"
                    >
                      Delete {itemType}
                    </Dialog.Title>
                    <p className="text-sm text-gray-500 mt-1">
                      Choose how you want to delete this {itemType}
                    </p>
                  </div>
                </div>

                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Item: </span>
                    <span className="text-gray-900">{itemName}</span>
                  </p>
                </div>

                {/* Soft Delete Option */}
                <div className="mb-4 border-2 border-green-200 rounded-xl p-5 hover:border-green-400 transition-colors bg-green-50/50">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4 mt-1">
                      <ArchiveBoxIcon className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        Move to Recycle Bin
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        The {itemType} will be moved to the Recycle Bin where you can restore it later if needed. This is the recommended option.
                      </p>
                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={handleSoftDelete}
                        className="inline-flex items-center px-5 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ArchiveBoxIcon className="w-5 h-5 mr-2" />
                        {isDeleting ? 'Moving...' : 'Move to Recycle Bin'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Permanent Delete Option */}
                <div className="mb-6 border-2 border-red-200 rounded-xl p-5 hover:border-red-400 transition-colors bg-red-50/50">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4 mt-1">
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        Delete Permanently
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        ⚠️ <strong>Warning:</strong> This action cannot be undone! The {itemType} will be permanently removed from the database immediately.
                      </p>
                      <p className="text-sm text-gray-600 mb-4">
                        Use this option only if you're absolutely sure you don't need this {itemType} anymore.
                      </p>
                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={handlePermanentDelete}
                        className="inline-flex items-center px-5 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <TrashIcon className="w-5 h-5 mr-2" />
                        {isDeleting ? 'Deleting...' : 'Delete Permanently'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Cancel Button */}
                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                    onClick={onClose}
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

