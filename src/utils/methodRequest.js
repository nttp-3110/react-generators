import axios from "axios";
import config from '@/config';

export const handGetParent = async (url, key) => {
  const { data } = await axios.get(url);
  const findChildren = (data, children) => {
    if (data.children && data.children.length > 0) {
      for (let i = 0; i < data.children.length; i++) {
        if (data.id === children['parent_id']) {
          data.children.push(children)
          return data.children;
        } else data.children[i].children = findChildren(data.children[i], children);
      }
      return data.children;
    } else if (data.id === children['parent_id']) return [children];
  }
  const newData = []
  for (let i = 0; i < data[key].length; i++) {
    if (!data[key][i]['parent_id'] || data[key][i]['parent_id'] === null) {
      data[key][i].children = [];
      newData.push(data[key][i]);
    } else {
      newData[newData.length - 1].children = findChildren(newData[newData.length - 1], data[key][i]);
    }
  }
  data[key] = newData
  return data;
}

export const handPostParent = async (url, payload) => {
  const { value, data: oldData, permissions } = payload;
  const request = [];
  const loop = async (array) => {
    for (let i = 0; i < array.length; i++) {
      if (array[i].children && array[i].children.length > 0) {
        array[i].children = await loop(array[i].children);
      }
      if (value && value.id === array[i].id) {
        const method = value.id > 0 ? 'put' : 'post';
        if (permissions[method]) {
          const {data} = await axios[method](url + (method === 'put' ? value.id : ''), value);
          if (data.message) config.notice.success(data.message);
          array[i] = data.data;
        }
      } else if (!value) {
        let dataRequest = {...array[i]};
        delete dataRequest.children;
        request.push(dataRequest)
      }
    }
    return array;
  }
  const newData = await loop(oldData);
  if (request.length > 0){
    const {data} = await axios.put(url + "all", request);
    if (data.message) config.notice.success(data.message);
  }
  return newData
}
