import $$ from 'cmn-utils';
/**
 * Paging object
 */
export default class PageInfo {
  // Page number, starting from 1
  pageNum = 1;

  // Quantity per page
  pageSize = 10;

  // Current page number
  size = 0;

  // Total
  total = 0;

  // Total pages
  totalPages = 0;

  // Result set
  list = [];

  // Filter {name: 'jonn'}
  filters = {};

  // Sort condition {name: 'asc', age: 'desc'}
  sorts = {};

  /**
   * It is hoped that the number of pages entered by the user is not within the legal range (outside the first page to the last page)
   * Can correctly respond to the correct result page, then you can configure reasonable to true,
   * At this time, if pageNum <1, the first page will be queried, if pageNum> the total number of pages, the last page will be queried
   */
  reasonable = false;

  /**
   * Assembly page information
   * @param data
   */
  setPage(data) {
    for (const key in data) {
      switch(key) {
        case "pageNum":
        case "pageSize":
          this[key] = parseInt(data[key]);
        break;
        case "filters":
        case "sorts":
          this[key] = typeof data[key] === "string" ? JSON.parse(data[key]) : data[key];
        break;
        default:
          this[key] = data[key]
      }
    }
    return this;
  }

  /**
   * Assembly paging information
   * @param {number} pageNum page number
   * @param {number} pageSize page size
   */
  jumpPage(pageNum, pageSize) {
    if ((pageNum && pageNum <= Math.ceil(this.totalPages)) || pageNum === 1) {
      this.pageNum = pageNum;
      if (pageSize) this.pageSize = pageSize;
    }
    return this;
  }

  /**
   * Splice filter
   * @param {object} q Filter {name: 'jonn', sex: 1}
   * @param {boolean} merge Whether to merge the new condition with the existing condition
   */
  filter(q, merge) {
    if ($$.isObject(q)) {
      if (merge) {
        this.filters = {...this.filters, ...q};
      } else {
        this.filters = q;
      }
    }
    return this;
  }

  /**
   * Splicing sort condition
   * @param {object} q Sort field {name: 'asc', age: 'desc'}
   */
  sortBy(q) {
    if ($$.isObject(q)) {
      this.sorts = q;
    }
    return this;
  }

  /**
   * Next page or specified number of pages
   * @param {number} pageNum
   */
  nextPage(pageNum) {
    if (this.totalPages !== -1) {
      if (pageNum && pageNum <= Math.ceil(this.totalPages)) {
        this.pageNum = pageNum;
      } else if (this.pageNum + 1 <= Math.ceil(this.totalPages)) {
        this.pageNum ++;
      }
    } else {
      this.pageNum = this.totalPages;
    }
    return this;
  }

  /**
   * Previous
   */
  prevPage() {
    if (this.totalPages !== -1) {
      if (this.pageNum - 1 > 0) {
        this.pageNum --;
      }
    } else {
      this.pageNum = 1;
    }
    return this;
  }

  toParams(data) {
    // this.setPage(data)
    return `?pageNum=${data.pageNum}&pageSize=${data.pageSize}&filters=${JSON.stringify(data.filters)}&sorts=${JSON.stringify(data.sorts)}`
  }

  // deprecate
  // async send(url, options) {
  //   const self = this;
  //   const { pageNum, pageSize, filters, sorts } = this;
  //   let payload = { pageNum, pageSize, filters, sorts };

  //   if ($$.isFunction(PageHelper.requestFormat)) {
  //     payload = PageHelper.requestFormat(this);
  //   }
  //   const { data } = await axios.post(url, { ...payload, ...options });
  //   if ($$.isFunction(PageHelper.responseFormat)) {
  //     const newPageInfo = PageHelper.responseFormat(data);
  //     return Object.assign(self, newPageInfo);
  //   } else {
  //     return data;
  //   }
  // }
}
