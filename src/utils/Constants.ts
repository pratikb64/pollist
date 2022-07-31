const CONSTANTS = {
  BASE_URL:
    process.env.NODE_ENV === 'production'
      ? 'https://pollist.pratikbadhe.com/api'
      : 'http://localhost:3000/api',
};

export default CONSTANTS;
