function numberWithCommas(x: number | string) {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
}

export default numberWithCommas;
