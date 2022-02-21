import App, { AppContext, AppProps } from "next/app";
import Head from "next/head";
import { ChakraProvider } from "@chakra-ui/react";
import { wrapper } from "../redux/store";
import React from "react";
import { Global, css } from "@emotion/react";
import NextNprogress from "nextjs-progressbar";

const GlobalStyle = ({ children }: any) => {
  return (
    <>
      <Global
        styles={css`
          html {
            height: 100%;
          }
          body {
            height: 100%;
          }
          #__next {
            height: 100%;
          }
        `}
      />
      {children}
    </>
  );
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <GlobalStyle>
        <Head>
          <title>Jelly Bracelets Admin Panel</title>
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
        </Head>
        <NextNprogress
          color="#F387B3"
          startPosition={0.3}
          stopDelayMs={200}
          height={3}
          showOnShallow={true}
          options={{ showSpinner: false }}
        />
        <Component {...pageProps} />
      </GlobalStyle>
    </ChakraProvider>
  );
}

MyApp.getInitialProps = wrapper.getInitialAppProps(
  (store) => async (appContext: AppContext) => {
    const appProps = await App.getInitialProps(appContext);

    const currentUser = store.getState().user.value;

    return { pageProps: { currentUser, ...appProps } };
  }
);

export default wrapper.withRedux(MyApp);
