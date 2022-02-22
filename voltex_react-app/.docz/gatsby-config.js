const { mergeWith } = require('docz-utils')
const fs = require('fs-extra')

let custom = {}
const hasGatsbyConfig = fs.existsSync('./gatsby-config.custom.js')

if (hasGatsbyConfig) {
  try {
    custom = require('./gatsby-config.custom')
  } catch (err) {
    console.error(
      `Failed to load your gatsby-config.js file : `,
      JSON.stringify(err),
    )
  }
}

const config = {
  pathPrefix: '/',

  siteMetadata: {
    title: 'Voltex React App',
    description: 'My awesome app using docz',
  },
  plugins: [
    {
      resolve: 'gatsby-theme-docz',
      options: {
        themeConfig: {},
        src: './',
        gatsbyRoot: null,
        themesDir: 'src',
        mdxExtensions: ['.md', '.mdx'],
        docgenConfig: {},
        menu: [],
        mdPlugins: [],
        hastPlugins: [],
        ignore: [],
        typescript: false,
        ts: false,
        propsParser: true,
        'props-parser': true,
        debug: false,
        native: false,
        openBrowser: null,
        o: null,
        open: null,
        'open-browser': null,
        root:
          'C:\\Users\\USER\\Documents\\My projects\\Voltex Middleware\\voltex_react-app\\.docz',
        base: '/',
        source: './',
        'gatsby-root': null,
        files: '**/*.{md,markdown,mdx}',
        public: '/public',
        dest: '.docz/dist',
        d: '.docz/dist',
        editBranch: 'master',
        eb: 'master',
        'edit-branch': 'master',
        config: '',
        title: 'Voltex React App',
        description: 'My awesome app using docz',
        host: 'localhost',
        port: 3001,
        p: 3000,
        separator: '-',
        paths: {
          root:
            'C:\\Users\\USER\\Documents\\My projects\\Voltex Middleware\\voltex_react-app',
          templates:
            'C:\\Users\\USER\\Documents\\My projects\\Voltex Middleware\\voltex_react-app\\node_modules\\docz-core\\dist\\templates',
          docz:
            'C:\\Users\\USER\\Documents\\My projects\\Voltex Middleware\\voltex_react-app\\.docz',
          cache:
            'C:\\Users\\USER\\Documents\\My projects\\Voltex Middleware\\voltex_react-app\\.docz\\.cache',
          app:
            'C:\\Users\\USER\\Documents\\My projects\\Voltex Middleware\\voltex_react-app\\.docz\\app',
          appPackageJson:
            'C:\\Users\\USER\\Documents\\My projects\\Voltex Middleware\\voltex_react-app\\package.json',
          appTsConfig:
            'C:\\Users\\USER\\Documents\\My projects\\Voltex Middleware\\voltex_react-app\\tsconfig.json',
          gatsbyConfig:
            'C:\\Users\\USER\\Documents\\My projects\\Voltex Middleware\\voltex_react-app\\gatsby-config.js',
          gatsbyBrowser:
            'C:\\Users\\USER\\Documents\\My projects\\Voltex Middleware\\voltex_react-app\\gatsby-browser.js',
          gatsbyNode:
            'C:\\Users\\USER\\Documents\\My projects\\Voltex Middleware\\voltex_react-app\\gatsby-node.js',
          gatsbySSR:
            'C:\\Users\\USER\\Documents\\My projects\\Voltex Middleware\\voltex_react-app\\gatsby-ssr.js',
          importsJs:
            'C:\\Users\\USER\\Documents\\My projects\\Voltex Middleware\\voltex_react-app\\.docz\\app\\imports.js',
          rootJs:
            'C:\\Users\\USER\\Documents\\My projects\\Voltex Middleware\\voltex_react-app\\.docz\\app\\root.jsx',
          indexJs:
            'C:\\Users\\USER\\Documents\\My projects\\Voltex Middleware\\voltex_react-app\\.docz\\app\\index.jsx',
          indexHtml:
            'C:\\Users\\USER\\Documents\\My projects\\Voltex Middleware\\voltex_react-app\\.docz\\app\\index.html',
          db:
            'C:\\Users\\USER\\Documents\\My projects\\Voltex Middleware\\voltex_react-app\\.docz\\app\\db.json',
        },
      },
    },
  ],
}

const merge = mergeWith((objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue)
  }
})

module.exports = merge(config, custom)
