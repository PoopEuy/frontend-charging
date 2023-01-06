import React, { useState } from "react";
import { instanceBackEnd } from "../api/axios.js";
import Spinner from "react-bootstrap/Spinner";

var baris = 0;
var check_selesai = 0;
var addressing_loop;
var set_address_stats;
var num_of_device;
var device_address_list;
var set_status;
var status_setFrame;
var element_frame;
var element_loading;
var loading_charging;
var div_selesai;

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
        await addFrame();
      } else {
        alert("FRAME SUDAH TERDAFTAR!!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  async function addFrame() {
    console.log(baris, "baris atas");

    console.log(inputdata, " input data  ");
    console.log(baris, "baris");

    if (baris === 1) {
      console.log("baris 1");
      setInputarr([...inputarr, { kode_frame }]);

      setAddressing();
    } else if (baris > 1) {
      await check_array();
      console.log("baris 2 dst");
    } else {
      console.log("baris error");
    }
  }

  async function check_array() {
    const isFound = inputarr.some((element) => {
      if (element.kode_frame === kode_frame) {
        return true;
      }

      return false;
    });

    if (isFound === false) {
      console.log("ARRAY PASS");
      console.log(device_address_list[0], "lihat device_address_list array 0");
      console.log(device_address_list[1], "lihat device_address_list array 1");
      await setInputarr([...inputarr, { kode_frame }]);
      // await check_jumlah_frame();
      console.log(inputarr, " objek store di array atas");
      setTimeout(
        await function () {
          check_jumlah_frame();
        },
        500
      );
    } else {
      alert("FRAME SUDAH DI SCAN!!");
    }
  }

  const setAddressing = async () => {
    try {
      const payload = {
        addr: 1,
      };

      element_frame = document.getElementById("kode_frame");
      element_loading = document.getElementById("loading_address");
      loading_charging = document.getElementById("loading_charging");
      div_selesai = document.getElementById("div_selesai");

      // ✅ Set disabled / hiden attribute
      element_frame.setAttribute("disabled", "");
      element_loading.style.display = "block";

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
      document.getElementById("kode_frame").value = "";
      element_frame.removeAttribute("disabled");
      element_loading.style.display = "none";
      setTimeout(
        await function () {
          check_jumlah_frame();
        },
        500
      );
      // setFrame();
    } else {
      alert("Get ADDRESSING FAILED!!!");
    }
  };

  async function check_jumlah_frame() {
    console.log("baris = " + baris);
    console.log("jumlah frame= " + num_of_device);

    document.getElementById("kode_frame").focus();
    if (baris === num_of_device) {
      console.log("Jumlah frame sesuai jumlah scan");
      const panjang_array = inputarr.length;
      console.log("panjang aray atas = " + panjang_array);
      document.getElementById("save_button").click();
    } else {
      console.log("Lanjut scan" + baris);
    }
  }

  async function save_frame() {
    element_frame.setAttribute("disabled", "");
    loading_charging.style.display = "block";

    console.log(inputarr, " objek store di array ");
    const panjang_array = inputarr.length;
    console.log("panjang aray = " + panjang_array);

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
      // const status = await res.status;
      const msg = await res.data.msg;

      console.log(data);
      console.log("msg = " + msg);
      if (msg === "Created") {
        console.log("Mframe Created");
        setTimeout(
          await function () {
            getStatusCharging(input_value);
          },
          10000
        );
      } else {
        alert("CREATE MFRAME GAGAL");
      }
    } catch (error) {
      alert("FRAME SUDAH TERDAFTAR");
    }
  };

  const getStatusCharging = async (input_value) => {
    try {
      const payload = {
        frame_sn: input_value.kode_frame,
      };

      const res = await instanceBackEnd.post("getMframByFrame", payload);
      const status_checking = await res.data.data.status_checking;
      const data_frame_sn = await res.data.data.frame_sn;

      //   console.log(data.data.kd_site);
      console.log(status_checking, "status_checking");

      if (status_checking === true) {
        console.log("PROSES CHARGING SELESAI 1" + data_frame_sn);
        check_selesai = check_selesai + 1;

        if (check_selesai === num_of_device) {
          console.log("PROSES CHARGING SELESAI");
          loading_charging.style.display = "none";
          div_selesai.style.display = "block";
          setTimeout(
            await function () {
              window.location.reload(true);
            },
            5000
          );
        } else {
          console.log("Lanjut Charge");
        }
      } else {
        console.log("PROSES CHARGING BERJALAN" + data_frame_sn);
        setTimeout(
          await function () {
            getStatusCharging(input_value);
          },
          5000
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="columns mt-5 is-centered">
        <div className="column is-half">
          <label
            className="label"
            style={{ textAlign: "center", fontSize: "30px" }}
          >
            Battery Charging
          </label>
          <div className="field">
            <label className="label">Frame Code</label>
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
            <div style={{ display: "none" }} id="loading_address">
              <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              Loading...
            </div>
            <div style={{ display: "none" }} id="loading_charging">
              <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              Charging Sedang Berjalan...
            </div>
          </div>

          <div className="field">
            {/* <button
              id="addFrame"
              onClick={addFrame}
              className="button is-success"
            >
              Add Frame
            </button> */}
            <button
              id="save_button"
              style={{ display: "none" }}
              onClick={save_frame}
              className="button is-success"
            >
              Save Frame
            </button>
          </div>
        </div>
      </div>
      <div className="columns mt-5 is-centered">
        <div style={{ display: "none" }} id="div_selesai">
          <label
            className="label"
            style={{ textAlign: "center", fontSize: "30px" }}
          >
            Proses Charging Selesai
          </label>
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
