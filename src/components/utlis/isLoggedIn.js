const isLoggedIn = () =>{
  const token = localStorage.getItem('Token');
  return !!token;
}
export default isLoggedIn