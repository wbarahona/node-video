//
// All web related configurations will go here
// ---------------------------------------------------------------------------------------------

module.exports = {
    site: {
        seo: {
            author: 'Willmer Barahona',
            base: '/',
            charset: 'UTF-8',
            description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            title: 'YouClip It - Convert youtube videos into 30s clips',
            url: 'http://www.domain.com'
        },
        business: {
            companyname: 'Your Company',
            companyalias: 'Lorem Ipsum dolor sit amet',
            catchphrase: ' Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
            contact: [
                {
                    title: 'manager',
                    email: 'manager@domain.com',
                    phone: '26657634',
                    name: 'Frank Miller'
                },
                {
                    title: 'conctact',
                    email: 'janedoe@domain.com',
                    phone: '26657634',
                    name: 'Jane Doe'
                },
                {
                    title: 'sales',
                    email: 'jdoe@domain.com',
                    phone: '26657634',
                    name: 'Joe Doe'
                }
            ],
            logo: {
                svg: 'logo.svg',
                png: 'logo.png'
            }
        },
        authkeys: {
            facebookapps: [
                {appid: '', appsecret: '', clientToken: ''},
                {appid: '', appsecret: '', clientToken: ''}
            ],
            twitterapps: '',
            google: {
                analytics: 'UA-1235486-9',
                public: {
                    apikey: ''
                },
                captcha: '6LcnDg8TAAAAAL_jcmgzXPc-QCoa8SujFpmrzwJW',
                oauth: [
                    {clientid: '', emailaddress: '', clientsecret: ''},
                    {clientid: '', emailaddress: '', clientsecret: ''}
                ]
            }
        },
        regional: {
            language: 'en',
            location: '',
            address: [
                '1. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                '2. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
            ],
            coordinates: []
        },
        menu: [
            {title: 'Home', url: '/'},
            {title: 'Project A', url: '/projects/project-a.html'},
            {title: 'About Us', url: 'about.html'},
            {title: 'Contact Us', url: '/contact/'}
        ],
        socialurl: {
            facebook: '',
            twitter: '',
            youtube: ''
        }
    },
    data: {}
};
