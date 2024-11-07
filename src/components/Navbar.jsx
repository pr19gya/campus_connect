import React from 'react';
import isLoggedIn from './utlis/isLoggedIn';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const handleLogOut = async () => {
        localStorage.removeItem('Token');
        localStorage.removeItem('Email');
    };

    return (
        <div>
            {!isLoggedIn() ? (
                <Link to="/Login"><button>LOGIN</button></Link>
            ) : (
                <div>
                <button onClick={handleLogOut}>LOGOUT</button>
                <Link to="/Profile"><button>Profile</button></Link>
                <Link to = "/Mentorship"><button>Mentorship Sessions</button></Link>
                </div>
            )}
        </div>
    );
};

export default Navbar;
