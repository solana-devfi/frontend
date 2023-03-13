import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const DEV_FI_INSTALLATION_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://github.com/apps/devfi-git-to-earn/installations/new'
    : 'https://github.com/apps/devfi-git-to-earn-dev/installations/new';

const AddOrganisationLink = () => {
  const [popup, setPopup] = useState<Window>(null);
  const router = useRouter();

  function handleClick() {
    const newPopup = window.open(
      DEV_FI_INSTALLATION_URL,
      '_blank',
      'scrollbars=yes,resizable=yes'
    );
    setPopup(newPopup);
  }

  useEffect(() => {
    if (popup) {
      const timer = setInterval(() => {
        if (popup.closed) {
          clearInterval(timer);
          setPopup(null);
          router.reload();
        }
      }, 1000);
      return () => {};
    }
  }, [popup, router]);

  return (
    <p className="pb-6 dark:text-slate-300">
      Don&apos;t see your organisation here?{' '}
      <span
        className="cursor-pointer underline transition-colors dark:hover:text-slate-400"
        onClick={handleClick}
      >
        Configure the DevFi app on GitHub
      </span>
      .
    </p>
  );
};

export default AddOrganisationLink;
