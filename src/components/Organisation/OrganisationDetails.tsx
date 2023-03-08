import organisations from '@/data/organisations';
import RepoCard from './RepoCard';

interface OrganisationDetailsProps {
  organisationName: string;
}

const OrganisationDetails = ({
  organisationName,
}: OrganisationDetailsProps) => {
  const organisation = organisations.find(
    (organisation) => organisation.name === organisationName
  );

  if (organisation === undefined) {
    return <div className="dark:text-slate-200">No details found!</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="mb-2 text-5xl font-extrabold dark:text-slate-200">
          {organisation.displayName}
        </h1>
        <h2 className="text-xl font-semibold dark:text-slate-400">
          {organisation.name}
        </h2>
        <p className="mb-3 font-mono dark:text-slate-400">
          {organisation.address}
        </p>
        <span className="text-3xl font-bold dark:text-slate-200">
          {organisation.totalAmount} SOL
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {organisation.repos.map((repo) => (
          <RepoCard
            key={repo.name}
            {...repo}
            organisationName={organisationName}
          />
        ))}
      </div>
    </div>
  );
};

export default OrganisationDetails;
