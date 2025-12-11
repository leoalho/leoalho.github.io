/* eslint-disable react/no-unescaped-entities */

import { AppProps } from "next/app";
import "../styles/globals.css";
import Header from "../components/Header";
import Head from "next/head";
import Script from "next/script";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Leo Alho's homepage</title>
      </Head>
      <Script defer data-domain="alho.dev" src="https://analytics.octofy.ai/js/script.js"/>
      <Header />
      <div className="bg-white max-w-screen-md m-auto py-6 px-2">
        <Component {...pageProps} />
      </div>
    </>
  );
}
