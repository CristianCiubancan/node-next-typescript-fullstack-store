import { ChakraProvider } from "@chakra-ui/react";
import { css, Global } from "@emotion/react";
import App, { AppContext, AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import NextNprogress from "nextjs-progressbar";
import React from "react";
import GetNavCategoriesOperation from "../operations/category/getNavCategories";
import { setNavCategories } from "../redux/features/navCategories/navCategoriesSlice";
import { wrapper } from "../redux/store";
import { NavCategory } from "../types/navCategories";

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
          label {
            touch-action: none;
          }
        `}
      />
      {children}
    </>
  );
};

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <ChakraProvider>
      <GlobalStyle>
        <Head>
          <title>Jelly Bracelets</title>
          <meta property="og:site_name" content="store.happyoctopus.net" />
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

    const cachedNavCategories = store.getState().navCategories.value;

    if (cachedNavCategories[0]?.id === 0) {
      const categories: NavCategory[] = await GetNavCategoriesOperation();

      store.dispatch(setNavCategories(categories));
    }

    return { pageProps: { ...appProps } };
  }
);

export default wrapper.withRedux(MyApp);
