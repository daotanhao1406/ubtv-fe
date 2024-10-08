'use client';

import Head from 'next/head';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Head>
        <script
          // If no token is found, redirect inmediately
          dangerouslySetInnerHTML={{
            __html: `if(!document.cookie || document.cookie.indexOf('token') === -1)
    {location.replace(
      "/login?next=" +
        encodeURIComponent(location.pathname + location.search)
    )}
    else {document.documentElement.classList.add("render")}`,
          }}
        />
      </Head>
      <section>{children}</section>
    </>
  );
};
export default AuthLayout;
