import PageInfo from './PageInfo';
import config from '@/config';

/**
 * Universal paging assistant
 */
export default class　PageHelper {
  static create = () => {
    const pageInfo = new PageInfo();
    return pageInfo;
  }

  /**
   * You can format the parameters sent to the backend by setting this function
   * 
   * For example, the parameters required by the back-end paging interface are
   * {
   *    currentPage: 1, 
   *    showCount: 10, 
   *    paramMap: {name: 'jonn'}
   * }
   * The paging information can be formatted by setting this parameter
   * E.g:
   * pageHelper.requestFormat(({pageNum, pageSize}) => ({
   *  currentPage: pageNum,
   *  showCount: pageSize
   * }))
  */
  static requestFormat(pageInfo) {
    return config.pageHelper.requestFormat(pageInfo);
  };
   

  /**
   * Format the data returned from the server and place it in the PageInfo object,
   * Prepare for the next: page
   * Page number: pageNum;
     Quantity per page: pageSize;
     Current page number: size;
     Total: total;
     Yotal pages: totalPages;
     Result set: list;
   * @param {object} resp 
  */
  static responseFormat(resp) {
    return config.pageHelper.responseFormat(resp);
  }

  static URLToArray(url) {
    const _request = {};
    const _pairs = url.substring(url.indexOf('?') + 1).split('&');
    for (var i = 0; i < _pairs.length; i++) {
        if(!_pairs[i])
            continue;
        var _pair = _pairs[i].split('=');
        _request[decodeURIComponent(_pair[0])] = decodeURIComponent(_pair[1]);
    }
    return _request;
  }
}