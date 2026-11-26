interface BrandIntroProps {
  title: string;
  description: string;
}

export function BrandIntro({ title, description }: BrandIntroProps) {
  return (
    <div className="yfl-intro">
      <div>
        <p className="yfl-brand-label">유스핀랩 · 금융교육</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <span className="yfl-sprout" aria-hidden="true" />
    </div>
  );
}
