import { ReactNode } from 'react';

interface SectionHeadingProps {
  icon: ReactNode;
  title: string;
  description?: string;
}

export const SectionHeading = ({ icon, title, description }: SectionHeadingProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-1">
        <div className="text-emerald-400/60">
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
      </div>
      {description && (
        <p className="text-sm text-white/30 ml-8">{description}</p>
      )}
    </div>
  );
};
