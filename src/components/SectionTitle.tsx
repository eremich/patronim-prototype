import type { ReactNode } from 'react';

export interface SectionTitleProps {
  children: ReactNode;
  trailing?: ReactNode;
  id?: string;
}

/** Sentence-case section heading. No all-caps eyebrows. */
export const SectionTitle = ({ children, trailing, id }: SectionTitleProps) => (
  <div className="mb-3 flex items-baseline justify-between gap-3">
    <h2 id={id} className="text-headline font-bold text-ink">
      {children}
    </h2>
    {trailing}
  </div>
);
