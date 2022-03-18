export const client = {
  baseURL: `${SERVER_DOMAIN}/api`,
  config: {
    mode: "cors",
    cache: "no-cache",
  },
  makeURL(url) {
    return `${this.baseURL}${url.at(0) !== '/' ? '/' : ''}${url}`;
  },
  makeQueryParams(query = {}) {
    const params = Object.entries(query)
      .map(([key, value]) => `${key.toString()}=${value.toString()}`)
      .join("&");

    return params.length > 0 ? `?${params}` : '';
  },
  async responseWrapper(asyncRequest = async (timestamp) => {}, url, config) {
    let response;
    let result = {};
    result.url = url;
    result.config = config;

    try {
      response = await asyncRequest(Date.now());

      if (!response.ok) {
        throw new Error(response.status + ' ' + response.statusText);
      }

      if (response.headers['Content-Type'] === 'application/json') {
        result.data = await response.json();
      } else if (response.headers['Content-Type'] === 'multipart/form-data') {
        result.data = await response.formData();
      } else if (['text/plain', 'text/html', 'text/javascript', 'application/javascript', 'text/css', 'text/xml', 'text/php', 'text/cmd', 'text/csv', 'text/markdown']
        .includes(response.headers['Content-Type'])) {
        result.data = await response.text();
      }
    } catch (error) {
      console.error(error);
      HTML_Container.innerHTML= 'Что то пошло не так 🤷‍♂️';
    } finally {
      result.statusCode = response?.status ?? '000';
      result.status = response?.statusText ?? 'Failed to fetch';
      result.headers = response?.headers ?? {};

      return result;
    }
  },
  async request(url, config) {
    return this.responseWrapper(
      async (timestamp) => {
        return await fetch(this.makeURL(url), {
          ...this.config,
          ...config,
        });
      },
      url,
      config,
    );
  },
  async get(url = "", query = {}, config = {}) {
    return this.responseWrapper(
      async (timestamp) => {
        return await fetch(`${this.makeURL(url)}${this.makeQueryParams(query)}`, {
          ...this.config,
          ...config,
          method: "GET",
        });
      },
      url,
      config,
    );
  },
  async post(url = "", body = {}, config = {}) {
    return this.responseWrapper(
      async (timestamp) => {
        await fetch(this.makeURL(url), {
          ...this.config,
          ...config,
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
      },
      url,
      config,
    );
  },
};
