import { notFound } from "next/navigation";
import { getBlogPost } from "@/lib/blog-posts";
import Section from "@/components/ui/Section";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";

import { Metadata } from "next";
import { Description } from "./Description";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: Props) {
  const slug = (await params).slug;
  const decodedSlug = slug;
  const post = getBlogPost(decodedSlug);

  if (!post) {
    notFound();
  }

  return (
    <Section background="fade-from-brand" className="pt-24">
      <div className="max-w-3xl mx-auto">
        <Typography.H1 className="mb-6">{post.title}</Typography.H1>
        <Typography.P className="text-muted-foreground mb-8">
          {new Date(post.pubDate).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Typography.P>
        <Description description={post.description} />
        <Link href={post.link} target="_blank" rel="noopener noreferrer">
          <Button className="bg-[#03C75A] hover:bg-[#03C75A]/90 shadow-lg hover:shadow-xl transition-all">
            네이버 블로그에서 전체 글 보기
          </Button>
        </Link>
      </div>
    </Section>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const decodedSlug = slug;
  const post = getBlogPost(decodedSlug);

  if (!post) notFound();

  const keywords = [
    "금융교육",
    "경제교육",
    "금융교육강사",
    "청소년금융교육",
    "금융캠프",
    "경제교육강사",
    "금융연수",
    "금융특강",
    "취약계층금융교육",
    "자립지원청년금융교육",
    "고립은둔금융교육",
  ].join(", ");

  return {
    title: `${post.title} - 유스핀랩`,
    description: `${post.description} | 금융교육 전문기업 유스핀랩의 금융교육 이야기입니다. 청소년금융교육, 금융캠프, 금융특강 등 다양한 금융교육 프로그램을 제공합니다.`,
    keywords,
    alternates: {
      canonical: `https://www.youthfinlab.com/blog/${encodeURIComponent(post.slug)}`,
    },
    openGraph: {
      title: `${post.title} - 유스핀랩`,
      description: `${post.description} | 금융교육 전문기업 유스핀랩의 금융교육 이야기입니다. 청소년금융교육, 금융캠프, 금융특강 등 다양한 금융교육 프로그램을 제공합니다.`,
      url: `https://www.youthfinlab.com/blog/${post.slug}`,
      siteName: "유스핀랩",
      locale: "ko_KR",
      type: "article",
      images: ["/brand/social-card.png"],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/brand/social-card.png"],
      title: post.title,
      description: post.description,
    },
  };
}
