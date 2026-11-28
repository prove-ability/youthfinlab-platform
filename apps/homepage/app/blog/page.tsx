"use client";

import { useEffect, useState } from "react";
import Typography from "@/components/ui/Typography";
import Section from "@/components/ui/Section";
import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "./types";
import { Skeleton } from "@/components/ui/skeleton";
import styles from "./blog.module.css";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetch("/api/blog")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <main>
      <Section background="fade-from-brand" className="pt-24">
        <div className="max-w-3xl mx-auto">
          <Typography.H1 className="text-left text-foreground mb-6">
            블로그
          </Typography.H1>
          <Typography.P className="text-muted-foreground">
            유스핀랩의 금융교육 이야기를 만나보세요
          </Typography.P>
        </div>
      </Section>

      <Section background="default">
        <div className="max-w-4xl mx-auto">
          <ul className="divide-y divide-border">
            {isLoading ? (
              <>
                <li className={`py-10 ${styles.card}`}>
                  <div className={styles.layout}>
                    <div className={`space-y-3 ${styles.content}`}>
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-7 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className={`${styles.thumbnail} rounded-lg`} />
                  </div>
                </li>
                <li className={`py-10 ${styles.card}`}>
                  <div className={styles.layout}>
                    <div className={`space-y-3 ${styles.content}`}>
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-7 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className={`${styles.thumbnail} rounded-lg`} />
                  </div>
                </li>
              </>
            ) : (
              posts.map((post: BlogPost, index: number) => (
                <li key={index} className={`py-10 first:pt-0 ${styles.card}`}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className={`group ${styles.layout}`}
                  >
                    <div className={`space-y-2 ${styles.content}`}>
                      <Typography.H3 className="group-hover:text-primary transition-colors">
                        {post.title}
                      </Typography.H3>
                      <Typography.P className="text-muted-foreground line-clamp-2">
                        {post.description}
                      </Typography.P>
                      <Typography.Muted>
                        {new Date(post.pubDate)
                          .toLocaleDateString("ko-KR", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          })
                          .replace(/\.$/, "")}
                      </Typography.Muted>
                    </div>
                    {post.thumbnail && (
                      <div
                        className={`relative overflow-hidden rounded-lg bg-muted ${styles.thumbnail}`}
                      >
                        <Image
                          src={post.thumbnail}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="200px"
                        />
                      </div>
                    )}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      </Section>
    </main>
  );
};

export default Blog;
