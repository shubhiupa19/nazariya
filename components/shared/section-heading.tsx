type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description
}: SectionHeadingProps) {
  return (
    <div className="max-w-3xl space-y-4">
      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
        {eyebrow}
      </p>
      <h1 className="font-serif text-4xl leading-tight tracking-[-0.03em] text-balance sm:text-5xl">
        {title}
      </h1>
      <p className="text-base leading-7 text-muted-foreground sm:text-lg">
        {description}
      </p>
    </div>
  );
}
