import { AppProps } from "next/app";
import "../styles/globals.css";
import Header from "../components/Header";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <div className="bg-white max-w-screen-md m-auto py-6 px-2">
        <Component {...pageProps} />
      </div>
    </>
  );
}
