import React, { useState, Component } from "react";
import { instanceBackEnd } from "../api/axios.js";
var addressing_loop;
var set_address_stats;
var num_of_device = "";
var baris = 0;

function TableRows({ rows, tableRowRemove, onValUpdate }) {
  return rows.map((rowsData, index) => {
    const { kode_frame } = rowsData;
    return (
      <tr key={index}>
        <td>
          <input
            type="text"
            value={index + 1}
            onChange={(event) => onValUpdate(index, event)}
            name="baris"
            className="form-control"
            readOnly
          />
        </td>
        <td>
          <input
            type="text"
            value={kode_frame}
            onChange={(event) => onValUpdate(index, event)}
            name="frame_sn_input"
            className="form-control"
            readOnly
          />
        </td>

        {/* <td>
          <button
            className="btn btn-dark"
            onClick={() => tableRowRemove(index)}
          >
            Delete Row
          </button>
        </td> */}
      </tr>
    );
  });
}
function ScanFrame2() {
  const [rows, initRow] = useState([]);
  const [frame_sn, setKodeFrame] = useState([]);

  const addRowTable = () => {
    // const serial_code = document.getElementById("serial_code").value;
    // console.log("serial_code =" + serial_code);

    baris = baris + 1;
    const data = {
      // kode_baris: baris,
      kode_frame: frame_sn,
    };

    initRow([...rows, data]);

    console.log("data = " + data.kode_frame);

    // document.getElementById("serial_code").value = "";
    setKodeFrame("");
  };
  const tableRowRemove = (index) => {
    const dataRow = [...rows];
    dataRow.splice(index, 1);
    initRow(dataRow);
  };
  const onValUpdate = (i, event) => {
    const { name, value } = event.target;
    const data = [...rows];
    data[i][name] = value;
    initRow(data);
  };

  //handler on enter
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      document.getElementById("addFrame").click();
    }
  };

  //on click button add row
  const addFrame = (e) => {
    e.preventDefault();
    console.log("Jumlah Frame = " + num_of_device);

    // if(num_of_device > 0){

    // }
    // else{
    //   // setAddressing();
    // }
    addRowTable();
  };

  const save_frame = (e) => {
    console.log("SAVE FRAME");

    let posts = [
      {
        id: "1",
        title: "Hello World",
        content: "Welcome to learning ReScript & React!",
      },
    ];
    posts.push(posts);
    console.log(posts);
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
      console.log("STOP LOOP go to nextstep, Loop =" + addressing_loop);
      // setFrame();
    } else {
      alert("Get ADDRESSING FAILED!!!");
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
                id="serial_code"
                name="serial_code"
                onKeyDown={handleKeyDown}
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
            <button
              id="addFrame"
              onClick={addFrame}
              className="button is-success"
            >
              Add Frame
            </button>
            <button
              id="addFrame"
              onClick={save_frame}
              className="button is-success"
            >
              Save Frame
            </button>
          </div>
        </div>
      </div>
      <div className="columns mt-5 is-centered">
        <div className="column is-half">
          <button className="btn btn-danger" onClick={addRowTable}>
            Insert Row
          </button>
          <table className="table is-striped is-fullwidth">
            <thead>
              <tr>
                <th>No</th>
                <th>Frame Code</th>
              </tr>
            </thead>
            <tbody>
              <TableRows
                rows={rows}
                tableRowRemove={tableRowRemove}
                onValUpdate={onValUpdate}
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ScanFrame2;
