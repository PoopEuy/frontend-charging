import React, { useState } from "react";
// import axios from "axios";
import { instanceBackEnd } from "../api/axios.js";
// import { instanceFrame } from "../api/axios.js";

var set_address_stats;
var addressing_loop;

const ScanFrame = () => {
  const [frame_sn, setKodeFrame] = useState("");
  const scanFrame = async (e) => {
    e.preventDefault();

    console.log("FrameSerial = " + frame_sn);
    if (frame_sn === "") {
      alert("FRAME SERIAL TIDAK BOLEH KOSONG!!");
    } else {
      createMframe();
    }
  };

  const createMframe = async () => {
    try {
      const payload = {
        frame_sn: frame_sn.toLowerCase(),
        status_test: false,
      };

      const res = await instanceBackEnd.post("createMframe", payload);

      const data = await res.data;
      const status = await res.status;
      //   console.log(data.data.kd_site);
      console.log(data);
      console.log(status);
      createTableFrame();
    } catch (error) {
      alert("FRAME SUDAH TERDAFTAR");
    }
  };
  const createTableFrame = async () => {
    try {
      const payload = {
        frame_sn: frame_sn.toLowerCase(),
      };

      const res = await instanceBackEnd.post("CreateTable", payload);

      const data = await res.data;
      const msg = data.msg;

      if (msg === "success") {
        console.log("SUKSES CREATE TABLE = " + msg);
        setAddressing();
      } else {
      }
    } catch (error) {
      alert("FAILED CREATED DATA TABLE!!");
    }
  };

  // eslint-disable-next-line
  const setAddressing = async () => {
    try {
      const payload = {
        addr: 1,
      };

      const res = await instanceBackEnd.post(`setAddressing`, payload);
      addressing_loop = 0;
      const data = await res.data;
      set_address_stats = data.data.status;

      console.log(`set_address_stats = ${set_address_stats}`);
      console.log(frame_sn);

      if (set_address_stats === 1) {
        getAddressing();
      } else {
        alert("ADDRESSING FAILED!!!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAddressing = async () => {
    console.log("masuk getAddressing ");

    const res = await instanceBackEnd.get(`getAddressing`);
    const set_status = res.data.data.status;
    const num_of_device = res.data.data.num_of_device;
    const device_address_list = res.data.data.device_address_list;

    console.log(`set_status = ${set_status}`);
    console.log(`num_of_device = ${num_of_device}`);
    console.log(`device_address_list = ${device_address_list}`);
    addressing_loop = addressing_loop + 1;

    if (set_status === 0 && addressing_loop < 30) {
      console.log("LOOP = " + addressing_loop);
      setTimeout(() => {
        getAddressing();
      }, 1000);
    } else if (set_status === 1 && addressing_loop < 31 && num_of_device > 0) {
      console.log("STOP LOOP, Loop =" + addressing_loop);
      setFrame();
    } else {
      alert("Get ADDRESSING FAILED!!!");
    }
  };

  const setFrame = async () => {
    try {
      const payload = {
        bid: 1,
        frame_write: 1,
        frame_name: frame_sn.toLowerCase(),
      };

      const res = await instanceBackEnd.post("setFrameCMS", payload);

      const data = await res.data.data;
      const status_set = data.status;
      console.log("statusSet = " + status_set);

      if (status_set === 1) {
        setDataCollection();
      } else {
        alert("ERROR STATUS SET FRAME!!");
      }
    } catch (error) {
      alert("FAILED setFrame!!");
    }
  };

  const setDataCollection = async () => {
    try {
      const payload = {
        data_collection: 1,
      };

      const res = await instanceBackEnd.post("setDataCollection", payload);
      const data = await res.data.data;
      const status_dacol = data.status;

      if (status_dacol === 1) {
        UpdateMFrameStatus();
      } else {
        alert("ERROR SET STATUS DATA COLLETION!!");
      }
    } catch (error) {
      alert("FAILED SET DATA COLLETION!!");
    }
  };

  const UpdateMFrameStatus = async () => {
    try {
      const payload = {
        frame_sn: frame_sn.toLowerCase(),
        status_test: true,
      };

      const res = await instanceBackEnd.patch("updateMframeByFrame", payload);

      const data = await res.data;
      const status = await res.status;
      //   console.log(data.data.kd_site);
      console.log(data);
      console.log(status);
    } catch (error) {
      alert("FRAME GAGAL UPDATE");
    }
  };

  return (
    <div className="columns mt-5 is-centered">
      <div className="column is-half">
        <form onSubmit={scanFrame}>
          <div className="field">
            <label className="label">Kode Frame</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={frame_sn}
                onChange={(e) => setKodeFrame(e.target.value)}
                placeholder="Scan Frame Serial"
                autoFocus
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
export default ScanFrame;
