import { extract } from '@extractus/article-extractor';

const input = 'https://www.asos.com/es/versace-jeans-couture/camiseta-negra-con-emblema-garden-de-versace-jeans-couture/prd/204612454#colourWayId-204612458'

// here we use top-level await, assume current platform supports it
try {
    const article = await extract(input)
    console.log(article)
} catch (err) {
    console.error(err)
}