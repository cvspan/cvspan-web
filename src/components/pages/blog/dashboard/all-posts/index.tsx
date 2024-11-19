'use client';

import React from 'react';

import BlogDashboardWrapper from '@/components/molecules/blogComponents/BlogDashboardWrapper';
import BlogTabs from '@/components/molecules/blogComponents/BlogTabs';
const BlogDashboardMyPosts = () => {
    const [selected, setselected] = React.useState('1');

    const onPressTab = ({ tabId = '' }: { tabId?: string }) => {
        setselected(tabId);
    };
    return (
        <>
            <BlogDashboardWrapper title="My Posts">
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

export default BlogDashboardMyPosts;
