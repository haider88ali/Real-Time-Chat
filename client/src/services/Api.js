import axios from 'axios';
const Api = (url, method, formdata,query,params={}) => {
  const baseUrls = process.env.REACT_APP_MY_ENV_VARIABLE;
  console.log(url, method, formdata,query);
  // axios.interceptors.response.use(
  //   response => {
  //    if(response.data.data)
  //    {
  //     localStorage.setItem("token",response.data.token);
  //    }
  //   },
  // )
  const formData = new FormData();
  Object.entries(formdata).forEach(([key, value]) => {
    formData.append(key, value);
  });
  const options = {
    url: `${baseUrls}/${url}?query=${query}`,
    method: method,
    params: params,
    withCredentials: false,
    headers: {
      'Content-Type': 'multipart/form-data',
      "Access-Control-Allow-Origin": "*"
    },
    data: Object.assign({}, formdata),

  };

  return new Promise((resolve, reject) => {
    axios(options).then((res) => {
      resolve(res);
    })
      .catch((error) => {

      });
  });
};
export default Api;