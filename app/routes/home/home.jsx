// app/routes/home/home.jsx
import React, { Suspense, lazy } from 'react';


const Main = lazy(() => import('~/components/globe/main'));

const Home = () => {
    return (
        <div>
            <h1>Welcome to the Globe Application</h1>
            <Suspense fallback={<div>Loading Globe...</div>}>
                <Main />
            </Suspense>
        </div>
    );
};

export default Home;
