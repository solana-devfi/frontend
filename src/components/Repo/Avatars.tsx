import { GithubIssue } from '@/hooks/useRepoIssues';
import Image from 'next/image';

interface AvatarsProps {
  assignees?: GithubIssue['assignees'];
}

const Avatars = ({ assignees }: AvatarsProps) => {
  return (
    <div className="flex -space-x-4">
      {assignees?.map((assignee) => (
        <a
          key={assignee.id}
          href={assignee.html_url}
          target="_blank"
          rel="noreferrer"
          className="transition-opacity hover:opacity-80"
        >
          <Image
            className="rounded-full border-2 border-white dark:border-gray-800"
            src={assignee.avatar_url}
            alt={assignee.login}
            width={36}
            height={36}
          />
        </a>
      ))}
    </div>
  );
};

export default Avatars;
