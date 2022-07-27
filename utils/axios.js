// const axios = require('axios').default
// const { read, write } = require("./FS");

// const axiosFetch = (url, dir) => {
//     const repositories = read(dir)
//     return axios.get(url)
//         .then(res => {
//             console.log(res.data);
//             if (res.data.length) repositories.push(...res.data)
//             if (!res.data.length) repositories.push(res.data)
//             write(dir, repositories)
//         }
//     )
// }

// module.exports = { axiosFetch }