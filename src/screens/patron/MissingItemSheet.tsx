import { useState } from 'react';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { PhotoTile } from '../../components/PhotoTile';
import { Sheet } from '../../components/Sheet';
import { Stepper } from '../../components/Stepper';
import { MISSING_TYPES } from '../../data/catalog';
import { useStore } from '../../store/useStore';

const MISSING_PHOTO = '/mock/room-bathroom.svg';

export const MissingItemSheet = ({ open, onClose, jobId }: { open: boolean; onClose: () => void; jobId: string }) => {
  const report = useStore((s) => s.reportMissing);
  const toast = useStore((s) => s.toast);
  const [type, setType] = useState('Towel');
  const [qty, setQty] = useState(1);
  const [photo, setPhoto] = useState<string | undefined>();

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Report missing item"
      description="The manager sees it on the job, and it's added to the next delivery."
      footer={
        <Button
          block
          onClick={() => {
            report(jobId, { type, quantity: qty, photo });
            toast('Missing item reported');
            setPhoto(undefined);
            setQty(1);
            onClose();
          }}
        >
          Report missing item
        </Button>
      }
    >
      <fieldset>
        <legend className="mb-2 text-caption font-bold text-ink">What's missing</legend>
        <div className="flex flex-wrap gap-2">
          {MISSING_TYPES.map((t) => (
            <Chip key={t} label={t} selected={type === t} onClick={() => setType(t)} />
          ))}
        </div>
      </fieldset>
      <div className="mt-4 border-y border-line">
        <Stepper label="Quantity" value={qty} min={1} onChange={setQty} />
      </div>
      <div className="mt-4">
        <p className="mb-2 text-caption font-bold text-ink">Photo (optional)</p>
        <PhotoTile src={photo} alt={photo ? 'Photo of where the item should be' : 'Add photo'} onAdd={() => setPhoto(MISSING_PHOTO)} size={photo ? 'wide' : 'md'} />
      </div>
    </Sheet>
  );
};
