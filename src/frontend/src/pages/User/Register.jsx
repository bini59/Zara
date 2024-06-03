import styled from "styled-components";
import axios from "axios";
import { useState, useEffect } from "react";

function getLocalIP() {
  return new Promise(function(resolve, reject) {
    // NOTE: window.RTCPeerConnection is "not a constructor" in FF22/23
    var RTCPeerConnection = /*window.RTCPeerConnection ||*/ window.webkitRTCPeerConnection || window.mozRTCPeerConnection;

    if (!RTCPeerConnection) {
      reject('Your browser does not support this API');
    }
    
    var rtc = new RTCPeerConnection({iceServers:[]});
    var addrs = {};
    addrs["0.0.0.0"] = false;
    
    function grepSDP(sdp) {
        var hosts = [];
        var finalIP = '';
        sdp.split('\r\n').forEach(function (line) { // c.f. http://tools.ietf.org/html/rfc4566#page-39
            if (~line.indexOf("a=candidate")) {     // http://tools.ietf.org/html/rfc4566#section-5.13
                var parts = line.split(' '),        // http://tools.ietf.org/html/rfc5245#section-15.1
                    addr = parts[4],
                    type = parts[7];
                if (type === 'host') {
                    finalIP = addr;
                }
            } else if (~line.indexOf("c=")) {       // http://tools.ietf.org/html/rfc4566#section-5.7
                var parts = line.split(' '),
                    addr = parts[2];
                finalIP = addr;
            }
        });
        return finalIP;
    }
    
    if (1 || window.mozRTCPeerConnection) {      // FF [and now Chrome!] needs a channel/stream to proceed
        rtc.createDataChannel('', {reliable:false});
    };
    
    rtc.onicecandidate = function (evt) {
        // convert the candidate to SDP so we can run it through our general parser
        // see https://twitter.com/lancestout/status/525796175425720320 for details
        if (evt.candidate) {
          var addr = grepSDP("a="+evt.candidate.candidate);
          resolve(addr);
        }
    };
    rtc.createOffer(function (offerDesc) {
        rtc.setLocalDescription(offerDesc);
    }, function (e) { console.warn("offer failed", e); });
  });
}


const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  & > .title {
    & h1 {
      display: inline-block;
      font-size: 3.6rem;
    }

    & h2 {
      display: inline-block;
      font-size: 2.4rem;
      color: #007BFF;
    }
  }

  & > .input-form {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    & input {
      width: 30rem;
      height: 3.5rem;
      font-size: 1.8rem;
      padding: 0 1rem;
      margin-bottom: 1rem;
      border: 1px solid #c2c2c2;
      border-radius: 0.4rem;

      &:focus {
        outline: none;
        border: 1px solid #007BFF;
      }
    }

    & button {
      width: 30rem;
      height: 3.5rem;
      font-size: 1.8rem;
      font-weight: bold;
      background-color: #007BFF;
      color: white;
      border: none;
      border-radius: 0.4rem;
    }
  }
`

const PREFIX = "http://localhost:8000/api/v1";

const postRegister = async (name, ip) => {
  try {
    const res = await axios.post(PREFIX+"/employees", {
      username: name,
      ip_address: ip
    });
    console.log(res);
    if (res.data.status === "success") {
      alert("등록신청이 완료되었습니다.");
    }
  } catch (err) {
    console.log(err);
  }
}

const Register = () => {

  const [localIP, setLocalIP] = useState("");
  const [name, setName] = useState("");
  useEffect(() => {
    getLocalIP().then((ip) => {
      setLocalIP(ip);
    });
  }, []);

  useEffect(() => {
    console.log(name);
  }, [name]);




  return (
    <Container>
      <div className="title">
        <h1>Zara  </h1>
        <h2>&nbsp;| 사용 등록 신청</h2>
      </div>
      <div className="input-form">
        <input type="text" placeholder="이름" value={name} onChange={(e)=>setName(e.target.value)}/><br />
        <button type="button" onClick={()=>postRegister(name, localIP)}>사용등록</button>
      </div>
    </Container>
  )
}

export default Register;