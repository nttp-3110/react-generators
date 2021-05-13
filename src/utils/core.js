import React from 'react';
import { dynamic, router } from 'dva';
import $$ from 'cmn-utils';
import intl from "react-intl-universal";
import config from '@/config';
import messages from './messages';

const { Route, Switch, Redirect } = router;

/**
 * Generate dynamic components
 * @param {*} app
 * @param {*} models
 * @param {*} component
 */
export const dynamicWrapper = (app, models, component) =>
  dynamic({
    app,
    models: () => models,
    component
  });

/**
 * Generate a set of routes
 * @param {*} app
 * @param {*} routesConfig
 */
export const createRoutes = (app, routesConfig) => {
  const routes = routesConfig(app)
    .map(config => createRoute(app, () => config))
    .reduce((p, n) => {
      if (n.length) {
        return [...p, ...n];
      } else {
        return p.concat(n);
      }
    }, []);
  return <Switch>{routes}</Switch>;
};
// Route map
window.dva_router_pathMap = {};
/**
 * Generate a single route
 * @param {*} app
 * @param {*} routesConfig
 */
export const createRoute = (app, routesConfig) => {
  const {
    component: Comp,
    path,
    indexRoute,
    title,
    exact,
    ...otherProps
  } = routesConfig(app);

  if (path && path !== '/') {
    window.dva_router_pathMap[path] = { path, title, ...otherProps };
    // Add parentPath to child route
    if (otherProps.childRoutes && otherProps.childRoutes.length) {
      otherProps.childRoutes.forEach(item => {
        if (window.dva_router_pathMap[item.key]) {
          window.dva_router_pathMap[item.key].parentPath = path;
        }
      });
    }
  }

  // Put Redirect first
  if (indexRoute && $$.isArray(otherProps.childRoutes)) {
    otherProps.childRoutes.unshift(
      <Redirect key={path + '_redirect'} exact from={path} to={indexRoute} />
    );
  }

  const routeProps = {
    key: path || $$.randomStr(4),
    render: props => {
      // Here you can do routing authority judgment
      setDocumentTitle(intl.formatMessage(messages[title]));
      return <Comp routerData={otherProps} {...props} />
    }
  };

  return <Route path={path} exact={!!exact} {...routeProps} />;
};

/**
 * Set page title
 * @param {*} title
 */
function setDocumentTitle(title) {
  const documentTitle = config.htmlTitle ? config.htmlTitle.replace(/{.*}/gi, title) : title
  if (documentTitle !== document.title) {
    document.title = documentTitle;
  }
}

export const slugify = (text) => {
  text = text.toString().toLowerCase().trim();
  const sets = [
    {to: 'a', from: '[ÀÁÂÃÄÅÆĀĂĄẠẢẤẦẨẪẬẮẰẲẴẶἀ]'},
    {to: 'c', from: '[ÇĆĈČ]'},
    {to: 'd', from: '[ÐĎĐÞ]'},
    {to: 'e', from: '[ÈÉÊËĒĔĖĘĚẸẺẼẾỀỂỄỆ]'},
    {to: 'g', from: '[ĜĞĢǴ]'},
    {to: 'h', from: '[ĤḦ]'},
    {to: 'i', from: '[ÌÍÎÏĨĪĮİỈỊ]'},
    {to: 'j', from: '[Ĵ]'},
    {to: 'ij', from: '[Ĳ]'},
    {to: 'k', from: '[Ķ]'},
    {to: 'l', from: '[ĹĻĽŁ]'},
    {to: 'm', from: '[Ḿ]'},
    {to: 'n', from: '[ÑŃŅŇ]'},
    {to: 'o', from: '[ÒÓÔÕÖØŌŎŐỌỎỐỒỔỖỘỚỜỞỠỢǪǬƠ]'},
    {to: 'oe', from: '[Œ]'},
    {to: 'p', from: '[ṕ]'},
    {to: 'r', from: '[ŔŖŘ]'},
    {to: 's', from: '[ßŚŜŞŠȘ]'},
    {to: 't', from: '[ŢŤ]'},
    {to: 'u', from: '[ÙÚÛÜŨŪŬŮŰŲỤỦỨỪỬỮỰƯ]'},
    {to: 'w', from: '[ẂŴẀẄ]'},
    {to: 'x', from: '[ẍ]'},
    {to: 'y', from: '[ÝŶŸỲỴỶỸ]'},
    {to: 'z', from: '[ŹŻŽ]'},
    {to: '-', from: '[·/_,:;\']'}
  ];
  sets.forEach(set => {
    text = text.replace(new RegExp(set.from,'gi'), set.to)
  });

  return text
    .replace(/\s+/g, '-')    // Replace spaces with -
    .replace(/[^-a-zа-я\u0370-\u03ff\u1f00-\u1fff]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-')    // Replace multiple - with single -
    .replace(/^-+/, '')      // Trim - from start of text
    .replace(/-+$/, '')      // Trim - from end of text
}

export const formatTreeSelect = (array) => {
  return array.map(item => {
    const children = (item.children && item.children.length) ? formatTreeSelect(item.children) : null;
    return { value: item.id, title: item.name, selectable: !(item.children && item.children.length), children }
  })
}

export const convertToFiltersTable = (array) => {
  const _temp = [];
  const loop = (array) => {
    for (let i = 0; i < array.length; i++) {
      _temp.push({ code: array[i].id, codeName: array[i].name })
      if (array[i].children && array[i].children.length > 0) {
        loop(array[i].children);
      }
    }
  }
  loop(array);
  return _temp;
}
