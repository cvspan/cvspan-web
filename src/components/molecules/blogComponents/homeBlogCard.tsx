import React from 'react';
import { articles } from './reuseables/blogData';
import BlogCard from './reuseables/blogCard';

type Props = {};

const HomeBlogCard = (props: Props) => {
    return (
        <div className="relative mx-auto w-full max-w-[1200px] py-[30px]">
            <div className="grid grid-cols-3 gap-[40px] md:grid-cols-3">
                {articles.map((article, index) => (
                    <div className="">
                        <BlogCard article={article} key={index} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomeBlogCard;
