import { AppProps } from "next/app";
import "../styles/globals.css";
import Header from "../components/Header";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <div className="max-w-prose m-auto my-6 px-2">
        <Component {...pageProps} />
      </div>
    </>
  );
}
