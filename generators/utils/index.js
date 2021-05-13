export const objectToParams = data => {
  const object = { ...data };
  if (object) {
    return Object.keys(object)
      .map(i => {
        if (typeof object[i] === 'object') {
          return `${i}=${JSON.stringify(encodeURIComponent(object[i]))}`;
        }
        if (object[i]) {
          return `${i}=${encodeURIComponent(object[i])}`;
        }

        return `${i}=`;
      })
      .join('&');
  }
  return '';
};