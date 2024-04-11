import { connect } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { logout } from "../actions/user";
import { useRef, useEffect } from "react";

const { Outlet, Link } = require("react-router-dom");
const Layout = ({ auth, alert, logout }) => {

  const aud = useRef();
  useEffect(() => {
    aud.current.setAttribute("autoplay", "");
  }, [])
  return (
    <>
      <div className="relative h-[100vh]">
        <nav className="border-gray-200 px-2 sm:px-4 rounded bg-[#346c54e5]">
          <div className="container flex flex-wrap justify-between items-center mx-auto">
            <Link to="/" className="flex items-center">
              <img
                src={require("../assets/PokegochiLogo.png").default}
                className="mr-3 h-6 sm:h-9"
                alt="Flowbite Logo"
              />
              <span className="self-center text-xl font-semibold whitespace-nowrap text-[#c8fbe1]">
                Pokegochi
              </span>
            </Link>
            <button
              data-collapse-toggle="navbar-default"
              type="button"
              className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              aria-controls="navbar-default"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
            <div
              className="hidden w-full md:block md:w-auto"
              id="navbar-default"
            >
              <ul className="flex flex-col p-4 mt-4 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0">
                <li>
                  <Link
                    to="/"
                    className="block py-2 pr-4 pl-3 text-white rounded md:border-0 md:hover:text-gray-400 md:p-0"
                    aria-current="page"
                  >
                    Home
                  </Link>
                </li>
                {auth.isAuthenticated === true ? (
                  <li>
                    <Link
                      to="/signup"
                      className="block py-2 pr-4 pl-3 text-white rounded md:border-0 md:hover:text-gray-400 md:p-0"
                      onClick={() => {
                        logout();
                      }}
                    >
                      Log Out
                    </Link>
                  </li>
                ) : (
                  <li>
                    <Link
                      to="/signup"
                      className="block py-2 pr-4 pl-3 text-white rounded md:border-0 md:hover:text-gray-400 md:p-0"
                    >
                      Sign Up / In
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <audio ref={aud} autoPlay={true} src={'assets/audio/IntroMusic.mpeg'}></audio>
        </nav>
        {/* <div className="relative "> */}

        <div className="m-background"><Outlet /></div>
        {/* </div> */}
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

    </>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  alert: state.alert,
});
export default connect(mapStateToProps, { logout })(Layout);
