import "tailwindcss/tailwind.css";
import "antd/dist/antd.css";
import Script from "next/script";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>opensend.me</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
      <Script async src="https://cdn.splitbee.io/sb.js" strategy="lazyOnload" />
    </div>
  );
}

export default MyApp;
