import { connectWallet } from "../utils/wallet";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { loadUser, logIn, signUp } from "../actions/user";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";

const Sign = ({ loadUser, logIn, signUp, auth, alerts }) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [username, setUserName] = useState("");

  useEffect(() => {
    const inter = setInterval(() => {
    }, 150);
    return () => {
      clearInterval(inter);
    };
  }, []);
  useEffect(() => {
    alerts.forEach((element) => {
      toast.error(element.msg, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    });
  }, [alerts]);
  const signIn = async () => {
    if (walletAddress === "") {
      const address = await connectWallet();
      logIn(address);
    } else {
      logIn(walletAddress);
    }
  };
  const createAccount = async () => {
    if (username === "" || username === "")
      toast.error("Input your username", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    else if (walletAddress === null) {
      toast.error("Connect your wallet", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else {
      await signUp(walletAddress, username);
    }
  };

  if (auth.isAuthenticated === true) return <Navigate to="/selectnft" />;
  return (
    <>
      <div className="w-full m-section flex items-center sm:justify-evenly">
        <div className="container px-5 py-5 rounded-lg bg-gray-800 sm:px-10 sm:w-[500px] w-[300px] m-auto">
          <div className="flex justify-evenly items-center">
            <div className="text-gray-300 text-xl h-[300px] ">
              <img
                alt="pokegochi-logo"
                src={require("../assets/PokegochiLogo.png").default}
                className="h-full m-auto"
              ></img>
            </div>
          </div>
          <div className="mt-5">
            <div className="mb-5">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-[#94cd84]"
              >
                USERNAME
              </label>
              <input
                type="text"
                name="name"
                id="emnameail"
                className="bg-gray-800 border border-gray-300 text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                value={username}
                onChange={(e) => {
                  if (e.target.value.length <= 3) {
                    setUserName(e.target.value.toUpperCase());
                  }
                }}
                placeholder="Input your username (ONLY 3 LETTERS)"
              />
            </div>
            <div className="">
              <label
                htmlFor="address"
                className="block mb-2 text-sm font-medium text-gray-300"
              >
                WALLET ADDRESS {
                  walletAddress &&
                  walletAddress[0] + walletAddress[1] + walletAddress[2] + walletAddress[3] + '...' + walletAddress[walletAddress.length - 4] + walletAddress[walletAddress.length - 3] + walletAddress[walletAddress.length - 2] + walletAddress[walletAddress.length - 1]
                }
              </label>
              <button
                type="button"
                className="w-full focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
                onClick={async () => {
                  try {
                    const address = await connectWallet();
                    setWalletAddress(address);
                  } catch (err) {
                    alert(err);
                  }
                }}
              >
                Connect Wallet
              </button>
              <button
                type="button"
                className="w-full focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
                onClick={createAccount}
              >
                Create Account
              </button>
            </div>
            <div className="text-white flex flex-row text-xs mt-5">
              <div className="text-[#ff9200]">Already have an account?</div>
              <div
                className="mx-2 hover:font-bold hover:cursor-pointer underline"
                onClick={signIn}
              >
                Sign In
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  alerts: state.alert,
});
export default connect(mapStateToProps, { logIn, loadUser, signUp })(Sign);
