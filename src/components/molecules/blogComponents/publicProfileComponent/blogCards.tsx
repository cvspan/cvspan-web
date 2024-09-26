import React from 'react';
import { articles } from '../reuseables/blogData';
import BlogCard from '../reuseables/blogCard';

type Props = {};

const BlogCards = (props: Props) => {
    return (
        <div className="grid grid-cols-1 gap-[40px] md:grid-cols-2">
            {articles.map((article, index) => (
                <div className="">
                    <BlogCard article={article} key={index} />
                </div>
            ))}
        </div>
    );
};

export default BlogCards;
