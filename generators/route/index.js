/**
 * Route Generator
 */

const routeExists = require('../utils/routeExists');

module.exports = {
  description: 'Add a route component',
  prompts: [
        {
      type: 'list',
      name: 'typeLink',
      message: 'Select the link type:',
      default: 'Admin',
      choices: () => ['Admin'], // , 'Client'
    },
    {
      when: (answers) => answers.typeLink === 'Admin',
      type: 'list',
      name: 'type',
      message: 'Select the base route type:',
      default: 'CRUD',
      choices: () => ['CRUD', 'Blank'],
    },
    {
      when: (answers) => answers.typeLink === 'Client',
      type: 'list',
      name: 'type',
      message: 'Select the base route type:',
      default: 'Blank',
      choices: () => ['Blank'],
    },
    {
      type: 'list',
      name: 'addMenu',
      message: 'That page add to menu:',
      default: 'Yes',
      choices: () => ['Yes', "No"],
    },
    {
      type: 'input',
      name: 'name',
      message: 'What should it be called?',
      default: (answers) => (answers.type === 'CRUD' ? "Management" : "Page") + "Test",
      validate: (value) => {
        if ((/.+/).test(value)) {
          return routeExists(value) ? 'A file with this name already exists' : true;
        }
        return 'The name is required';
      },
    },
    {
      type: 'input',
      name: 'title',
      message: 'What is its title?',
      default: (answers) => answers.name.charAt(0).toUpperCase() + answers.name.slice(1) + (answers.type === 'CRUD' ? " Management" : " Page"),
      validate: (value) => (/.+/).test(value) ? true : 'The title is required',
    },
    {
      type: 'input',
      name: 'api',
      message: 'What is the API path in page?',
      default: (answers) => '/' + answers.name.toLowerCase(),
    },
    {
      when: (answers) => answers.type === 'CRUD',
      type: 'confirm',
      name: 'isSearch',
      message: 'That data has search?',
      default: false,
    },
    {
      when: (answers) => answers.type === 'CRUD',
      type: 'confirm',
      name: 'isGroup',
      message: 'That data has group?',
      default: false,
    },
    {
      when: (answers) => answers.isGroup === true,
      type: 'input',
      name: 'nameGroup',
      message: 'What should it be called?',
      default: 'GroupTest',
    },
    {
      when: (answers) => answers.isGroup === true,
      type: 'input',
      name: 'apiGroup',
      message: 'What is the API path in group?',
      default: (answers) => '/' + answers.nameGroup.toLowerCase(),
    },
  ],
  actions: (answers) => {
    // Generate index.js and index.test.js
    let actions = [];
    answers.linkPath = answers.typeLink === "Admin" ? "Admin/" : "Client/"
    switch (answers.type) {
      /*
       * Create a file basic structure CRUD
       */
      case 'CRUD': {
        actions = [
          {
            type: 'add',
            path: '../src/routes/{{linkPath}}{{properCase name}}/index.js',
            templateFile: './route/CRUD/index.js.hbs',
            abortOnFail: true,
          }, {
            type: 'add',
            path: `../src/routes/{{linkPath}}{{properCase name}}/components/index.js`,
            templateFile: './route/CRUD/components/index.js.hbs',
            abortOnFail: true,
          },{
            type: 'add',
            path: `../src/routes/{{linkPath}}{{properCase name}}/components/index.less`,
            templateFile: './route/CRUD/components/index.less.hbs',
            abortOnFail: true,
          },
          {
            type: 'add',
            path: `../src/routes/{{linkPath}}{{properCase name}}/components/columns.js`,
            templateFile: './route/CRUD/components/columns.js.hbs',
            abortOnFail: true,
          },{
            type: 'add',
            path: `../src/routes/{{linkPath}}{{properCase name}}/model/index.js`,
            templateFile: './route/CRUD/model/index.js.hbs',
            abortOnFail: true,
          },{
            type: 'add',
            path: `../src/routes/{{linkPath}}{{properCase name}}/service/index.js`,
            templateFile: './route/CRUD/service/index.js.hbs',
            abortOnFail: true,
          },{
            type: 'add',
            path: `../src/routes/{{linkPath}}{{properCase name}}/messages/index.js`,
            templateFile: './route/CRUD/messages/index.js.hbs',
            abortOnFail: true,
          }
        ];
        break;
      }
      default: {
        /*
         * Create a file basic structure Blank
         */
        actions = [
          {
            type: 'add',
            path: `../src/routes/{{linkPath}}{{properCase name}}/index.js`,
            templateFile: './route/Blank/index.js.hbs',
            abortOnFail: true,
          }, {
            type: 'add',
            path: `../src/routes/{{linkPath}}{{properCase name}}/components/index.js`,
            templateFile: './route/Blank/components/index.js.hbs',
            abortOnFail: true,
          },{
            type: 'add',
            path: `../src/routes/{{linkPath}}{{properCase name}}/components/index.less`,
            templateFile: './route/Blank/components/index.less.hbs',
            abortOnFail: true,
          },{
            type: 'add',
            path: `../src/routes/{{linkPath}}{{properCase name}}/model/index.js`,
            templateFile: './route/Blank/model/index.js.hbs',
            abortOnFail: true,
          },{
            type: 'add',
            path: `../src/routes/{{linkPath}}{{properCase name}}/service/index.js`,
            templateFile: './route/Blank/service/index.js.hbs',
            abortOnFail: true,
          },{
            type: 'add',
            path: `../src/routes/{{linkPath}}{{properCase name}}/messages/index.js`,
            templateFile: './route/CRUD/messages/index.js.hbs',
            abortOnFail: true,
          }
        ];
      }
    }

    if (answers.addMenu === "Yes") {
      actions.push({
        type: 'modify',
        path: '../src/models/messages/index.js',
        pattern: /(\n)(}\/\/\ 💬 generate link to here)/gi,
        template: `\n  {{camelCase name}}: {\n    id: "models.Global.{{camelCase name}}",\n    defaultMessage: '{{name}}',\n  },\n$2`,
      });
      actions.push({
        type: 'modify',
        path: '../src/translations/en.json',
        pattern: /(\n)(})/gi,
        template: `,\n\n  "models.Global.{{camelCase name}}": "{{properCase name}}"\n$2`,
      });
      actions.push({
        type: 'modify',
        path: '../src/translations/vi.json',
        pattern: /(\n)(})/gi,
        template: `,\n\n  "models.Global.{{camelCase name}}": "{{properCase name}}"\n$2`,
      });
      actions.push({
        type: 'modify',
        path: '../src/translations/ja.json',
        pattern: /(\n)(})/gi,
        template: `,\n\n  "models.Global.{{camelCase name}}": "{{properCase name}}"\n$2`,
      });
      actions.push({
        type: 'modify',
        path: '../src/models/global.js',
        pattern: /(\n)(        \/\/\ 💬 generate link to here)/gi,
        template: `,\n        { name: intl.formatMessage(messages.{{ camelCase name }}), icon: 'las la-tachometer-alt', path: routerLinks("{{ properCase name }}"${answers.type === 'CRUD' ? ', "curd"' : ""}),}\n$2`,
      });
    }

    actions.push({
      type: 'modify',
      path: '../src/routes/index.js',
      pattern: /(\n)(const routesConfig)/gi,
      template: `import {{properCase name}} from \'./{{linkPath}}{{properCase name}}\';\n$1$2`,
    });
    actions.push({
      type: 'modify',
      path: '../src/utils/routerLinks.js',
      pattern: /(\n)(  }\/\/\ 💬 generate link to here)/gi,
      template: `,\n    {{ properCase name }}: '/{{lowerCase name}}'\n$2`,
    });
    actions.push({
      type: 'modify',
      path: '../src/utils/routerLinks.js',
      pattern: /(\n)(  }\/\/\ 💬 generate api to here)/gi,
      template: `,\n    {{ properCase name }}: '{{api}}'\n$2`,
    });

    actions.push({
      type: 'modify',
      path: '../src/utils/messages/index.js',
      pattern: /(\n)(}\/\/\ 💬 generate link to here)/gi,
      template: `\n  {{camelCase name}}: {\n    id: "routes.{{properCase name}}.title",\n    defaultMessage: '{{title}}',\n  },\n$2`,
    });
    actions.push({
      type: 'modify',
      path: '../src/translations/en.json',
      pattern: /(\n)(})/gi,
      template: `,\n  "routes.{{properCase name}}.title": "{{title}}"\n$2`,
    });
    actions.push({
      type: 'modify',
      path: '../src/translations/vi.json',
      pattern: /(\n)(})/gi,
      template: `,\n  "routes.{{properCase name}}.title": "{{title}}"\n$2`,
    });
    actions.push({
      type: 'modify',
      path: '../src/translations/ja.json',
      pattern: /(\n)(})/gi,
      template: `,\n  "routes.{{properCase name}}.title": "{{title}}"\n$2`,
    });

    if (answers.isGroup) {
      actions.push({
        type: 'modify',
        path: '../src/utils/routerLinks.js',
        pattern: /(\n)(  }\/\/\ 💬 generate api to here)/gi,
        template: `,\n    {{ properCase nameGroup }}: '{{apiGroup}}'\n$2`,
      });
      actions.push({
        type: 'modify',
        path: '../src/translations/en.json',
        pattern: /(\n)(})/gi,
        template: `,\n  "routes.{{properCase name}}.{{camelCase nameGroup}}": "{{nameGroup}}"\n$2`,
      });
      actions.push({
        type: 'modify',
        path: '../src/translations/vi.json',
        pattern: /(\n)(})/gi,
        template: `,\n  "routes.{{properCase name}}.{{camelCase nameGroup}}": "{{nameGroup}}"\n$2`,
      });
      actions.push({
        type: 'modify',
        path: '../src/translations/ja.json',
        pattern: /(\n)(})/gi,
        template: `,\n  "routes.{{properCase name}}.{{camelCase nameGroup}}": "{{nameGroup}}"\n$2`,
      });
    }



    if (answers.typeLink === "Admin") {
      actions.push({
        type: 'modify',
        path: '../src/routes/index.js',
        pattern: /(\/\/\ 💬 generate admin to here)/gi,
        template: `$1\n      {{properCase name}}(app),`,
      });
    } else {
      actions.push({
        type: 'modify',
        path: '../src/routes/index.js',
        pattern: /(\/\/\ 💬 generate frontend to here)/gi,
        template: `$1\n      {{properCase name}}(app),`,
      });
    }

    return actions;
  },
};
