import React, { useEffect, useRef, useState } from "react";
import css from "./Talk.module.css";
import AI_Calling_img from "../../Assets/Image/ai_calling.jpg";
import MIC_IMG from "../../Assets/Image/mic_6.png";
import { useNavigate, Link } from "react-router-dom";
import RIGHT_ARROW_IMG from "../../Assets/Image/right_arrow.png";

function Home() {
  const nav = useNavigate();
  const [transcript, settranscript] = useState(null);
  const [ismic, setismic] = useState(false);
  const [audioStream, setAudioStream] = useState(null);
  const [socket, setSocket] = useState(null);
  const [lang, setlang] = useState("en-US");
  const [audioBlobs, setaudioBlobs] = useState([]);
  const [cansend, setcansend] = useState(true);
  let isplaying = false;
  const audioRef = useRef(null);

  const playAudio = async (index) => {
    console.log(audioBlobs.length);
    console.log(audioRef);
    try {
      if (index >= 0 && index < audioBlobs.length) {
        isplaying = true;
        console.log(audioRef.current.src);
        audioRef.current.src = audioBlobs[index].url;
        console.log(audioRef.current.src , "   " , audioBlobs[index].url);
        console.timeEnd("Startplaying");
        // const audioelm = new Audio(audioBlobs[index].url);
        // audioelm.play();
        // audioRef.current.play();
        await audioRef.current.play();
        console.log("Playing  " + index);

        audioRef.current.onended = () => {
          if (index + 1 < audioBlobs.length) {
            console.time("playnext");
            playAudio(index + 1);
            console.timeEnd("playnext");
          } else {
            setcansend(true);
            isplaying = false;
            console.log("Stoped at", index);
            console.log("Cansend  ", cansend);
            setaudioBlobs([]);
          }
        };
      } else {
        console.log("index  " + index);
        console.log("audioBlob is empty");
        setaudioBlobs([]);
        setcansend(true);
        isplaying = false;
      }
    } catch (err) {
      console.log("Error in playing sound ", err);
    }
  };

  const handlemicchange = async () => {
    if (!ismic) {
      settranscript(null);
      await startAudioStream();
    } else {
      stopAudioStream();
    }
    ismic ? setismic(false) : setismic(true);
  };

  useEffect(() => {
    console.log("Ismic : ", ismic);
  }, [ismic]);

  useEffect(() => {
    // Initialize WebSocket connection
    const ws = new WebSocket("ws://localhost:8080/audio");
    ws.onopen = () => {
      setSocket(ws);
      console.log("WebSocket connected");
      ws.send("Language " + lang);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("WebSocket Response:", typeof data);

      if (data.type == "transcript") {
        settranscript((prevTranscript) =>
          prevTranscript ? prevTranscript + data.msg : data.msg
        );
      }

      if (data.type == "file") {
        console.log("File Number : " + data.number);
        if (data.number) {
          const url = `http://localhost:8080/audio_files/audio${data.number}.mp3`;
          let a = audioBlobs;
          a.push({ id: 1, url: url });
          setaudioBlobs(a);
          console.log(audioBlobs);
          if (!isplaying) {
            console.log("!playing");
            isplaying = true;
            setcansend(false);
            console.time("Startplaying");
            playAudio(0);
          }
        }
      }
    };

    ws.onclose = () => {
      console.log("Websocket Close");
    };

    ws.onerror = (err) => {
      console.log("Websocket Error", err);
    };

    // Cleanup function
    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    console.log(lang);
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send("Language " + lang);
    }
  }, [lang]);

  function floatTo16BitPCM(input) {
    const output = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
      const sample = Math.max(-1, Math.min(1, input[i]));
      output[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
    }
    return output.buffer;
  }

  const startAudioStream = async () => {
    try {
      console.log("Starting audio stream...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);

      if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.error("WebSocket connection is not open.");
        return;
      }

      socket.send("Start");
      socket.send("Language " + lang);

      const audioContext = new AudioContext();
      const audioInput = audioContext.createMediaStreamSource(stream);
      const bufferSize = 2048;
      const scriptProcessorNode = audioContext.createScriptProcessor(
        bufferSize,
        1,
        1
      );

      scriptProcessorNode.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const l16Data = floatTo16BitPCM(inputData); // Convert float32 to 16-bit PCM
        // Now you can send l16Data to the backend
        socket.send(l16Data);
      };

      audioInput.connect(scriptProcessorNode);
      scriptProcessorNode.connect(audioContext.destination);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopAudioStream = async () => {
    if (audioStream) {
      await audioStream.getTracks().forEach((track) => track.stop());
      setAudioStream(null);
      socket.send("Stop");
    }
  };

  return (
    <>
      <div className={css.main}>
        <audio ref={audioRef} controls autoPlay />
        <div className={css.intro}>
          <div className={css.into_first}>
            <p className={css.p}>
              <span className={css.span}>Talk with AI</span>
            </p>
            <p className={css.intro_text}>
              Our latest research reveals that universally, customers are
              comfortable with AI tools — and they love it when companies use AI
              to boost the CX. Want more insights? Check out the Vonage Global
              Customer Engagement Report 2024 for the latest on top customer
              frustrations, omnichannel trends, and how AI can help.
            </p>
            <button
              className={css.intro_signup}
              onClick={() => {
                nav("/signup");
              }}
            >
              Get Started
            </button>
          </div>
          <div className={css.into_second}>
            <img src={AI_Calling_img} alt="" />
          </div>
        </div>

        <div className={css.try_headings}>
          <div className={css.mic}>
            <span className={css.span}>Give it a Try</span>
          </div>
        </div>

        <div className={css.try}>
          <div className={!ismic ? css.mic_box : css.mic_box1}>
            <div className={css.mic}>
              <img
                src={MIC_IMG}
                className={css.img1}
                alt=""
                onClick={handlemicchange}
              />
            </div>
          </div>
          <div className={css.transcript_box}>
            <h3 className={css.language}>
              <p>
                <span className={css.span_transcript}>Transcript</span>
              </p>
              <p>
                <div class="select-wrapper">
                  <select
                    class="language-select"
                    onChange={(e) => {
                      setlang(e.target.value);
                    }}
                  >
                    <option value="english">English</option>
                    <option value="hi">Hindi</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </p>
            </h3>
            {!transcript && !ismic ? (
              <p>
                Click the mic to transcribe live in English or select another
                language.
              </p>
            ) : (
              <p>{transcript}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
