'use client';

import React, { useEffect } from 'react';
import './style.css';

function FullScreenAnimatedLoader() {
    const [cs, set_cs] = React.useState('');

    useEffect(() => {
        setTimeout(() => {
            set_cs('fs_container_hide');
        }, 500);
    }, []);
    return null;
    return <div className={`fs_container ${cs}`}></div>;
}

export default FullScreenAnimatedLoader;
