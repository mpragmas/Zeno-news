'use client';

import { useEffect, useState, type AnchorHTMLAttributes, type ReactNode } from 'react';
import { outboundHref } from '@/lib/analytics/tracker';

interface OutboundLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  articleId: string;
  children: ReactNode;
}

/** Outbound tracker link — href is resolved client-side to avoid SSR hydration mismatches. */
export function OutboundLink({ articleId, children, ...props }: OutboundLinkProps) {
  const [href, setHref] = useState<string | undefined>();

  useEffect(() => {
    setHref(outboundHref(articleId));
  }, [articleId]);

  if (!href) {
    return <span {...props}>{children}</span>;
  }

  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}
