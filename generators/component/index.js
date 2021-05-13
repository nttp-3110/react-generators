/**
 * Component Generator
 */

const componentExists = require('../utils/_componentExists');

module.exports = {
  description: 'Add a component',
  prompts: [
    {
      type: 'list',
      name: 'type',
      message: 'Select the base component type:',
      default: 'Stateless',
      choices: () => ['Stateless', 'Component'],
    },
    {
      type: 'input',
      name: 'name',
      message: 'What should it be called?',
      default: 'ComponentTest',
      validate: (value) => {
        if ((/.+/).test(value)) {
          return componentExists(value) ? 'A file with this name already exists' : true;
        }
        return 'The name is required';
      },
    },
  ],
  actions: (answers) => {
    // Generate index.js and index.test.js
    let actions;
    switch (answers.type) {
      default: {
        /*
         * Create a file basic structure component
         */
        actions = [{
          type: 'add',
          path: '../src/modules/{{properCase name}}/actions.js',
          templateFile: `./component/Default/actions.hbs`,
          abortOnFail: true,
        },
        {
          type: 'add',
          path: '../src/modules/{{properCase name}}/constants.js',
          templateFile: `./component/Default/constants.hbs`,
          abortOnFail: true,
        },
        {
          type: 'add',
          path: '../src/modules/{{properCase name}}/epics.js',
          templateFile: `./component/Default/epics.hbs`,
          abortOnFail: true,
        },
        {
          type: 'add',
          path: '../src/modules/{{properCase name}}/constantsRoute.js',
          templateFile: `./component/Default/constantsRoute.hbs`,
          abortOnFail: true,
        },
        {
          type: 'add',
          path: '../src/modules/{{properCase name}}/routes.js',
          templateFile: `./component/Default/routes.hbs`,
          abortOnFail: true,
        },
        {
          type: 'add',
          path: '../src/modules/{{properCase name}}/containers/index.js',
          templateFile: './component/Default/containers/index.hbs',
          abortOnFail: true,
        },
        {
          type: 'add',
          path: '../src/modules/{{properCase name}}/components/index.js',
          templateFile: './component/Default/components/index.hbs',
          abortOnFail: true,
        },
        {
          type: 'add',
          path: '../src/modules/{{properCase name}}/styles/styled.js',
          templateFile: './component/Default/styles/styled.js.hbs',
          abortOnFail: true,
        }];
      }
    }

    // actions.push({
    //   type: 'modify',
    //   path: '../src/translations/en.json',
    //   pattern: /(\n)(})/gi,
    //   template: `,\n  "components.{{lowerCase name}}.test": "{{properCase name}}"\n}`,
    // });

    // actions.push({
    //   type: 'modify',
    //   path: '../src/translations/vi.json',
    //   pattern: /(\n)(})/gi,
    //   template: `,\n  "components.{{lowerCase name}}.test": "{{properCase name}}"\n}`,
    // });

    return actions;
  },
};
