import React from 'react'
import { dodMoreLink } from '../network/network';

export default function ForbiddenPage() {
    function onClickMore(){
        window.location.assign(dodMoreLink);
    }
    return (
        <div className='result-page-container'>
            <div className='result-page-top-container'>
                <img className='result-page-logo' src={process.env.PUBLIC_URL + '/../nav-logo.png'}/>
            </div>
            <div className='contour'/>
            <div className='result-page-content'>
                <p className='result-page-title'>유효하지 않은 접근입니다.<br/>
                    설문에 참여해 주세요!</p>
                <img className='result-page-dod-img invalid-page' src={process.env.PUBLIC_URL + '/../dod-invalid.png'}/>
                
                
            </div>
            <div>
                <p className='result-more-btn'>혹시! 디오디가 궁금하신가요?</p>
                <button className='result-btn' onClick={onClickMore}>디오디에 대해 알아보기</button>
            </div>
        </div>
    )
}
