/* eslint-disable react/no-unescaped-entities */

import { AppProps } from "next/app";
import "../styles/globals.css";
import Header from "../components/Header";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Leo Alho's homepage</title>
        <script defer data-domain="alho.dev" src="https://analytics.octofy.ai/js/script.js"></script>
        <script defer src="http://85.9.200.85:3113/script.js" data-website-id="cb242041-80b9-44a2-8974-5ff8f067f7f6"></script>
      </Head>
      <Header />
      <div className="bg-white max-w-screen-md m-auto py-6 px-2">
        <Component {...pageProps} />
      </div>
    </>
  );
}
