/** @type {import('next').NextConfig} */
const nextConfig = {
    // Type and lint errors used to be ignored here, which let 20 type errors and
    // a completely broken ESLint setup ship unnoticed. Both gates are on: the
    // build should fail when the code does.
};

export default nextConfig;
