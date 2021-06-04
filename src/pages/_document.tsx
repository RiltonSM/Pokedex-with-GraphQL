import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
    render(){
        return(
            <Html>
                <Head>         
                    <title>Pokedex</title>
                    <meta name="description" content="Pokedex developed with GraphQL" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <body>
                    <Main/>
                    <NextScript/>
                </body>
            </Html>
        )
    }
}