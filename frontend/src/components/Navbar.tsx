import React, {useContext} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {logout} from "@/adapters/authAdapter.ts";
import CurrentUserContext from "@/context/current-user-context.ts";
import ThemeDropdown from "@/components/ThemeDropdown.tsx";


export default function Navbar() {
  const navigate = useNavigate();
  const { currentUser } = useContext(CurrentUserContext);

  return (
    <div className="navbar mr-auto">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl" onClick={() => navigate('/')}>Nimbus</a>
      </div>

      {/* Middle section, may want to recolor this list's li's later */}
      <div className="flex-1 justify-center navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <details>
              <summary>Community</summary>
              <ul className="p-2 min-w-[9rem]">
                <li><a>Rainy Days & Silver Linings</a></li>
                <li><a>Calm in the Storm</a></li>
                <li><a>Fluff Therapy</a></li>
                <li><a>Cloud Nine Creations</a></li>
                <li><a>Cumulus Care</a></li>
                <li><a>🌈 Rainbow</a></li>
              </ul>
            </details>
          </li>
        </ul>
      </div>

      {/* Mobile menu (visible on small screens) */}
      <div className="dropdown lg:hidden">
        <div tabIndex={0} role="button" className="btn btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h8m-8 6h16"
            />
          </svg>
        </div>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
        >
          <li>
            <a>Community</a>
            <ul className="p-2">
              <li><a>Rainy Days & Silver Linings</a></li>
              <li><a>Calm in the Storm</a></li>
              <li><a>Fluff Therapy</a></li>
              <li><a>Cloud Nine Creations</a></li>
              <li><a>Cumulus Care</a></li>
              <li><a>Rainbow</a></li>
            </ul>
          </li>
        </ul>
      </div>

      {/* Profile section */}
      <div className="flex-1 justify-end">
        {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="form-control">
                <input
                    type="text"
                    placeholder="Search"
                    className="input input-bordered w-24 md:w-auto"
                />
                <ThemeDropdown />
              </div>
              <div className="dropdown dropdown-end z-20">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img
                        alt="User avatar"
                        src={currentUser?.profilePicture}
                    />
                  </div>
                </label>
                <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                >
                  <li>
                    <Link
                        to="/profile"
                        className="justify-between text-[#646cff]"
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button
                        onClick={() => {
                          logout();
                          navigate('/login');
                        }}
                        className="w-full text-left bg-transparent text-[#646cff]"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
        ) : (
            <button
                onClick={() => navigate('/login')}
                className="btn bg-sky-200 hover:bg-sky-300 text-sky-800"
            >
              Login
            </button>
        )}
      </div>
    </div>
  )
}