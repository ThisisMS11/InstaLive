import AvatarCircles from '@/components/ui/avatar-circles';

const avatars = [
  {
    imageUrl: 'https://github.com/shadcn.png',
    profileUrl: 'https://github.com/dillionverma',
  },
  {
    imageUrl: 'https://github.com/shadcn.png',
    profileUrl: 'https://github.com/tomonarifeehan',
  },
  {
    imageUrl: 'https://avatars.githubusercontent.com/u/106103625',
    profileUrl: 'https://github.com/BankkRoll',
  },
];

export function AvatarCirclesDemo() {
  return <AvatarCircles numPeople={100} avatarUrls={avatars} />;
}
