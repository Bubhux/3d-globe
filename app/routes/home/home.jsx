// app/routes/home/home.jsx
import * as RemixNode from '@remix-run/node';
import React, { Suspense, lazy } from 'react';


const Main = lazy(() => import('~/components/globe/main'));
const { meta: remixMeta } = RemixNode;

export const meta = () => {
    return [
        { title: "New Remix App" },
        { name: "description", content: "Welcome to Remix!" },
    ];
};

export default function Home() {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="flex flex-col items-center gap-16">
                <header className="flex flex-col items-center gap-9">
                    <h1 className="leading text-2xl font-bold text-gray-800 dark:text-gray-100">
                        Welcome
                    </h1>
                </header>
                <Suspense fallback={<div>Loading Globe...</div>}>
                    <Main />
                </Suspense>
            </div>
        </div>
    );
}
