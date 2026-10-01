import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogPostLanding from '@/components/molecules/blogComponents/BlogPostLanding';
import BlogPostSummary from '@/components/molecules/blogComponents/BlogPostSummary';
import CTA_MissAnything from '@/components/molecules/CTA_MissAnything';
import Footer from '@/components/molecules/layout/footer';
import Navbar from '@/components/molecules/layout/navbar';
import JsonLd from '@/components/seo/JsonLd';
import { SITE_NAME, absoluteUrl } from '@/lib/seo/config';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, buildGraph } from '@/lib/seo/structured-data';
import { fetchPost } from '@/lib/portal';

/** Posts are written and published in the CVSpan Portal; each page refreshes at most once a minute. */
export const revalidate = 60;

type Params = { params: { slug: string } };

async function loadPost(slug: string) {
    try {
        return await fetchPost(slug);
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const post = await loadPost(params.slug);
    if (!post) {
        return buildMetadata({
            title: 'Article not found',
            description: 'This article is no longer available.',
            path: `/blog/${params.slug}`,
            noIndex: true,
        });
    }
    return buildMetadata({
        title: post.title,
        description: post.excerpt ?? `${post.title} — from the ${SITE_NAME} blog.`,
        path: `/blog/${post.slug}`,
        image: post.coverImageUrl ?? undefined,
        type: 'article',
        publishedTime: post.publishedAt,
    });
}

export default async function BlogPostPage({ params }: Params) {
    const post = await loadPost(params.slug);
    if (!post) notFound();

    const path = `/blog/${post.slug}`;
    const graph = buildGraph([
        breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: post.title, path },
        ]),
        {
            '@type': 'BlogPosting',
            '@id': `${absoluteUrl(path)}#post`,
            headline: post.title,
            description: post.excerpt ?? undefined,
            image: post.coverImageUrl ?? undefined,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
            author: post.author ? { '@type': 'Person', name: post.author } : undefined,
            mainEntityOfPage: absoluteUrl(path),
        },
    ]);

    return (
        <>
            <JsonLd data={graph} />
            <Navbar light />
            <BlogPostLanding post={post} />
            <BlogPostSummary post={post} shareUrl={absoluteUrl(path)} />
            <CTA_MissAnything />
            <Footer />
        </>
    );
}
