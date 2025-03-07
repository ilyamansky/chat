{
  /*export const getTotalFilters = (filters) => {
  return Object.values(filters).reduce(
    (acc, curr) => acc + (curr?.length || 0),
    0
  );
};
*/
}

export const getTotalFilters = (filters) => {
  return (
    (filters.clients?.length || 0) +
    (filters.vacancies?.length || 0) +
    (filters.recruiters?.length || 0)
  );
};
