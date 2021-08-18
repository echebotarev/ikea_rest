module.exports = (req) => {
  const { domaDomaShopId, ikeaShopId } = req.cookies;
  if (!domaDomaShopId || !ikeaShopId) {
    return req.query;
  }

  return { domaDomaShopId, ikeaShopId };
};
