import type { Soldier } from '@/lib/types';

interface SoldierAvatarProps {
  soldier: Pick<Soldier, 'name_en' | 'photo_url' | 'gender'>;
  size?: 'sm' | 'lg';
}

export default function SoldierAvatar({ soldier, size = 'sm' }: SoldierAvatarProps) {
  const dim = size === 'lg' ? 'w-16 h-16' : 'w-10 h-10';
  const iconSize = size === 'lg' ? 'text-3xl' : 'text-lg';

  return (
    <div className={`${dim} rounded-full border border-cyan-400/30 bg-gray-800 flex items-center justify-center flex-shrink-0 overflow-hidden`}>
      {soldier.photo_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={soldier.photo_url} alt={soldier.name_en} className="w-full h-full object-cover" />
      ) : (
        <span className={`${iconSize} text-gray-600`}>{soldier.gender === 'female' ? '🕎' : '✡'}</span>
      )}
    </div>
  );
}
