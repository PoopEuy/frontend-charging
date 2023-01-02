import React, { useState } from "react";
import { instanceBackEnd } from "../api/axios.js";

var baris = 0;
var addressing_loop;
var set_address_stats;
var num_of_device;
var device_address_list;
var set_status;
var status_setFrame;
function FrameList() {
  const [inputdata, SetInputdata] = useState({
    kode_frame: "",
    // status: "",
  });

  const [inputarr, setInputarr] = useState([]);

  function changehandle(e) {
    SetInputdata({ ...inputdata, [e.target.name]: e.target.value });
  }

  let { kode_frame } = inputdata;

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // document.getElementById("addFrame").click();
      baris = baris + 1;
      getMframByFrame();
    }
  };

  const getMframByFrame = async () => {
    try {
      const payload = {
        frame_sn: kode_frame,
      };

      const res = await instanceBackEnd.post("getMframByFrame", payload);
      const data = await res.data.data;
      const status = await res.status;
      //   console.log(data.data.kd_site);
      console.log(data, "data");
      console.log(status, "nilai status");
      if (data === null) {
        addFrame();
      } else {
        alert("FRAME SUDAH TERDAFTAR!!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  function addFrame() {
    console.log(baris, "baris atas");

    console.log(inputdata, " input data  ");
    console.log(baris, "baris");

    if (baris === 1) {
      console.log("baris 1");
      setInputarr([...inputarr, { kode_frame }]);

      setAddressing();
    } else if (baris > 1) {
      check_array();
      console.log("baris 2 dst");
    } else {
      console.log("baris error");
    }
  }

  const check_array = async () => {
    const isFound = inputarr.some((element) => {
      if (element.kode_frame === kode_frame) {
        return true;
      }

      return false;
    });

    if (isFound === true) {
      alert("FRAME SUDAH DI SCAN!!");
    } else {
      console.log("ARRAY PASS");
      console.log(device_address_list[0], "lihat device_address_list array 0");
      console.log(device_address_list[1], "lihat device_address_list array 1");
      setInputarr([...inputarr, { kode_frame }]);
    }
  };

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
    const element_frame = document.getElementById("kode_frame");
    const element_loading = document.getElementById("loading_div");

    // ✅ Set disabled / hiden attribute
    element_frame.setAttribute("disabled", "");
    element_loading.style.display = "block";

    console.log("masuk getAddressing ");
    const res = await instanceBackEnd.get(`getAddressing`);

    set_status = res.data.data.status;
    num_of_device = res.data.data.num_of_device;
    device_address_list = res.data.data.device_address_list;

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
      console.log("STOP LOOP go to nextstep, Loop =" + addressing_loop);

      element_frame.removeAttribute("disabled");
      element_loading.style.display = "none";
      // setFrame();
    } else {
      alert("Get ADDRESSING FAILED!!!");
    }
  };

  async function save_frame() {
    console.log(inputarr, " objek store di array ");

    const panjang_array = inputarr.length;

    for (let i = 0; i < inputarr.length; i++) {
      const input_value = inputarr[i];
      const input_bid = device_address_list[i];
      console.log(input_value, "input_value");

      console.log("status_setFrame FOR1 = " + status_setFrame);
      if (i === 0) {
        console.log("set frame pertama");
        await setFrame(input_value, input_bid, i);
      } else if (i > 0 && status_setFrame === 1) {
        console.log("set frame next");
        setTimeout(await setFrame(input_value, input_bid, i), 500);
      } else {
        console.log("status_setFrame FOR2 = " + status_setFrame);
      }
      console.log(panjang_array, "panjang_array");
      console.log(i, "<= ARRAY KE");
    }
  }

  const setFrame = async (input_value, input_bid, i) => {
    console.log(input_bid, "input_bid");
    try {
      const payload = {
        bid: input_bid,
        frame_write: 1,
        frame_name: input_value.kode_frame,
      };

      const res = await instanceBackEnd.post("setFrameCMS", payload);

      const data = await res.data.data;
      status_setFrame = data.status;
      console.log("status_setFrame = " + status_setFrame);

      if (status_setFrame === 1 && i === 0) {
        await setDataCollection(input_value);

        console.log("sukses set frame, masuk set data collection");
      } else if (status_setFrame === 1) {
        console.log("sukses set frame");
        await createTableFrame(input_value);
      } else {
        alert("GAGAL SET FRAME");
      }
    } catch (error) {
      alert("FAILED setFrame!!");
    }
  };

  const setDataCollection = async (input_value) => {
    try {
      const payload = {
        data_collection: 1,
      };

      const res = await instanceBackEnd.post("setDataCollection", payload);
      const data = await res.data.data;
      const status_dacol = data.status;

      if (status_dacol === 1) {
        // UpdateMFrameStatus();
        await createTableFrame(input_value);
      } else {
        alert("ERROR SET STATUS DATA COLLETION!!");
      }
    } catch (error) {
      alert("FAILED SET DATA COLLETION!!");
    }
  };

  const createTableFrame = async (input_value) => {
    try {
      const payload = {
        frame_sn: input_value.kode_frame,
      };

      const res = await instanceBackEnd.post("CreateTable", payload);

      const data = await res.data;
      const msg = data.msg;

      if (msg === "success") {
        console.log("SUKSES CREATE TABLE = " + msg);
        await createMframe(input_value);
      } else {
      }
    } catch (error) {
      alert("FAILED CREATED DATA TABLE!!");
    }
  };

  const createMframe = async (input_value) => {
    try {
      const payload = {
        frame_sn: input_value.kode_frame,
        status_test: true,
        status_checking: false,
      };

      const res = await instanceBackEnd.post("createMframe", payload);

      const data = await res.data;
      const status = await res.status;
      const msg = await res.data.msg;

      console.log(data);
      console.log("msg = " + msg);
      if (msg === "Created") {
        console.log("Mframe Created");
      } else {
        alert("CREATE MFRAME GAGAL");
      }
    } catch (error) {
      alert("FRAME SUDAH TERDAFTAR");
    }
  };

  return (
    <div>
      <div className="columns mt-5 is-centered">
        <div className="column is-half">
          <div className="field">
            <label className="label">Kode Frame</label>
            <div className="control">
              <input
                id="kode_frame"
                type="text"
                name="kode_frame"
                className="input"
                value={inputdata.kode_frame}
                onChange={changehandle}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            </div>

            {/* <label className="label">Status</label>
            <div className="control">
              <input
                type="text"
                name="status"
                className="input"
                value={inputdata.status}
                onChange={changehandle}
              />
            </div> */}
          </div>

          <div className="field">
            <div style={{ display: "none" }} id="loading_div">
              <p className="loader"></p>
              {/* <p>LOADING</p> */}
            </div>
          </div>

          <div className="field">
            <button
              id="addFrame"
              onClick={addFrame}
              className="button is-success"
            >
              Add Frame
            </button>
            <button onClick={save_frame} className="button is-success">
              Save Frame
            </button>
          </div>
        </div>
      </div>

      <div className="columns mt-5 is-centered">
        <div className="column is-half">
          <table className="table is-striped is-fullwidth">
            <thead>
              <tr>
                <th>No</th>
                <th>Frame Code</th>
              </tr>
            </thead>

            <tbody>
              {inputarr.map((info, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{info.kode_frame}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FrameList;
