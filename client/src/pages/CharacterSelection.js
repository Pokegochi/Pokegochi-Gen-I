import { useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";

const CharacterSelection = ({ auth }) => {
    useEffect(() => {
        let elements = document.querySelector('canvas');
        if (elements !== null) elements.remove();
    }, [])

    if (auth.isAuthenticated === false) {
        return <Navigate to="/signup" />
    }
    else if (auth.isAuthenticated === undefined) {
        return <>Loading</>
    }
    return (<>
        <div id="score-board" className="w-3/4 md:w-2/3 lg:w-1/2 mx-auto py-5 md:pt-20">
            <div className="rounded-[50px] bg-[#91bc74] p-10">
                <div id="score-title" className="text-center text-[24px] md:text-[32px] sm:text-[50px] text-orange-300 my-5">
                    Select Pokegochi
                </div>
            </div>

        </div>
        <div className="flex flex-row w-[900px] rounded-lg bg-[#91bc74] p-2 md:p-10 mx-auto overflow-auto gap-5">
            <div className="hover:scale-[130%] hover:cursor-pointer character w-[200px] shrink-0">
                <Link to="/game">
                    <img alt="cha1" src={require('../assets/characters/1.png').default} width={200} height={200} />
                </Link>
            </div>
            <div className="hover:scale-[130%] hover:cursor-pointer character w-[200px] shrink-0">
                <Link to="/game">
                    <img alt="cha1" src={require('../assets/characters/2.png').default} width={200} height={200} />
                </Link>
            </div>
            <div className="hover:scale-[130%] hover:cursor-pointer character w-[200px] shrink-0">
                <Link to="/game">
                    <img alt="cha1" src={require('../assets/characters/3.png').default} width={200} height={200} />
                </Link>
            </div>
            <div className="hover:scale-[130%] hover:cursor-pointer character w-[200px] shrink-0">
                <Link to="/game">
                    <img alt="cha1" src={require('../assets/characters/4.png').default} width={200} height={200} />
                </Link>
            </div>
            <div className="hover:scale-[130%] hover:cursor-pointer character w-[200px] shrink-0">
                <Link to="/game">
                    <img alt="cha1" src={require('../assets/characters/5.png').default} width={200} height={200} />
                </Link>
            </div>
            <div className="hover:scale-[130%] hover:cursor-pointer character w-[200px] shrink-0">
                <Link to="/game">
                    <img alt="cha1" src={require('../assets/characters/6.png').default} width={200} height={200} />
                </Link>
            </div>
            <div className="hover:scale-[130%] hover:cursor-pointer character w-[200px] shrink-0">
                <Link to="/game">
                    <img alt="cha1" src={require('../assets/characters/7.png').default} width={200} height={200} />
                </Link>
            </div>
            <div className="hover:scale-[130%] hover:cursor-pointer character w-[200px] shrink-0">
                <Link to="/game">
                    <img alt="cha1" src={require('../assets/characters/8.png').default} width={200} height={200} />
                </Link>
            </div>
            <div className="hover:scale-[130%] hover:cursor-pointer character w-[200px] shrink-0">
                <Link to="/game">
                    <img alt="cha1" src={require('../assets/characters/9.png').default} width={200} height={200} />
                </Link>
            </div>
            <div className="hover:scale-[130%] hover:cursor-pointer character w-[200px] shrink-0">
                <Link to="/game">
                    <img alt="cha1" src={require('../assets/characters/10.png').default} width={200} height={200} />
                </Link>
            </div>
        </div>
    </>);
}
const mapStateToProps = (state) => ({
    auth: state.auth,
    alerts: state.alert,
});
export default connect(mapStateToProps, null)(CharacterSelection);