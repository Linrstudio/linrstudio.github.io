/*
    filter out Chinese chars:
    。  \u3002
    ，  \uff0c
    、  \u3001
    ？  \uff1f
    ！  \uff01
*/
export const pureWords = (sentense = '') => {
  const regex = /[\u3002|\uff0c|\u3001|\uff1f|\uff01]/gi;
  return sentense.replace(regex, ' ');
};

export const insertFont = (data) => {
  const style = document.createElement('style');
  style.textContent = data;
  document.head.appendChild(style);
};

export const fetchAndSetFont = async (fontName) => {
  const WEB_FONT_URL = `https://romantic-bell-b49acd.netlify.app/${fontName}.woff.json`;

  return new Promise((resolve, reject) => {
    axios
      .get(WEB_FONT_URL, { crossdomain: true })
      .then((res) => {
        insertFont(res.data.value);
        storager.set({ fonts: res.data });
        return resolve(res.data);
      })
      .catch((error) => {
        return reject(error);
      });
  });
};
