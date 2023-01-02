import React, { useState, useEffect } from "react";
// import axios from "axios";
import { instanceBackEnd } from "../api/axios.js";
import { useNavigate, useParams } from "react-router-dom";

const EditMasterFrame = () => {
  const [kd_site, setKodeSite] = useState("");
  const [sn_frme, setKodeFrame] = useState("");
  const [ip_adrs, setIpAdress] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    getFrameById();
    // eslint-disable-next-line
  }, []);

  const getFrameById = async () => {
    const response = await instanceBackEnd.get(`getMframe/${id}`);
    // const response = await axios.get(`http://localhost:5003/getMframe/${id}`);
    console.log(response);
    setKodeSite(response.data.kd_site);
    setKodeFrame(response.data.sn_frme);
    setIpAdress(response.data.ip_adrs);
  };

  const updateFrame = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        kd_site: kd_site,
        sn_frme: sn_frme,
        ip_adrs: ip_adrs,
      };

      const res = await instanceBackEnd.patch(
        `updateMframeById/${id}`,
        payload
      );

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
        <form onSubmit={updateFrame}>
          <div className="field">
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
          </div>
          <div className="field">
            <label className="label">Kode Frame</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={sn_frme}
                onChange={(e) => setKodeFrame(e.target.value)}
                placeholder="Site"
              />
            </div>
          </div>
          <div className="field">
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
          </div>
          <div className="field">
            <button type="submit" className="button is-success">
              Update Frame
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default EditMasterFrame;
