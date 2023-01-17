import React, { useState, useEffect } from "react";
// import axios from "axios";
import { Link } from "react-router-dom";
import { instanceBackEnd } from "../api/axios.js";

const MasterFrameList = () => {
  // const [m_frames, setMasterFrame] = useState([]);
  const [masterFrames, setMasterFrames] = useState([]);

  useEffect(() => {
    getMasterFrames();
  }, []);
  console.log("instanceBackEnd = " + instanceBackEnd);
  const getMasterFrames = async () => {
    const response = await instanceBackEnd.get("getMframe");
    console.log(response.data);
    setMasterFrames(response.data);
  };

  const deleteFrame = async (id) => {
    try {
      await instanceBackEnd.delete(`deleteMframe/${id}`);
      getMasterFrames();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="columns mt-5 is-centered">
      <div className="column is-half">
        {/* <h1>Lorem ipsum dolor sit amet. HEEELLPPP</h1> */}
        <Link to={"test"} className="button is-success">
          ADD NEW
        </Link>
        <table className="table is-striped is-fullwidth">
          <thead>
            <tr>
              <th>No</th>
              {/* <th>Kode Site</th> */}
              <th>Serial Frame</th>
              {/* <th>Ip</th> */}
              <th>Status Test</th>
              <th>CreatedAt</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {masterFrames.map((masterFrame, index) => (
              <tr key={masterFrame.id}>
                <td>{index + 1}</td>
                {/* <td>{masterFrame.kd_site}</td> */}
                <td>{masterFrame.frame_sn}</td>
                {/* <td>{masterFrame.ip_adrs}</td> */}
                <td>{String(masterFrame.status_test)}</td>
                <td>{masterFrame.createdAt}</td>
                <td>
                  <Link
                    to={`edit/${masterFrame.id}`}
                    className="button is-small is-info"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteFrame(masterFrame.id)}
                    className="button is-small is-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MasterFrameList;
