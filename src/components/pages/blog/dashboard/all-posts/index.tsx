'use client';

import React from 'react';

import BlogDashboardWrapper from '@/components/molecules/blogComponents/BlogDashboardWrapper';
import BlogTabs from '@/components/molecules/blogComponents/BlogTabs';
const BlogDashboardAllPosts = () => {
    const [selected, setselected] = React.useState('1');

    const onPressTab = ({ tabId = '' }: { tabId?: string }) => {
        setselected(tabId);
    };
    return (
        <>
            <BlogDashboardWrapper title="All Posts">
                <BlogTabs
                    selectedTabId={selected}
                    onPressTab={onPressTab}
                    items={[
                        { count: 2, id: '1', title: 'Published Posts' },

                        { count: 5, id: '2', title: 'Pending Posts' },
                    ]}
                />
            </BlogDashboardWrapper>
        </>
    );
};

export default BlogDashboardAllPosts;
