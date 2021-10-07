import "tailwindcss/tailwind.css";
import "antd/dist/antd.css";
import Script from "next/script";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Script async src="https://cdn.splitbee.io/sb.js" strategy="lazyOnload" />
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
