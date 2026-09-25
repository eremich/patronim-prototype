import { Camera, CheckCircle2 } from 'lucide-react';
import { cx } from '../lib/cx';

export interface PhotoTileProps {
  /** Image URL; when empty the tile is an "add photo" button */
  src?: string;
  alt: string;
  caption?: string;
  onAdd?: () => void;
  required?: boolean;
  size?: 'sm' | 'md' | 'wide';
}

const SIZES = { sm: 'size-18', md: 'h-28 w-full', wide: 'aspect-[4/3] w-full' };

export const PhotoTile = ({ src, alt, caption, onAdd, required, size = 'md' }: PhotoTileProps) =>
  src ? (
    <figure className={cx('relative m-0 overflow-hidden rounded-card border border-line bg-canvas', SIZES[size])}>
      <img src={src} alt={alt} className="size-full object-cover" />
      {caption && (
        <figcaption className="absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded-chip bg-surface px-2 py-0.5 text-caption font-bold text-ok-ink">
          <CheckCircle2 aria-hidden className="size-3.5" strokeWidth={2.5} />
          {caption}
        </figcaption>
      )}
    </figure>
  ) : (
    <button
      type="button"
      onClick={onAdd}
      className={cx(
        'press flex flex-col items-center justify-center gap-1 rounded-card border-2 border-dashed border-navy/35 bg-navy-soft/60 text-navy transition-colors duration-150 hover:bg-navy-soft',
        SIZES[size],
      )}
    >
      <Camera aria-hidden className="size-6" />
      <span className="text-body font-bold">{alt}</span>
      {required && <span className="text-caption text-muted">Required to finish the room</span>}
    </button>
  );
