import Head from "next/head";
import React from "react";
import Layout from "../components/Layout";

interface IndexProps {}

const Index: React.FC<IndexProps> = () => {
  return (
    <Layout>
      <Head>
        <title>Jelly Bracelets - Home</title>
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <meta
          name="google-site-verification"
          content="UoBz1AN7z57lRr52gg3sONcJ8aSmnSfCMQ5PEPrYhNo"
        />
        <meta property="og:title" content="Jelly Bracelets" />
        <meta property="og:site_name" content="store.happyoctopus.net" />
        <meta
          property="og:description"
          content="HappyOctopus's Jelly Bracelets store. Genuine products exclusively on store.happyoctopus.net"
        />
        <meta
          name="description"
          content="HappyOctopus's Jelly Bracelets store. Genuine products exclusively on store.happyoctopus.net"
        />
        <meta
          property="og:image"
          content={`Latest and greatest products brought to you exclusively by HappyOctopus's Jelly Bracelets.`}
        />
      </Head>
    </Layout>
  );
};

export default Index;
