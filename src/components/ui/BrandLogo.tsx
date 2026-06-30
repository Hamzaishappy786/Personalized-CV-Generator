interface Props {
  className?: string;
  alt?: string;
}

export function BrandLogo({ className = 'h-8', alt = 'Cheentapakdumdum Resume' }: Props) {
  return (
    <span className="brand-logo-wrap relative inline-flex shrink-0">
      <img src="/brand-logo.png" alt={alt} className={`brand-logo-light ${className}`} />
      <img src="/brand-logo-dark.png" alt={alt} className={`brand-logo-dark ${className} hidden`} />
    </span>
  );
}
