import React from 'react';
import PageLoading from 'components/Loading/PageLoading';
import { antdNotice } from 'components/Notification';

// System notification, define what style of notification to use, normal or antdNotice
const notice = antdNotice;

/**
 * Application configuration such as request format, return format, exception handling method, paging format, etc.
 */
export default {
  /**
   * HTML title template
   */
  htmlTitle: 'Admin - {title}',
  title: "Admin",

  /**
   * System notification
   */
  notice,

  // Global exception
  exception: {
    global: (err, dispatch) => {
      const errName = err.name;
      // RequestError is to intercept the request exception
      if (errName === 'RequestError') {
        notice.error(err.message);
        console.error(err);
      } else {
        console.error(err);
      }
    },
  },

  // Paging assistant
  pageHelper: {
    // Format the data to be sent to the backend
    requestFormat: pageInfo => {
      const { pageNum, pageSize, filters, sorts } = pageInfo;
      return {
        page: pageNum,
        per_page: pageSize,
        sorts,
        filters
      };
    },

    // Format the data returned from the backend
    responseFormat: resp => {
      const {
        current_page,
        per_page,
        total,
        data,
        last_page
      } = resp;
      return {
        pageNum: current_page,
        pageSize: parseInt(per_page),
        total,
        totalPages: last_page,
        list: data
      };
    }
  },

  // Route loading effect
  router: {
    loading: <PageLoading loading />
  },

  /**
   * Pack back data when simulating data
   * Because, when the back-end data is returned, it will generally wrap a layer of status information outside
   * If successful:
   * {
   *   status: true,
   *   data: responseData
   * }
   * Or when an error occurs:
   * {
   *   status: false,
   *   code: 500,
   *   message: 'wrong user name or password'
   * }
   * Here is the configuration of these two functions, so that we can write a few lines of code orz ...
   */
  mock: {
    toSuccess: response => ({
      status: true,
      data: response
    }),

    toError: message => ({
      status: false,
      message: message
    })
  },
  store: {
    language: "d*mWtN6Gr5b?=_tS+z%jUp#yx%F?H5$gzcH^Qxb?#!xN4",
    user: "^6C!fzp@2Dm#5-sqPSB3?RWW%=zUdPEaX6eers+vQ4_F_",
    theme: "fv9Sj-9fXmgdYU3+hJJ?PGCRUd+h!tNcJW838DK!7-VZA",
  }
};
