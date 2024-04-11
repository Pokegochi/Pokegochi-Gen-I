import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { NFT_LOADED } from "../actions/types";

const NFTSelection = ({ auth }) => {
    const [nfts, setNfts] = useState([]);
    const [flag, setFlag] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        let elements = document.querySelector('canvas');
        if (elements !== null) elements.remove();
    }, [])

    useEffect(() => {
        if (auth.user && auth.user.nft) {
            setNfts(auth.user.nft)
            setFlag(f=>!f)
        }
    }, [auth])

    const onSelectNFT = (index) => {
        dispatch({
            type: NFT_LOADED, 
            payload: index
        })
        navigate("/selectcharacter")
    }

    if (auth.isAuthenticated === false) {
        return <Navigate to="/signup" />
    }
    else if (auth.isAuthenticated === undefined) {
        return <>Loading</>
    }
    return (<>
        <div id="score-board" className="w-3/4 md:w-2/3 lg:w-1/2 mx-auto py-5 md:pt-20">
            <div className="rounded-[50px] bg-[#91bc74] p-10">
                <div id="score-title" className="text-center text-[20px] md:text-[24px] sm:text-[50px] text-orange-300 my-5">
                    Select NFT for your game
                </div>
            </div>
        </div>
        <div className="flex flex-row w-[900px] rounded-lg bg-[#91bc74] p-2 md:py-10 md:px-5 mx-auto overflow-auto gap-5">
            {
              nfts.map((nft, index) => {
                return <div key={index} className="hover:scale-[110%] hover:cursor-pointer character w-[200px] shrink-0 flex flex-col gap-5" onClick={() => onSelectNFT(index)}>
                    <img src={nft.image_uri} width={200} height={200} alt="character" />
                    <p className="text-white text-center">
                        {nft.name}
                    </p>
                </div>
              })
            }
        </div>
    </>);
}
const mapStateToProps = (state) => ({
    auth: state.auth, 
    user: state.user, 
});
export default connect(mapStateToProps, null)(NFTSelection);