import React, { useState } from "react";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import { instanceBackEnd } from "../api/axios.js";
const AddMasterFrame = () => {
  // const [kd_site, setKodeSite] = useState("");
  // const [ip_adrs, setIpAdress] = useState("");
  const [frame_sn, setKodeFrame] = useState("");
  const [status_test, setStatusTest] = useState("");

  const navigate = useNavigate();

  const saveFrame = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        // kd_site: kd_site,
        // ip_adrs: ip_adrs,
        frame_sn: frame_sn,
        status_test: status_test,
      };
      //   await axios.post("http://localhost:5003/createMframe", {
      //     kd_site,
      //     frame_sn,
      //     ip_adrs,
      //   });

      const res = await instanceBackEnd.post("createMframe", payload);

      const data = await res.data;
      const status = await res.status;
      //   console.log(data.data.kd_site);
      console.log(data);
      console.log(status);

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="columns mt-5 is-centered">
      <div className="column is-half">
        <form onSubmit={saveFrame}>
          {/* <div className="field">
            <label className="label">kd_site</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={kd_site}
                onChange={(e) => setKodeSite(e.target.value)}
                placeholder="kd_site"
              />
            </div>
          </div> */}
          <div className="field">
            <label className="label">Kode Frame</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={frame_sn}
                onChange={(e) => setKodeFrame(e.target.value)}
                placeholder="Site"
              />
            </div>
          </div>
          {/* <div className="field">
            <label className="label">ip_adrs</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={ip_adrs}
                onChange={(e) => setIpAdress(e.target.value)}
                placeholder="ip_adrs"
              />
            </div>
          </div> */}
          <div className="field">
            <label className="label">Status Test</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={status_test}
                onChange={(e) => setStatusTest(e.target.value)}
                placeholder="status_test"
              />
            </div>
          </div>
          <div className="field">
            <button type="submit" className="button is-success">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddMasterFrame;
