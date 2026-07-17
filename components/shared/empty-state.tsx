import "./empty-state.scss";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionHref: string;
  actionLabel: string;
}

export function EmptyState({ icon: Icon, title, description, actionHref, actionLabel }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <span className="empty-state__icon">
        <Icon />
      </span>
      <div>
        <p className="empty-state__title">{title}</p>
        <p className="empty-state__description">{description}</p>
      </div>
      <Button asChild className="empty-state__action">
        <Link href={actionHref}>{actionLabel}</Link>
      </Button>
    </div>
  );
}
