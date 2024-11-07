import React from 'react';
import { Link } from 'react-router-dom';
import isLoggedIn from './utlis/isLoggedIn';

const Navbar = () => {
    return (
        <div>
            {!isLoggedIn() ? (
                <div className="flex justify-end p-4">
                    <Link to="/Login">
                        <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300">
                            LOGIN
                        </button>
                    </Link>
                </div>
            ) : (
                <nav className="w-full bg-white shadow-lg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Logo/Brand - Left */}
                            <div className="flex-shrink-0">
                                <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition duration-300">
                                    Campus Connect
                                </Link>
                            </div>

                            {/* Navigation Links - Center */}
                            <div className="flex-1 flex justify-center items-center space-x-12">
                                <Link
                                    to="/"
                                    className="px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:text-blue-600 hover:bg-gray-50 transition duration-300"
                                >
                                    Questions
                                </Link>
                                <Link
                                    to="/Create"
                                    className="px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:text-blue-600 hover:bg-gray-50 transition duration-300"
                                >
                                    Ask your Question
                                </Link>
                                <Link
                                    to="/Mentorship"
                                    className="px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:text-blue-600 hover:bg-gray-50 transition duration-300"
                                >
                                    Mentorship
                                </Link>
                                <Link
                                    to="/CreateSession"
                                    className="px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:text-blue-600 hover:bg-gray-50 transition duration-300"
                                >
                                    Create Session
                                </Link>
                            </div>

                            {/* Profile and Logout - Right */}
                            <div className="flex items-center space-x-6">
                                <Link to="/Profile">
                                    <div className="w-10 h-10 rounded-full border-4 border-blue-500 bg-gray-200 flex items-center justify-center text-sm text-blue-500">
                                        {/* Optionally, add user initials here */}
                                        <span>A</span>
                                    </div>
                                </Link>
                                <button
                                    onClick={() => { localStorage.removeItem('Token'); localStorage.removeItem('Email'); }}
                                    className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-300"
                                >
                                    LOGOUT
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
            )}
        </div>
    );
};

export default Navbar;
