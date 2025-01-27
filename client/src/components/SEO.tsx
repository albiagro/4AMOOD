import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({title, description, name, type} : {title : string, description: string, name: string, type : string }) {

return (
<Helmet>
{ /* Standard metadata tags */ }
<title>{title}</title>
<meta name='description' content={description} />
{ /* End standard metadata tags */ }
{ /* Facebook tags */ }
<meta property="og:type" content={type} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
{ /* End Facebook tags */ }
{ /* Twitter tags */ }
<meta name="twitter:creator" content={name} />
<meta name="twitter:card" content={type} />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        ></script>
        <script>
          {`
            (adsbygoogle = window.adsbygoogle || []).push({
              google_ad_client: "ca-pub-8373910532445865",
              enable_page_level_ads: true
            });
          `}
        </script>
{ /* End Twitter tags */ }
</Helmet>
)
}