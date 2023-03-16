export const calculateTotalPage = ({
  totalCount,
  limit = 10,
}: {
  totalCount: number;
  limit?: number;
}) => {
  const wholePart = parseInt((totalCount / limit).toString());
  const fractionalPart = totalCount % limit;
  return fractionalPart === 0 ? wholePart : wholePart + 1;
};
