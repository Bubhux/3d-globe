// app/root.jsx
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import './global.module.css';
import '~/routes/home/home';


export function Layout({ children }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body>
                {children}
                <Scripts />
                <ScrollRestoration />
            </body>
        </html>
    );
}

export default function App() {
    return (
        <Layout>
            <Outlet />
        </Layout>
    )
}
