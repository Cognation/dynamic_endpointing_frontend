import React, { useEffect, useMemo, useRef, useState } from "react";
import css from "./Talk.module.css";
import AI_Calling_img from "../../Assets/Image/ai_calling.jpg";
import MIC_IMG from "../../Assets/Image/mic_6.png";
import { useNavigate, Link } from "react-router-dom";
import RIGHT_ARROW_IMG from "../../Assets/Image/right_arrow.png";
// import MIC_VID from "../../Assets/Video/mic2.mp4";
import { v4 as uuidv4 } from "uuid";

function Home() {
  const nav = useNavigate();
  const [transcript, settranscript] = useState(null);
  const [ismic, setismic] = useState(false);
  const [audioStream, setAudioStream] = useState(null);
  const [socket, setSocket] = useState(null);
  const [lang, setlang] = useState("en-US");
  const [audioBlobs, setaudioBlobs] = useState([]);
  const [cansend, setcansend] = useState(true);
  const [audioUrl, setAudioUrl] = useState(null);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [stt, setstt] = useState("deepgram");
  const [tts, settts] = useState("deepgram");
  const [chat, setchat] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  let isplaying = false;
  const audioRef = useRef(null);

  const sessionId = uuidv4();

  const playAudio = async (index) => {
    try {
      if (index >= 0 && index < audioBlobs.length) {
        isplaying = true;
        setCurrentAudioIndex(index);
        // audioRef.current.src = audioBlobs.shift().url;
        audioRef.current.src = audioBlobs[index].url;
        const audioelement = new Audio(audioBlobs[index].url);
        //   await audioelement.play();
        await audioRef.current.play();
        console.log("Playing  " + index);

        audioRef.current.onended = () => {
          if (index <= audioBlobs.length) {
            // audioBlobs.shift();
            playAudio(index + 1);
          } else {
            setcansend(true);
            isplaying = false;
            console.log("Stoped at", index);
            console.log("Cansend  ", cansend);
            setaudioBlobs([]);
            console.log("Audio blobs length :", audioBlobs.length);
          }
          // console.log("next");
          // console.log(index);
        };
        //   audioelement.onended = () => {
        //     if (index <= audioBlobs.length) {
        //       // audioBlobs.shift();
        //       playAudio(index + 1);
        //     } else {
        //       setcansend(true);
        //       isplaying = false;
        //       console.log("Stoped at", index);
        //       console.log("Cansend  ", cansend);
        //     }
        //     // console.log("next");
        //     // console.log(index);
        //   };
      } else {
        console.log("index  " + index);
        //   if (index === 0) {
        //     console.log("condition");
        //     // const aud = new Audio(firsturl);
        //     audioRef.current.src = firsturl;
        //     // await aud.play();
        //     await audioRef.current.play();
        //   }
        console.log("Empty");
        setcansend(true);
        isplaying = false;
        setaudioBlobs([]);
        console.log("Audio blobs length :", audioBlobs.length);
      }
    } catch (err) {
      console.log("Error in playing sound : ", err);
    }
  };

  const handlemicchange = async () => {
    setIsPlaying((prevState) => !prevState);
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
    if (stt === "whisperr") {
    } else {
      if (!ismic) {
        settranscript(null);
        await startAudioStream();
      } else {
        stopAudioStream();
      }
    }
    ismic ? setismic(false) : setismic(true);
  };

  useEffect(() => {
    console.log("Ismic : ", ismic);
  }, [ismic]);

  useEffect(() => {
    // Initialize WebSocket connection
    const ws = new WebSocket(
      `ws://${process.env.REACT_APP_WEBSOCKET_URL}/audio`
    );
    ws.onopen = () => {
      setSocket(ws);
      console.log("WebSocket connected");
      ws.send("Language " + lang);
      console.log(sessionId);
      ws.send("id " + sessionId);
      console.log(stt);
      ws.send("stt" + stt);
      console.log(tts);
      ws.send("tts" + tts);
    };

    ws.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      console.log("WebSocket Response:", typeof data);

      if (data.type == "transcript") {
        settranscript((prevTranscript) =>
          prevTranscript ? prevTranscript + data.msg : data.msg
        );
        if (data.msg) {
          let a = chat;
          a.push({ speaker: "USER", message: data.msg });
          setchat(a);
        }
      }

      if (data.type == "llm") {
        if (data.msg) {
          let a = chat;
          a.push({ speaker: "AI", message: data.msg });
          setchat(a);
        }
      }

      if (data.type == "file") {
        if (data.number >= 0) {
          try {
            const url = `${process.env.REACT_APP_BACKEND_URL}/audio_files/${sessionId}/audio${data.number}.mp3`;
            console.log("Url : ", url);
            console.log("File Number : " + data.number);
            console.log("Audio blobs length :", audioBlobs.length);

            if (url) {
              let a = audioBlobs;
              a.push({ id: 1, url: url });
              setaudioBlobs(a);
              console.log(audioBlobs);
              if (!isplaying) {
                console.log("!playing");
                isplaying = true;
                setcansend(false);
                console.time("Startplaying");
                playAudio(data.number);
              }
            }
          } catch (err) {
            console.log("Error in fetching : ", err);
            // throw new Error("Network response was not ok");
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
  useEffect(() => {
    console.log(lang);
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send("stt" + stt);
    }
  }, [stt]);
  useEffect(() => {
    console.log(tts);
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send("tts" + tts);
    }
  }, [tts]);

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
      console.log(stt);
      socket.send("stt" + stt);
      console.log(tts);
      socket.send("tts" + tts);

      const audioContext = new AudioContext({
        sampleRate: 16000,
      });
      const audioInput = audioContext.createMediaStreamSource(stream);
      const bufferSize = 2048;
      const scriptProcessorNode = audioContext.createScriptProcessor(
        bufferSize,
        1,
        1
      );

      scriptProcessorNode.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const l16Data = floatTo16BitPCM(inputData);
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
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send("Stop");
      }
    }
  };

  return (
    <>
      <div className={css.main}>
        <audio
          ref={audioRef}
          controls
          autoPlay
          allow="autoplay"
          className={css.audio}
        >
          <source src="" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>

        <div className={css.try_headings}>
          <div className={css.micc}>
            <span className={css.span}>Give it a Try</span>
          </div>
        </div>

        <div className={css.options}>
          <div class={css.select_wrapper}>
            <label>
              <b> S-T-T : </b>
            </label>
            <select
              class={css.language_select}
              onChange={(e) => {
                setstt(e.target.value);
              }}
            >
              <option value="deepgram">Deepgram</option>
              <option value="whisper">Whisper</option>
            </select>
          </div>
          <div class={css.select_wrapper}>
            <label>
              <b> T-T-S : </b>
            </label>
            <select
              class={css.language_select}
              onChange={(e) => {
                settts(e.target.value);
              }}
            >
              <option value="deepgram">Deepgram</option>
              <option value="playht">Play.ht</option>
            </select>
          </div>
          <div class={css.select_wrapper}>
            <label>
              <b> Language : </b>
            </label>
            <select
              class={css.language_select}
              onChange={(e) => {
                setlang(e.target.value);
              }}
            >
              <option value="en-US">English</option>
              <option value="hi">Hindi</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </div>

        <div className={css.try}>
          {/* <div className={!ismic ? css.mic_boxx : css.mic_boxx1}> */}
          <div className={css.mic_boxx}>
            {/* <div className={css.mic}> */}
            {/* <img
                src={MIC_IMG}
                className={css.img1}
                alt=""
                onClick={handlemicchange}
              /> */}

            {/* </div> */}
            {
              // <video
              //   ref={videoRef}
              //   src={"https://drive.google.com/file/d/10uOGC7JImnJaKubCGK-LIKYbJnhXs9N7/view?usp=sharing"}
              //   muted
              //   loop
              //   onClick={handlemicchange}
              //   autoPlay={isPlaying}
              // />
            }
          </div>
          <div className={css.transcript_box}>
            <h3 className={css.language}>
              <p>
                <span className={css.span_transcript}>Chat</span>
              </p>
            </h3>
            {!chat && chat.length <= 0 && !ismic ? (
              <p>
                Click the mic to transcribe live in English or select another
                language.
              </p>
            ) : (
              <p>
                {chat.map((item, index) => (
                  <div key={index} className={css.chat_div}>
                    <p key={index + 1}>
                      <b>{item.speaker}</b> : {item.message}
                    </p>
                  </div>
                ))}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
