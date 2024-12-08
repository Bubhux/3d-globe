// app/routes/home/home.jsx
import React, { Suspense, lazy, useEffect, useState } from 'react';
//import styles from '~/components/globe/main.module.css';


const Main = lazy(() => import('~/components/globe/main'));

const Home = () => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <div>
            {/* <h1>Welcome to the Globe Application</h1> */}
            {/* {isClient && (
                <Suspense fallback={<div>Loading Globe...</div>}>
                    <Main />
                </Suspense>
            )} */}

            {isClient && (
                <Suspense fallback={null}>
                    <Main />
                </Suspense>
            )}
        </div>
    );
};

export default Home;
