const isLoggedIn = () => {
  return !!localStorage.getItem('Token');
};
export default isLoggedIn