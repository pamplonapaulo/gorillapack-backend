import AuthLogo from './extensions/config.auth.logo.png';
import MenuLogo from './extensions/favicon.png';
import favicon from './extensions/favicon-capital.png';

export default {
  config: {
    auth: {
      logo: AuthLogo,
    },
    head: {
      favicon: favicon,
    },
    locales: [
      // 'ar',
      // 'fr',
      // 'cs',
      // 'de',
      // 'dk',
      // 'es',
      // 'he',
      // 'id',
      // 'it',
      // 'ja',
      // 'ko',
      // 'ms',
      // 'nl',
      // 'no',
      // 'pl',
      'pt-BR',
      // 'pt',
      // 'ru',
      // 'sk',
      // 'sv',
      // 'th',
      // 'tr',
      // 'uk',
      // 'vi',
      // 'zh-Hans',
      // 'zh',
    ],
    main: {
      logo: AuthLogo,
    },
    menu: {
      logo: MenuLogo,
    },
    theme: {
      borderRadius: '0px',
      colors: {
        // danger100: '#24292d', // TOGGLE OFF BG
        // danger700: '#bf4c69', // TOGGLE OFF COLOR
        // neutral0: '#1f2428', // BACKGROUND SIDEBAR
        // neutral100: '#24292d', // BACKGROUND CONTENT
        // neutral150: '#1f2428', // DISABLED BUTTON BG
        // neutral200: '#1e2327', // LINE THROUGH MIDDLE
        // neutral500: '#9b9faa', // MENU IDLE COLOR
        // neutral600: '#9b9faa', // MENU HOVER COLOR
        // neutral700: '#9b9faa', // MENU ACTIVE ICON COLOR
        // neutral800: '#74787b', // TITLE COLORS
        // neutral900: '#24292d', // TOOLTIP BG
        // primary100: '#24292d', // MENU ACTIVE BG
        // primary200: '#1f2428', // PLUS SIGN BG
        // primary500: '#6584ac', // PRIMARY BUTTON HOVER
        // primary600: '#7d9fbf', // PRIMARY BUTTON COLOR
        // primary700: '#af5d6c', // HIGHLIGHT COLOR
        // secondary100: '#1f2428', // INFO BOX COLOR
        // success100: '#1f2428', // SUCCESS BOX BG
      },
    },
    translations: {
      en: {
        "app.components.LeftMenu.navbrand.title": "Gorilla Pack",
        "app.components.LeftMenu.navbrand.workplace": "LOJA",
        "app.components.HomePage.welcome.": "Gorilla Pack | Content Management System",
        "app.components.HomePage.welcome.again": "Gorilla Pack | Content Management System",
        "app.components.HomePage.welcomeBlock.content": "Minions ipsum pepete para tú poopayee tatata bala tu tatata bala tu bee do bee do bee do la bodaaa daa. Pepete daa potatoooo aaaaaah bappleees jeje. Tulaliloo hana dul sae poopayee para tú. Bananaaaa bananaaaa jeje chasy hana dul sae bappleees baboiii gelatooo poopayee. Tatata bala tu tatata bala tu chasy poopayee bappleees uuuhhh para tú. Hana dul sae jeje pepete hana dul sae tulaliloo bee do bee do bee do la bodaaa uuuhhh. Poulet tikka masala uuuhhh hana dul sae bananaaaa po kass tatata bala tu hahaha poopayee tank yuuu! Aaaaaah tulaliloo para tú chasy chasy potatoooo me want bananaaa! Ti aamoo! Butt.",
        "app.components.HomePage.welcomeBlock.content.again": "Minions ipsum pepete para tú poopayee tatata bala tu tatata bala tu bee do bee do bee do la bodaaa daa. Pepete daa potatoooo aaaaaah bappleees jeje. Tulaliloo hana dul sae poopayee para tú. Bananaaaa bananaaaa jeje chasy hana dul sae bappleees baboiii gelatooo poopayee. Tatata bala tu tatata bala tu chasy poopayee bappleees uuuhhh para tú. Hana dul sae jeje pepete hana dul sae tulaliloo bee do bee do bee do la bodaaa uuuhhh. Poulet tikka masala uuuhhh hana dul sae bananaaaa po kass tatata bala tu hahaha poopayee tank yuuu! Aaaaaah tulaliloo para tú chasy chasy potatoooo me want bananaaa! Ti aamoo! Butt.",
        "app.components.HomePage.button.blog": "Leia a documentação."
      },
    },
    tutorials: false,
    notifications: { release: false },
  },
  bootstrap(app) {
    console.log(app);
  },
};
