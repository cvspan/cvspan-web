import { cn } from '@/lib/utils';
import React from 'react';

export type TBlogTab = { title?: string; id?: string; count?: number };

function BlogTabs({
    selectedTabId,
    onPressTab,
    items = [],
}: {
    selectedTabId?: string;
    onPressTab?: (props: { tabId?: string }) => void;
    items: TBlogTab[];
}) {
    return (
        <div className="flex gap-[8px] border-b-[1px] border-b-[#D1D1D1]">
            {items.map((item) => {
                const active = selectedTabId === item?.id;
                return (
                    <button
                        onClick={() => {
                            onPressTab?.({ tabId: item?.id });
                        }}
                        className={cn(
                            'flex items-center justify-center gap-[10px] rounded-tl-[8px] rounded-tr-[8px] border-[0.5px] border-b-0 border-[#D1D1D1] px-[12px] py-[6px]',
                            active ? 'bg-[#F4F4F4]' : '',
                        )}
                        key={item?.id}
                    >
                        <span className="text-[14px] font-medium">{item?.title}</span>
                        <div className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#B40000]">
                            <span className="text-[11px] text-white">
                                {(item?.count || 0) > 99 ? '99+' : item?.count}
                            </span>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}

export default BlogTabs;
