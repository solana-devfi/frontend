import Image from 'next/image';

interface AvatarsProps {}

const Avatars = ({}: AvatarsProps) => {
  return (
    <div className="flex -space-x-4">
      <Image
        className="rounded-full border-2 border-white dark:border-gray-800"
        src="/avatars/avatar-1.png"
        width={36}
        height={36}
        alt=""
      />
      <Image
        className="rounded-full border-2 border-white dark:border-gray-800"
        src="/avatars/avatar-2.png"
        width={36}
        height={36}
        alt=""
      />
      <Image
        className="rounded-full border-2 border-white dark:border-gray-800"
        src="/avatars/avatar-3.png"
        width={36}
        height={36}
        alt=""
      />
    </div>
  );
};

export default Avatars;
