// app/root.jsx
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import '~/routes/home/home';
//import './global.module.css';


export default function App({ children }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Meta />
                <Links />
            </head>
            <body>
                {children}
                <Outlet />
                <Scripts />
                <ScrollRestoration />
            </body>
        </html>
    );
}
