import { useQuery } from 'react-query';

const createWebHook = ({
  organisationName,
  repoName,
}: {
  organisationName: string;
  repoName: string;
}) => {
  return fetch('/api/github-web-hook', {
    method: 'POST',
    body: JSON.stringify({
      organisationName,
      repoName,
    }),
  }).then((res) => res.json());
};

const useCreateWebhook = ({
  organisationName,
  repoName,
}: {
  organisationName: string;
  repoName: string;
}) => {
  const { data } = useQuery(
    ['webhook'],
    () => createWebHook({ repoName, organisationName }),
    { enabled: Boolean(repoName && organisationName) }
  );
};
export default useCreateWebhook;
