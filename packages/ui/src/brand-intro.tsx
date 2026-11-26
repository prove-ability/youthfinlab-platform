interface BrandIntroProps {
  title: string;
  description: string;
}

export function BrandIntro({ title, description }: BrandIntroProps) {
  return (
    <div className="yfl-intro">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <span className="yfl-sprout" aria-hidden="true" />
    </div>
  );
}
