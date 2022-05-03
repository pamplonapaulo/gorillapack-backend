import AuthLogo from './extensions/config.auth.logo.png';
import Logo from './extensions/logo.png';

export default {
  config: {
    auth: {
      logo: AuthLogo,
    },
    head: {
      favicon: Logo,
    },
    locales: [
      'pt-BR'
    ],
    main: {
      logo: AuthLogo,
    },
    menu: {
      logo: Logo,
    },
    theme: {
      borderRadius: '0px'
    },
    translations: {
      en: {
        "HomePage.helmet.title": "Admin Gorilla Pack",
        "app.components.LeftMenu.navbrand.title": "Gorilla Pack",
        "app.components.LeftMenu.navbrand.workplace": "Administração da Loja",
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
