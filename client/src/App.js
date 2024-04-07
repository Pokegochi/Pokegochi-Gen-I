import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
//
import Layout from "./pages/Layout";

import Sign from "./pages/Sign";
//redux
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/user";
import setAuthToken from "./utils/setAuthToken";
import { LOGOUT } from "./actions/types";
import NftProvider from "./context/nft/provider";
import LoadingProvider from "./context/loading/provider";

// game

import Main from "./pages/game/Main";
import Scoreboard from "./pages/Scoreboard";
import CharacterSelection from "./pages/CharacterSelection";
import NFTSelection from "./pages/NftSelection";

function App() {
  useEffect(() => {
    // check for token in LS when app first runs
    if (localStorage.token) {
      // if there is a token set axios headers for all requests
      setAuthToken(localStorage.token);
      // connectWallet();
    }
    // try to fetch a user, if no token or invalid token we
    // will get a 401 response from our API
    store.dispatch(loadUser());

    // log user out from all tabs if they log out in one tab
    window.addEventListener("storage", () => {
      if (!localStorage.token) store.dispatch({ type: LOGOUT });
    });
  }, []);
  return (
    <Provider store={store}>
      <NftProvider>
        <LoadingProvider>
          <BrowserRouter>
            <Routes>
              <Route exact path="/" element={<Layout />}>
                <Route exact index element={<NFTSelection />} />
                <Route exact path="signup" element={<Sign />} />
                <Route exact path="scoreboard" element={<Scoreboard />} />
                <Route
                  exact
                  index
                  path="selectcharacter"
                  element={<CharacterSelection />}
                />
                <Route
                  exact
                  index
                  path="selectnft"
                  element={<NFTSelection />}
                />
              </Route>
              <Route exact path="game" element={<Main />} />
            </Routes>
          </BrowserRouter>
        </LoadingProvider>
      </NftProvider>
    </Provider>
  );
}

export default App;
