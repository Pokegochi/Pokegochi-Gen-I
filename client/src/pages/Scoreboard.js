import { useState, useEffect } from "react";
import api from "../utils/api";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
const Scoreboard = ({ auth }) => {

    const [users, setUsers] = useState([])
    const fetchScoreData = async () => {
        const res = await api.get('/users/all');
        console.log(res.data);
        setUsers(res.data);
    }
    useEffect(() => {
        fetchScoreData();
    }, [])

    if (auth.isAuthenticated === false) {
        return <Navigate to="/signup" />
    }
    else if (auth.isAuthenticated === undefined) {
        return <>Loading</>
    }
    return (<>

        <div id="score-board" className="w-3/4 md:w-2/3 lg:w-1/2 m-auto py-20 h-4/5">
            <div className="rounded-[50px] bg-[#91bc74] p-10 overflow-y-scroll h-full">
                <div id="score-title" className=" text-center text-[32px] md:text-[40px] sm:text-[50px] text-orange-300 my-5">
                    Score Board
                </div>

                <div>
                    <table className="w-full text-center">
                        <thead className="sm:text-[26px] text-[16px] text-[#b5eeff] border-b">
                            <tr>
                                <th >Rank</th>
                                <th >Name</th>
                                <th >Score</th>
                            </tr>
                        </thead>
                        <tbody className="text-[22px] text-gray-400 sm:text-[36px] md:text-[40px] lg:text-[48px]">
                            {
                                users.slice(0, users.length > 20 ? 20 : users.length).map((user, index) => {

                                    return <tr key={index} className={index === 0 ? "text-[#dfff00]" : ""}
                                    >
                                        <td>{index + 1}</td>
                                        <td>{user.name}</td>
                                        <td>{user.earn}</td>
                                    </tr>
                                })
                            }

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </>);
}
const mapStateToProps = (state) => ({
    auth: state.auth,
    alerts: state.alert,
});
export default connect(mapStateToProps, null)(Scoreboard);