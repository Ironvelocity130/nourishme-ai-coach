const PageHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="px-5 pt-12 pb-2">
    <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
    {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
  </div>
);

export default PageHeader;
