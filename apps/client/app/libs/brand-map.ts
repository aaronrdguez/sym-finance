import {
  siUber, siNetflix, siSpotify, siApple, siGoogle, siAmazon,
  siMercadopago, siHbo, siHbomax, siPrimevideo, siYoutube, siYoutubemusic,
  siTwitch, siSteam, siPlaystation, siNotion, siFigma, siGithub,
  siGitlab, siDropbox, siIcloud, siMega, siWhatsapp, siTelegram,
  siDiscord, siSlack, siZoom, siGooglemeet, siPaypal, siStripe,
  siVisa, siMastercard, siAmericanexpress, siShell, siMovistar,
  siAtandt, siVerizon, siMcdonalds, siStarbucks, siKfc, siNike,
  siAdidas, siZara, siAirbnb, siRiotgames, siEpicgames, siUnity,
  siMedium, siX, siTiktok, siInstagram, siFacebook, siPinterest,
  siUbereats, siGoogledrive, siCocacola, siHsbc,
  siBurgerking, siCarrefour, siCrunchyroll, siParamountplus, siMubi,
  siOpenai, siClaude, siHuggingface, siPerplexity, siCanva, siTidal,
  siLyft, siGrab, siWikipedia, siDuckduckgo, siSignal, siWechat, siMessenger, siViber,
  siBitbucket, siJira, siConfluence, siTrello, siAsana, siClickup, siLinear, siAtlassian,
  siTerraform, siDocker, siKubernetes, siAnsible, siPuppet,
  siMongodb, siPostgresql, siRedis, siSqlite, siElasticsearch, siMariadb,
  siNodedotjs, siDeno, siPython, siRust, siKotlin, siTypescript, siJavascript,
  siVercel, siNetlify, siHeroku, siDigitalocean,
  siNginx, siApache, siCaddy, siTraefikproxy,
  siShopify, siWoocommerce, siSquarespace, siWix, siWebflow,
  siAuth0, siFirebase, siSupabase, siAppwrite, siRailway,
  siSendgrid, siMailchimp, siResend,
  siSentry, siDatadog, siNewrelic, siGrafana, siPrometheus,
  siPrisma, siTypeorm, siDrizzle,
  siTailwindcss, siShadcnui, siChakraui, siMui, siAntdesign, siBootstrap, siReactbootstrap,
  siNuxt, siSvelte, siRemix, siGatsby, siAstro, siVite, siWebpack, siEsbuild,
  siTurborepo, siNx, siLerna,
  siPythonanywhere, siDjango, siRuby, siRubyonrails, siPhp,
  siNextdotjs, siReact, siRadixui,
  siPuma, siThreads, siSnapchat, siTumblr, siReddit,
  siGooglegemini, siGithubcopilot,
  siGooglecloud, siCloudflare, siLinux, siMacos, siUbuntu, siDebian, siFedora,
  siIntellijidea, siPycharm, siAndroidstudio,
  siLine, siYarn, siPnpm, siNpm,
  siEslint, siPrettier, siCommitlint,
  siVuedotjs, siAngular, siEmberdotjs,
  siMysql, siRollupdotjs,
  siCodecov, siCodefactor, siCodepen, siCodesandbox, siFreecodecamp, siLeetcode,
  siFramer, siStorybook, siCypress, siVitest, siJest,
  siGithubactions, siGithubpages,
  siUnrealengine, siUbisoft, siRockstargames,
  siXdotorg, siLibreoffice,
  siSlackware, siAlpinelinux, siArchlinux, siManjaro, siPopos,
  siNvidia, siAmd, siIntel, siRaspberrypi, siArduino,
  siTmux, siNeovim, siVim, siGnuemacs,
  siHtmx, siMarkdown, siYaml, siJson,
  siRabbitmq, siApachekafka, siGraphql, siApollographql,
  siPocketbase,
  siReplicate,
  siVault, siHashicorp, siConsul, siNomad,
  siGradle, siWebstorm, siDotnet,
  siOkta, siFusionauth,
  siBabel, siPostcss, siSass, siLess,
  siHomebrew,
  siPandas, siNumpy, siScikitlearn, siPytorch, siTensorflow,
  siApachemaven,
  siBinance,
} from 'simple-icons'
import {
  Car, Gamepad2, Building, Shield, Smartphone,
  Cloud, Plane, ShoppingBag, Crown, Shirt,
  Wifi, Database, Music, Tv, Monitor,
  TrendingUp, CreditCard, Landmark,
  Train, Bus, Bike, Package, Store, MessageSquare,
  type LucideIcon,
} from 'lucide-react'

export interface BrandMatch {
  title: string
  hex: string
  svg: string | null
  LucideIcon: LucideIcon | null
}

type BrandEntry = {
  title: string
  hex: string
  keywords: string[]
  svg?: string
  lucide?: LucideIcon
}

const brandList: BrandEntry[] = [
  // ========= Transporte =========
  { title: 'Uber', hex: '000000', keywords: ['uber', 'uberx', 'uber black'], svg: siUber.svg },
  { title: 'Uber Eats', hex: '06C167', keywords: ['uber eats', 'ubereats', 'uber comidas'], svg: siUbereats.svg },
  { title: 'Cabify', hex: '00B4E4', keywords: ['cabify'], lucide: Car },
  { title: 'Didi', hex: 'FFCC00', keywords: ['didi', 'didichuxing'], lucide: Car },
  { title: 'Lyft', hex: 'FF00BF', keywords: ['lyft'], svg: siLyft.svg },
  { title: 'Grab', hex: '00B14F', keywords: ['grab'], svg: siGrab.svg },
  { title: 'Rappi', hex: 'FF6633', keywords: ['rappi', 'rappi viajes'], lucide: Car },
  { title: 'PedidosYa', hex: 'E8393F', keywords: ['pedidosya', 'pedidos ya'], lucide: Car },
  { title: 'Colectivo', hex: '0077B6', keywords: ['colectivo', 'bondi', 'sube'], lucide: Bus },
  { title: 'Subte', hex: 'E30613', keywords: ['subte', 'subterraneo', 'metro'], lucide: Train },
  { title: 'Tren', hex: '004B93', keywords: ['tren', 'trenes', 'ferrocarril'], lucide: Train },
  { title: 'Taxi', hex: 'F5B342', keywords: ['taxi', 'remis'], lucide: Car },

  // ========= Comida y delivery =========
  { title: 'McDonald\'s', hex: 'FBC817', keywords: ['mcdonald', 'mcdonalds', 'mecato'], svg: siMcdonalds.svg },
  { title: 'Starbucks', hex: '006241', keywords: ['starbucks', 'starbuck'], svg: siStarbucks.svg },
  { title: 'Burger King', hex: 'F5A623', keywords: ['burger king', 'burgerking', 'bk'], svg: siBurgerking.svg },
  { title: 'KFC', hex: 'E4002B', keywords: ['kfc', 'kentucky'], svg: siKfc.svg },
  { title: 'Subway', hex: '008020', keywords: ['subway'], lucide: ShoppingBag },
  { title: 'Coca-Cola', hex: 'D0001A', keywords: ['coca cola', 'cocacola', 'coca-cola', 'coke'], svg: siCocacola.svg },
  { title: 'Mostaza', hex: 'E31E24', keywords: ['mostaza'], lucide: ShoppingBag },
  { title: 'Pizza', hex: 'E5302A', keywords: ['pizza', 'pizzeria'], lucide: ShoppingBag },
  { title: 'Helado', hex: 'F5A623', keywords: ['helado', 'heladeria', 'grido'], lucide: ShoppingBag },

  // ========= Streaming y entretenimiento =========
  { title: 'Netflix', hex: 'E50914', keywords: ['netflix', 'netflx'], svg: siNetflix.svg },
  { title: 'Spotify', hex: '1DB954', keywords: ['spotify', 'spotfy', 'spoti'], svg: siSpotify.svg },
  { title: 'Disney+', hex: '113CCF', keywords: ['disney', 'disney+', 'disneyplus', 'star+'], lucide: Tv },
  { title: 'HBO', hex: '000000', keywords: ['hbo', 'hbo max', 'hbomax', 'max'], svg: siHbo.svg },
  { title: 'HBO Max', hex: '5822B4', keywords: ['hbomax'], svg: siHbomax.svg },
  { title: 'Prime Video', hex: '00A8E1', keywords: ['prime video', 'primevideo', 'amazon prime', 'prime'], svg: siPrimevideo.svg },
  { title: 'YouTube', hex: 'FF0000', keywords: ['youtube', 'youtube premium', 'yt'], svg: siYoutube.svg },
  { title: 'YouTube Music', hex: 'FF0000', keywords: ['youtube music', 'yt music'], svg: siYoutubemusic.svg },
  { title: 'Twitch', hex: '9146FF', keywords: ['twitch'], svg: siTwitch.svg },
  { title: 'Crunchyroll', hex: 'F47521', keywords: ['crunchyroll', 'crunchy roll'], svg: siCrunchyroll.svg },
  { title: 'Paramount+', hex: '0064FF', keywords: ['paramount', 'paramount+', 'paramountplus'], svg: siParamountplus.svg },
  { title: 'Mubi', hex: '9C27B0', keywords: ['mubi'], svg: siMubi.svg },
  { title: 'Deezer', hex: 'FEAA2D', keywords: ['deezer'], lucide: Music },
  { title: 'Tidal', hex: '000000', keywords: ['tidal'], svg: siTidal.svg },
  { title: 'Apple TV+', hex: '555555', keywords: ['apple tv', 'appletv'], lucide: Tv },
  { title: 'Apple Music', hex: 'FA243C', keywords: ['apple music'], lucide: Music },
  { title: 'Flow', hex: 'E31E24', keywords: ['flow', 'flow arg'], lucide: Tv },

  // ========= Gaming =========
  { title: 'Steam', hex: '000000', keywords: ['steam', 'valve'], svg: siSteam.svg },
  { title: 'PlayStation', hex: '003791', keywords: ['playstation', 'play station', 'psn', 'ps5', 'ps4'], svg: siPlaystation.svg },
  { title: 'Xbox', hex: '107C10', keywords: ['xbox', 'game pass', 'xbox live'], lucide: Gamepad2 },
  { title: 'Nintendo', hex: 'E60012', keywords: ['nintendo', 'switch', 'nintendo switch'], lucide: Gamepad2 },
  { title: 'Riot Games', hex: 'D32936', keywords: ['league of legends', 'leagueoflegends', 'lol', 'riot', 'valorant'], svg: siRiotgames.svg },
  { title: 'Epic Games', hex: '313131', keywords: ['epic games', 'epicgames', 'fortnite', 'unreal'], svg: siEpicgames.svg },
  { title: 'Ubisoft', hex: '000000', keywords: ['ubisoft', 'uplay'], svg: siUbisoft.svg },
  { title: 'Rockstar Games', hex: '000000', keywords: ['rockstar', 'gta', 'rockstar games'], svg: siRockstargames.svg },
  { title: 'Unity', hex: '000000', keywords: ['unity'], svg: siUnity.svg },
  { title: 'Unreal Engine', hex: '313131', keywords: ['unreal', 'unreal engine', 'ue5'], svg: siUnrealengine.svg },

  // ========= Suscripciones / Cloud =========
  { title: 'Apple', hex: '555555', keywords: ['apple', 'icloud', 'app store', 'apple one', 'apple id'], svg: siApple.svg },
  { title: 'iCloud', hex: '3693F3', keywords: ['icloud', 'apple storage'], svg: siIcloud.svg },
  { title: 'Google', hex: '4285F4', keywords: ['google', 'google one', 'google workspace', 'g suite'], svg: siGoogle.svg },
  { title: 'Google Drive', hex: '4285F4', keywords: ['google drive', 'drive'], svg: siGoogledrive.svg },
  { title: 'Google Cloud', hex: '4285F4', keywords: ['google cloud', 'gcp'], svg: siGooglecloud.svg },
  { title: 'Google Gemini', hex: '4285F4', keywords: ['gemini', 'google gemini'], svg: siGooglegemini.svg },
  { title: 'Microsoft', hex: '00A4EF', keywords: ['microsoft', 'office 365', 'microsoft 365', 'windows', 'azure'], lucide: Monitor },
  { title: 'OneDrive', hex: '0078D4', keywords: ['onedrive', 'one drive'], lucide: Cloud },
  { title: 'Dropbox', hex: '0061FF', keywords: ['dropbox', 'drop box'], svg: siDropbox.svg },
  { title: 'Mega', hex: 'D9272E', keywords: ['mega', 'mega.nz'], svg: siMega.svg },
  { title: 'Adobe', hex: 'FF0000', keywords: ['adobe', 'creative cloud', 'photoshop', 'illustrator', 'after effects'], lucide: Crown },
  { title: 'Notion', hex: '000000', keywords: ['notion'], svg: siNotion.svg },
  { title: 'Linear', hex: '5E6AD2', keywords: ['linear'], svg: siLinear.svg },
  { title: 'Figma', hex: 'F24E1E', keywords: ['figma'], svg: siFigma.svg },
  { title: 'Canva', hex: '00C4CC', keywords: ['canva'], svg: siCanva.svg },
  { title: 'GitHub', hex: '181717', keywords: ['github', 'git hub'], svg: siGithub.svg },
  { title: 'GitHub Copilot', hex: '181717', keywords: ['copilot', 'github copilot'], svg: siGithubcopilot.svg },
  { title: 'GitLab', hex: 'FC6D26', keywords: ['gitlab', 'git lab'], svg: siGitlab.svg },
  { title: 'Bitbucket', hex: '0052CC', keywords: ['bitbucket'], svg: siBitbucket.svg },
  { title: 'Medium', hex: '000000', keywords: ['medium'], svg: siMedium.svg },
  { title: 'Wikipedia', hex: '000000', keywords: ['wikipedia'], svg: siWikipedia.svg },
  { title: 'Framer', hex: '0055FF', keywords: ['framer'], svg: siFramer.svg },
  { title: 'Storybook', hex: 'FF4785', keywords: ['storybook'], svg: siStorybook.svg },

  // ========= Comunicación =========
  { title: 'WhatsApp', hex: '25D366', keywords: ['whatsapp', 'whats app', 'whatsapp business'], svg: siWhatsapp.svg },
  { title: 'Telegram', hex: '26A5E4', keywords: ['telegram'], svg: siTelegram.svg },
  { title: 'Discord', hex: '5865F2', keywords: ['discord', 'discord nitro'], svg: siDiscord.svg },
  { title: 'Slack', hex: '4A154B', keywords: ['slack'], svg: siSlack.svg },
  { title: 'Zoom', hex: '2D8CFF', keywords: ['zoom'], svg: siZoom.svg },
  { title: 'Google Meet', hex: '00897B', keywords: ['google meet', 'googlemeet', 'meet'], svg: siGooglemeet.svg },
  { title: 'Signal', hex: '3A76F0', keywords: ['signal'], svg: siSignal.svg },
  { title: 'Messenger', hex: '00B2FF', keywords: ['messenger', 'facebook messenger'], svg: siMessenger.svg },
  { title: 'WeChat', hex: '07C160', keywords: ['wechat', 'we chat'], svg: siWechat.svg },
  { title: 'Viber', hex: '7360F2', keywords: ['viber'], svg: siViber.svg },
  { title: 'Line', hex: '00C300', keywords: ['line'], svg: siLine.svg },
  { title: 'Skype', hex: '00AFF0', keywords: ['skype'], lucide: Smartphone },
  { title: 'Teams', hex: '6264A7', keywords: ['teams', 'microsoft teams'], lucide: Monitor },

  // ========= Telefonía =========
  { title: 'Movistar', hex: '00A8E1', keywords: ['movistar', 'movistar argentina'], svg: siMovistar.svg },
  { title: 'Claro', hex: 'ED1C24', keywords: ['claro', 'claro argentina'], lucide: Smartphone },
  { title: 'Personal', hex: 'E30613', keywords: ['personal', 'personal argentina'], lucide: Smartphone },
  { title: 'Personal Pay', hex: 'FF5722', keywords: ['personal pay', 'personalpay'], lucide: Smartphone },
  { title: 'T-Mobile', hex: 'E20074', keywords: ['t mobile', 'tmobile', 't-mobile'], lucide: Wifi },
  { title: 'AT&T', hex: '00A8E1', keywords: ['att', 'at&t', 'at and t'], svg: siAtandt.svg },
  { title: 'Verizon', hex: 'CD040B', keywords: ['verizon'], svg: siVerizon.svg },
  { title: 'Tuenti', hex: '0097D7', keywords: ['tuenti'], lucide: Smartphone },

  // ========= Internet / Cable / TV =========
  { title: 'Fibertel', hex: 'E31E24', keywords: ['fibertel', 'fiber tel'], lucide: Wifi },
  { title: 'Telecentro', hex: '003366', keywords: ['telecentro'], lucide: Wifi },
  { title: 'Cablevisión', hex: 'E31E24', keywords: ['cablevision', 'cable vision'], lucide: Tv },
  { title: 'Directv', hex: '003366', keywords: ['directv', 'direct tv', 'dtv'], lucide: Tv },
  { title: 'Antina', hex: '004481', keywords: ['antina'], lucide: Wifi },

  // ========= Pagos y fintech =========
  { title: 'Mercado Pago', hex: '00B1EA', keywords: ['mercado pago', 'mercadopago', 'mp'], svg: siMercadopago.svg },
  { title: 'Mercado Libre', hex: 'FFE600', keywords: ['mercado libre', 'mercadolibre', 'meli'], lucide: ShoppingBag },
  { title: 'PayPal', hex: '00457C', keywords: ['paypal', 'pay pal'], svg: siPaypal.svg },
  { title: 'Stripe', hex: '008CDD', keywords: ['stripe'], svg: siStripe.svg },
  { title: 'Visa', hex: '1A1F71', keywords: ['visa'], svg: siVisa.svg },
  { title: 'Mastercard', hex: 'EB001B', keywords: ['mastercard', 'master card', 'mc'], svg: siMastercard.svg },
  { title: 'American Express', hex: '2E77BC', keywords: ['american express', 'amex', 'americanexpress'], svg: siAmericanexpress.svg },
  { title: 'Naranja', hex: 'FF6C00', keywords: ['naranja', 'naranja x'], lucide: CreditCard },
  { title: 'Naranja X', hex: 'FF6C00', keywords: ['naranjax'], lucide: CreditCard },
  { title: 'Ualá', hex: '6C2BD9', keywords: ['uala', 'uala'], lucide: CreditCard },
  { title: 'Lemon', hex: 'FFD600', keywords: ['lemon', 'lemon cash'], lucide: CreditCard },
  { title: 'Prex', hex: '0B7A9C', keywords: ['prex', 'prex ar'], lucide: CreditCard },
  { title: 'Rebank', hex: '00C853', keywords: ['rebanking', 'rebank'], lucide: Building },
  { title: 'Brubank', hex: '5B2D8E', keywords: ['brubank', 'bru bank'], lucide: Building },
  { title: 'DolarApp', hex: '00D4AA', keywords: ['dolarapp', 'dolar app'], lucide: TrendingUp },
  { title: 'Auth0', hex: 'EB5424', keywords: ['auth0'], svg: siAuth0.svg },
  { title: 'Okta', hex: '007DC1', keywords: ['okta'], svg: siOkta.svg },

  // ========= Inversión =========
  { title: 'Binance', hex: 'F3BA2F', keywords: ['binance', 'binance wallet'], svg: siBinance.svg },
  { title: 'InvertirOnline', hex: '00A650', keywords: ['invertir online', 'iol', 'invertironline'], lucide: TrendingUp },
  { title: 'PPI', hex: '003366', keywords: ['ppi'], lucide: TrendingUp },
  { title: 'Cocos Capital', hex: '00BFFF', keywords: ['cocos', 'cocos capital'], lucide: TrendingUp },
  { title: 'Balanz', hex: '003366', keywords: ['balanz'], lucide: TrendingUp },
  { title: 'Adcap', hex: 'E31E24', keywords: ['adcap'], lucide: TrendingUp },
  { title: 'BullMarket', hex: 'FFD700', keywords: ['bullmarket', 'bull market'], lucide: TrendingUp },
  { title: 'Rava', hex: '004C97', keywords: ['rava'], lucide: TrendingUp },
  { title: 'BMB', hex: '004481', keywords: ['bmb'], lucide: TrendingUp },
  { title: 'Grupo Financiero', hex: '333333', keywords: ['grupo financiero', 'gf'], lucide: Building },

  // ========= Bancos =========
  { title: 'HSBC', hex: 'DB0011', keywords: ['hsbc'], svg: siHsbc.svg },
  { title: 'Santander', hex: 'EC0000', keywords: ['santander', 'banco santander', 'santander rio'], lucide: Landmark },
  { title: 'BBVA', hex: '004481', keywords: ['bbva', 'bbva francés', 'bbva frances'], lucide: Landmark },
  { title: 'Banco Galicia', hex: '003EA4', keywords: ['galicia', 'banco galicia'], lucide: Landmark },
  { title: 'Banco Macro', hex: '00843D', keywords: ['macro', 'banco macro'], lucide: Landmark },
  { title: 'Banco Provincia', hex: '0055A4', keywords: ['provincia', 'banco provincia', 'bapro'], lucide: Landmark },
  { title: 'Banco Nación', hex: '005CA9', keywords: ['nacion', 'banco nacion', 'bna'], lucide: Landmark },
  { title: 'Banco Supervielle', hex: '004C97', keywords: ['supervielle', 'banco supervielle'], lucide: Landmark },
  { title: 'Banco Itaú', hex: '003399', keywords: ['itau', 'itaú', 'banco itau'], lucide: Landmark },
  { title: 'Banco Ciudad', hex: '00529E', keywords: ['ciudad', 'banco ciudad'], lucide: Landmark },
  { title: 'Banco Patagonia', hex: '0066B3', keywords: ['patagonia', 'banco patagonia'], lucide: Landmark },
  { title: 'Banco Hipotecario', hex: '004B93', keywords: ['hipotecario', 'banco hipotecario'], lucide: Landmark },
  { title: 'Banco Comafi', hex: '004481', keywords: ['comafi', 'banco comafi'], lucide: Landmark },
  { title: 'Banco Piano', hex: '003366', keywords: ['piano', 'banco piano'], lucide: Landmark },
  { title: 'Banco Saenz', hex: '004C97', keywords: ['saenz', 'banco saenz'], lucide: Landmark },

  // ========= E-commerce =========
  { title: 'Amazon', hex: 'FF9900', keywords: ['amazon', 'amzn', 'amazon prime'], svg: siAmazon.svg },
  { title: 'Shopify', hex: '7AB55C', keywords: ['shopify'], svg: siShopify.svg },
  { title: 'WooCommerce', hex: '96588A', keywords: ['woocommerce', 'woo commerce'], svg: siWoocommerce.svg },
  { title: 'Falabella', hex: 'E30613', keywords: ['falabella'], lucide: ShoppingBag },
  { title: 'Ripley', hex: 'ED1C24', keywords: ['ripley'], lucide: ShoppingBag },
  { title: 'Fravega', hex: 'E31E24', keywords: ['fravega', 'frávega'], lucide: Store },
  { title: 'Musimundo', hex: '004481', keywords: ['musimundo'], lucide: Store },
  { title: 'Garbarino', hex: 'E30613', keywords: ['garbarino'], lucide: Store },
  { title: 'Sodimac', hex: 'FFCC00', keywords: ['sodimac'], lucide: Store },
  { title: 'Easy', hex: 'FF6600', keywords: ['easy argentina'], lucide: Store },
  { title: 'TiendaMía', hex: 'E8393F', keywords: ['tiendamia', 'tienda mia'], lucide: Package },
  { title: 'AliExpress', hex: 'FF4747', keywords: ['aliexpress', 'ali express'], lucide: Package },
  { title: 'SHEIN', hex: '000000', keywords: ['shein'], lucide: Shirt },
  { title: 'Wish', hex: '30B6E6', keywords: ['wish'], lucide: Package },

  // ========= Supermercados =========
  { title: 'Carrefour', hex: '004E9A', keywords: ['carrefour', 'carrefour argentina'], svg: siCarrefour.svg },
  { title: 'Coto', hex: 'E30613', keywords: ['coto', 'coto argentina'], lucide: ShoppingBag },
  { title: 'Disco', hex: 'E31E24', keywords: ['disco', 'disco argentina'], lucide: ShoppingBag },
  { title: 'Jumbo', hex: '003DA5', keywords: ['jumbo', 'jumbo argentina'], lucide: ShoppingBag },
  { title: 'Día', hex: 'E31E24', keywords: ['dia argentina', 'dia%'], lucide: ShoppingBag },
  { title: 'Changomas', hex: 'E30613', keywords: ['changomas', 'chango mas'], lucide: ShoppingBag },
  { title: 'La Anónima', hex: 'E30613', keywords: ['anonima', 'la anonima'], lucide: ShoppingBag },
  { title: 'Mami', hex: '00843D', keywords: ['mami', 'super mami'], lucide: ShoppingBag },

  // ========= Farmacias =========
  { title: 'Farmacity', hex: '00A650', keywords: ['farmacity'], lucide: Shield },
  { title: 'Farmacia', hex: '00A650', keywords: ['farmacia', 'farmacias'], lucide: Shield },

  // ========= Salud / Obras Sociales =========
  { title: 'OSDE', hex: '004481', keywords: ['osde'], lucide: Shield },
  { title: 'Swiss Medical', hex: '0097D7', keywords: ['swiss medical', 'swissmedical'], lucide: Shield },
  { title: 'Galeno', hex: '004C97', keywords: ['galeno'], lucide: Shield },
  { title: 'Medicus', hex: '00A650', keywords: ['medicus'], lucide: Shield },
  { title: 'Omint', hex: '003366', keywords: ['omint'], lucide: Shield },
  { title: 'Sancor Salud', hex: 'E30613', keywords: ['sancor', 'sancor salud'], lucide: Shield },

  // ========= Moda / Indumentaria =========
  { title: 'Nike', hex: '111111', keywords: ['nike'], svg: siNike.svg },
  { title: 'Adidas', hex: '000000', keywords: ['adidas'], svg: siAdidas.svg },
  { title: 'Zara', hex: '000000', keywords: ['zara', 'zara home'], svg: siZara.svg },
  { title: 'H&M', hex: 'E50010', keywords: ['h&m', 'hm', 'h and m'], lucide: Shirt },
  { title: 'Lacoste', hex: '004C45', keywords: ['lacoste'], lucide: Shirt },
  { title: 'Puma', hex: '000000', keywords: ['puma'], svg: siPuma.svg },
  { title: 'Levi\'s', hex: '000000', keywords: ['levis', 'levi\'s'], lucide: Shirt },

  // ========= Viajes =========
  { title: 'Airbnb', hex: 'FF5A5F', keywords: ['airbnb', 'air bnb', 'bnb'], svg: siAirbnb.svg },
  { title: 'Booking', hex: '003580', keywords: ['booking'], lucide: Plane },
  { title: 'Despegar', hex: '0077C8', keywords: ['despegar'], lucide: Plane },
  { title: 'Almundo', hex: '00B1EA', keywords: ['almundo'], lucide: Plane },
  { title: 'Aerolíneas Argentinas', hex: '00A8E1', keywords: ['aerolineas', 'aerolineas argentinas', 'aar'], lucide: Plane },
  { title: 'LATAM', hex: '003399', keywords: ['latam'], lucide: Plane },
  { title: 'JetSmart', hex: 'F5A623', keywords: ['jetsmart', 'jet smart'], lucide: Plane },
  { title: 'Flybondi', hex: '00A650', keywords: ['flybondi', 'fly bondi'], lucide: Plane },

  // ========= Redes sociales =========
  { title: 'X', hex: '000000', keywords: ['x twitter', 'twitter'], svg: siX.svg },
  { title: 'TikTok', hex: '000000', keywords: ['tiktok', 'tik tok'], svg: siTiktok.svg },
  { title: 'Instagram', hex: 'E4405F', keywords: ['instagram', 'ig'], svg: siInstagram.svg },
  { title: 'Facebook', hex: '1877F2', keywords: ['facebook', 'fb', 'meta'], svg: siFacebook.svg },
  { title: 'Threads', hex: '000000', keywords: ['threads'], svg: siThreads.svg },
  { title: 'LinkedIn', hex: '0A66C2', keywords: ['linkedin', 'linked in'], lucide: Building },
  { title: 'Snapchat', hex: 'FFFC00', keywords: ['snapchat', 'snap'], svg: siSnapchat.svg },
  { title: 'Pinterest', hex: 'BD081C', keywords: ['pinterest'], svg: siPinterest.svg },
  { title: 'Tumblr', hex: '36465D', keywords: ['tumblr'], svg: siTumblr.svg },
  { title: 'Reddit', hex: 'FF4500', keywords: ['reddit'], svg: siReddit.svg },
  { title: 'Discourse', hex: '000000', keywords: ['discourse'], lucide: MessageSquare },

  // ========= Combustible =========
  { title: 'Shell', hex: 'FFCC00', keywords: ['shell', 'shell argentina'], svg: siShell.svg },
  { title: 'YPF', hex: '003DA5', keywords: ['ypf'], lucide: Database },
  { title: 'Axion', hex: 'E31E24', keywords: ['axion'], lucide: Database },
  { title: 'Puma Energy', hex: '000000', keywords: ['puma energy'], lucide: Database },
  { title: 'Estación', hex: '004481', keywords: ['estacion de servicio', 'estacion servicio', 'nafta'], lucide: Database },

  // ========= AI =========
  { title: 'OpenAI', hex: '412991', keywords: ['openai', 'chatgpt', 'gpt'], svg: siOpenai.svg },
  { title: 'Claude', hex: 'D97757', keywords: ['claude', 'anthropic'], svg: siClaude.svg },
  { title: 'Hugging Face', hex: 'FFD21E', keywords: ['hugging face', 'huggingface'], svg: siHuggingface.svg },
  { title: 'Perplexity', hex: '1C3A5C', keywords: ['perplexity', 'perplexity ai'], svg: siPerplexity.svg },
  { title: 'Midjourney', hex: '000000', keywords: ['midjourney'], lucide: Crown },
  { title: 'Stability AI', hex: 'C9282D', keywords: ['stability ai', 'stabilityai'], lucide: Crown },
  { title: 'Replicate', hex: '1E1E1E', keywords: ['replicate'], svg: siReplicate.svg },
  { title: 'GoDaddy', hex: '1BDBDB', keywords: ['godaddy', 'go daddy'], lucide: Building },

  // ========= Tech infra =========
  { title: 'Vercel', hex: '000000', keywords: ['vercel'], svg: siVercel.svg },
  { title: 'Netlify', hex: '00C7B7', keywords: ['netlify'], svg: siNetlify.svg },
  { title: 'Heroku', hex: '430098', keywords: ['heroku'], svg: siHeroku.svg },
  { title: 'DigitalOcean', hex: '0080FF', keywords: ['digitalocean', 'digital ocean'], svg: siDigitalocean.svg },
  { title: 'Cloudflare', hex: 'F38020', keywords: ['cloudflare'], svg: siCloudflare.svg },
  { title: 'Docker', hex: '2496ED', keywords: ['docker'], svg: siDocker.svg },
  { title: 'Kubernetes', hex: '326CE5', keywords: ['kubernetes', 'k8s'], svg: siKubernetes.svg },
  { title: 'Terraform', hex: '7B42BC', keywords: ['terraform'], svg: siTerraform.svg },
  { title: 'Ansible', hex: 'EE0000', keywords: ['ansible'], svg: siAnsible.svg },
  { title: 'Firebase', hex: 'FFCA28', keywords: ['firebase'], svg: siFirebase.svg },
  { title: 'Supabase', hex: '3ECF8E', keywords: ['supabase'], svg: siSupabase.svg },
  { title: 'Appwrite', hex: 'F02E65', keywords: ['appwrite'], svg: siAppwrite.svg },
  { title: 'Railway', hex: '0B0D0E', keywords: ['railway'], svg: siRailway.svg },
  { title: 'Prisma', hex: '2D3748', keywords: ['prisma'], svg: siPrisma.svg },

  // ========= Servicios públicos =========
  { title: 'Edesur', hex: '003366', keywords: ['edesur'], lucide: Database },
  { title: 'Edenor', hex: 'E30613', keywords: ['edenor'], lucide: Database },
  { title: 'AySA', hex: '00A8E1', keywords: ['aysa', 'agua'], lucide: Database },
  { title: 'Metrogas', hex: 'E31E24', keywords: ['metrogas'], lucide: Database },
  { title: 'Naturgy', hex: '004B93', keywords: ['naturgy', 'gas natural'], lucide: Database },
  { title: 'ABL', hex: '004481', keywords: ['abl', 'arba', 'agip'], lucide: Building },
  { title: 'ABL', hex: 'E30613', keywords: ['municipal', 'comuna', 'tasa'], lucide: Building },

  // ========= Correo / Envíos =========
  { title: 'Correo Argentino', hex: '00A8E1', keywords: ['correo argentino', 'correo'], lucide: Package },
  { title: 'OCA', hex: 'E31E24', keywords: ['oca', 'oca envios'], lucide: Package },
  { title: 'Andreani', hex: 'E30613', keywords: ['andreani'], lucide: Package },
  { title: 'PedidosYa', hex: 'E8393F', keywords: ['pedidosya envios'], lucide: Package },

  // ========= Educación =========
  { title: 'Coderhouse', hex: '00A650', keywords: ['coderhouse', 'coder house'], lucide: Monitor },
  { title: 'Platzi', hex: '98CA3F', keywords: ['platzi'], lucide: Monitor },
  { title: 'Udemy', hex: 'A435F0', keywords: ['udemy'], lucide: Monitor },
  { title: 'Coursera', hex: '0056D2', keywords: ['coursera'], lucide: Monitor },
  { title: 'Domestika', hex: 'E31E24', keywords: ['domestika'], lucide: Monitor },
  { title: 'Crehana', hex: '00A650', keywords: ['crehana'], lucide: Monitor },

  // ========= Juegos / Azar =========
  { title: 'Lotería', hex: 'E30613', keywords: ['loteria', 'lotería', 'quiniela'], lucide: Crown },
  { title: 'Quini 6', hex: '004481', keywords: ['quini 6', 'quini6'], lucide: Crown },
  { title: 'Bingo', hex: 'E31E24', keywords: ['bingo'], lucide: Crown },

  // ========= Otros =========
  { title: 'Netflix', hex: 'E50914', keywords: ['netflix gift', 'netflix gift card'], svg: siNetflix.svg },
  { title: 'Google Play', hex: '414141', keywords: ['google play', 'googleplay', 'play store'], lucide: Smartphone },
  { title: 'App Store', hex: '555555', keywords: ['app store', 'appstore'], lucide: Smartphone },
  { title: 'ML', hex: 'FFE600', keywords: ['ml'], lucide: ShoppingBag },
]

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
}

export function detectBrand(text: string | null | undefined): BrandMatch | null {
  if (!text) return null
  const normalized = normalize(text)

  for (const entry of brandList) {
    for (const kw of entry.keywords) {
      if (normalized.includes(kw)) {
        return {
          title: entry.title,
          hex: entry.hex,
          svg: entry.svg ?? null,
          LucideIcon: entry.lucide ?? null,
        }
      }
    }
  }

  return null
}
