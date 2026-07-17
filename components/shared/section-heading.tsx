import "./section-heading.scss";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("section-heading", className)}>
      <div className="section-heading__text">
        {eyebrow && <p className="section-heading__eyebrow">{eyebrow}</p>}
        <h2 className="section-heading__title">{title}</h2>
        {description && <p className="section-heading__description">{description}</p>}
      </div>
      {action && <div className="section-heading__action">{action}</div>}
    </div>
  );
}
