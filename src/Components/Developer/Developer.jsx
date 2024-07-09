import React, { useEffect, useState } from 'react';
import css from './Developer.module.css';
import { Link } from 'react-router-dom';

function Developer() {
    const [selected , setselected] = useState('introduction');

    const handlechange = (e)=>{
        setselected(e.target.innerText.toLowerCase().replace(/\s+/g, '_'));
    }

    useEffect(()=>{
        window.scrollTo(0,0);
      } , []);

    useEffect(()=>{
        console.log(selected);
    } , [selected]);
    return (
        <>
            <div className={css.main}>
                <div className={css.left}>
                    <ul className={css.ul}>
                        <h3><span className={css.span}>IVY Docs</span></h3>
                        <li className={`${css.li} ${selected === 'introduction' ? css.selected : ''}`} onClick={handlechange}>Introduction</li>
                        <li className={`${css.li} ${selected === 'support' ? css.selected : ''}`} onClick={handlechange}>Support</li>
                    </ul>
                    <ul className={css.ul}>
                        <h3><span className={css.span}>Getting Started</span></h3>
                        <li className={`${css.li} ${selected === 'pre_recorded' ? css.selected : ''}`} onClick={handlechange}>Pre Recorded</li>
                        <li className={`${css.li} ${selected === 'live_streaming' ? css.selected : ''}`} onClick={handlechange}>Live Streaming</li>
                    </ul>
                    <ul className={css.ul}>
                    <h3><Link to={'/tutorial'} className={css.link}><span className={css.span}>Tutorial</span></Link></h3>
                    </ul>
                    <ul className={css.ul}>
                        <h3><Link to={'/join_community'} className={css.link}><span className={css.span}>Join the community</span></Link></h3>
                    </ul>
                </div>
                <div className={css.right}>
                    {/* Render content based on the selected state */}
                    {selected === 'introduction' && <div className={css.detail}>
                        <h1><span className={css.right_span}>Introduction</span></h1>
                        <div className={css.intro}>We are building the future of Specch to Text.Making the best STT model with the best accurccy int the market and response time.</div>
                        <div className={css.intro}>Making the Whisper model streaming.</div>
                    </div>}
                    {selected === 'support' && <div className={css.detail}><h1><span className={css.right_span}>Support</span></h1>
                        <div className={css.intro}>Join our community to get in touch and share your problem with all the members.</div>
                        <p><Link to={'/join_community'} className={css.link}><span className={css.join_community_span}>Join the community</span></Link></p></div>}
                    {selected === 'pre_recorded' && <div className={css.detail}><h1><span className={css.right_span}>Pre Recorded</span></h1>
                        <div className={css.intro}>We are building the future of Specch to Text.Making the best STT model with the best accurccy int the market and response time.</div>
                        <div className={css.intro}>Making the Whisper model streaming.</div></div>}
                    {selected === 'live_streaming' && <div className={css.detail}><h1><span className={css.right_span}>Live Streaming</span></h1>
                        <div className={css.intro}>We are building the future of Specch to Text.Making the best STT model with the best accurccy int the market and response time.</div>
                        <div className={css.intro}>Making the Whisper model streaming.</div></div>}
                </div>
            </div>
        </>
    )
}

export default Developer
