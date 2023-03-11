import { Popover, Transition } from '@headlessui/react';

export default function DepositFundsPopup() {
  return (
    <Popover className="relative">
      <Popover.Button>Solutions</Popover.Button>

      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Popover.Panel className="absolute z-10">
          <div className="grid grid-cols-2">
            <a href="/analytics">Analytics</a>
            <a href="/engagement">Engagement</a>
            <a href="/security">Security</a>
            <a href="/integrations">Integrations</a>
          </div>

          <img src="/solutions.jpg" alt="" />
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
