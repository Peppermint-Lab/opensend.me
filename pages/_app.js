import "tailwindcss/tailwind.css";
import "antd/dist/antd.css";
import Script from "next/script";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
      <Script async src="https://cdn.splitbee.io/sb.js" strategy="lazyOnload" />
    </div>
  );
}

export default MyApp;
