import React,{useState, useRef, useEffect} from 'react'
import { useHistory } from 'react-router-dom';
import './ResultPage.css'
import ResultModal from './ResultModal'
import baseUrl from '../network/network';

export default function ResultPage(props) {
    const history=useHistory();
    const queryString = require('query-string');
    const params = queryString.parse(props.location.search)
    const [projectKey, setProjectId] = useState(params.p);
    const [validatorKey, setValidatorKey] = useState(params.v);
    const [smsSuccess, setsmsSuccess] = useState(false);
    const [smsFail, setsmsFail] = useState(false);
    const [confirmFailed, setConfirmFailed] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [win, setWin] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [itemName, setItemName] = useState('');

    const confirmKeyAlertMessage = useRef(null);
    const smsAlertMessage = useRef(null);
    const getConfirmKeyButton = useRef(null);

    const [smsSent, setsmsSent] = useState(false);

    const [phone, setPhone] = useState('');
    const [sentPhone, setSentPhone] = useState('');
    const [confirmKey, setConfirmKey] = useState('');

    useEffect(()=>{
        fetch(`${baseUrl}/api/v1/check/is_valid/`,{
            method:'POST',
            headers:{
                'accept' : 'application/json',
                'content-type' : 'application/json;charset=UTF-8',
            },
            body:JSON.stringify({
                project_key:projectKey,
                validator:validatorKey
            })
        }).then(res => {
            if(res.status === 200){
                return res.json();
            }else{
                history.push('/invalid');
            }
        }).then(res => {
            if(res.dod_status === 400){
                history.push('/invalid');
            }else if(res.dod_status === 999){
                history.push('/forbidden');
            }
        })
    }, [])


    function onChangePhoneInput(e){
        setsmsSuccess(false);
        setsmsFail(false);
        setPhone(e.target.value);
    }
    function onChangeConfirmKey(e){
        setConfirmFailed(false);
        setConfirmKey(e.target.value);
    }
    function changeButtonText(disable){
        const btn = getConfirmKeyButton.current;
        if(disable){
            btn.disabled = true;
            btn.firstChild.data = '?????????';
            btn.style.backgroundColor = '#CFCFCF';
            btn.style.borderColor = '#CFCFCF'
            btn.classList.add('noHover');
        }else{
            btn.disabled = false;
            btn.firstChild.data = '???????????? ?????? ??????';
            btn.style.backgroundColor = '#7C44FF';
            btn.style.borderColor = '#7C44FF'
            btn.classList.remove('noHover');
        }
    }

    function onClickGetConfirmKey() {
        setConfirmFailed(false);
        if((phone != '')&&phone.length == 11){
            changeButtonText(true);
            fetch(`${baseUrl}/api/v1/sms/respondent_send/`,{
                method:"POST",
                headers:{
                    'accept' : 'application/json',
                    'content-type' : 'application/json;charset=UTF-8'},
                body:JSON.stringify({
                    phone:phone
                })
            }).then(function(res) {
                changeButtonText(false);
                if(res.ok){
                    setsmsSuccess(true);//???????????????
                    setsmsFail(false);//???????????????
                    setsmsSent(true);
                    setSentPhone(phone);
                }else if(res.status == 410){
                    smsFailAlert('?????? ??????????????????.');
                    setsmsSent(false);
                }else{
                    return res.json();
                }
            }
            )
            .then(
                (res) => {
                    if(res.non_field_errors[0] != ''){
                        smsFailAlert(res.non_field_errors[0]);
                    }else{
                        smsFailAlert('??????????????? ??????????????????.')
                    }
                    setsmsSent(false);
                }
            ).catch(function(error){
                
            })
        }else{
            smsFailAlert('??????????????? ??????????????????.');
            setsmsSent(false);
        }
    }

    function smsFailAlert(text){
        setsmsSuccess(false);
        smsAlertMessage.current.innerText = text;
        setsmsFail(true);
    }

    function onClickConfirm(){
        if(smsSent){
            if(confirmKey == ''){
                confirmFailAlert('??????????????? ??????????????????.')
            }else{
                fetch(`${baseUrl}/api/v1/sms/respondent_confirm/`,{
                    method:"POST",
                    headers:{
                        'accept' : 'application/json',
                        'content-type' : 'application/json;charset=UTF-8'},
                    body:JSON.stringify({
                        phone:sentPhone,
                        confirm_key : confirmKey,
                        project_key:projectKey,
                        validator:validatorKey
                    })
                }).then(function(res){
                    return res.json();
                }).then(res => {
                    if(res.is_win === undefined){
                        if(res.non_field_errors[0] != ''){
                            confirmFailAlert(res.non_field_errors[0])
                        }else{
                            confirmFailAlert('????????? ?????????????????????.')
                        }
                    }else{
                        setWin(res.is_win);
                        setItemName(res.item_name);
                        setShowResultModal(true);
                        setTimeout(()=>{
                            setShowResult(true);
                        }, 6000 )
                    }
                }).catch(function(res){
                    
                })
            }
        }else{
            confirmFailAlert('??????????????? ?????? ??????????????????.');
        }
    }
    function confirmFailAlert(text){
        confirmKeyAlertMessage.current.innerText = text;
        setConfirmFailed(true);
    }

    return (
        <div className='result-page-container'>
            <div className='result-page-top-container'>
                <img className='result-page-logo' src={process.env.PUBLIC_URL + '/../nav-logo.png'}/>
            </div>
            <div className='contour'/>
            <div className='result-page-content'>
                <p className='result-page-title'>???????????? ?????? ?????????<br/>?????? ???????????????</p>
                <p className='result-page-subtitle'>
                    ?????? ?????? ?????? ???????????? ???????????????!
                </p>
                <img className='result-page-dod-img' src={process.env.PUBLIC_URL + '/../dod.png'}/>
                <p className='result-page-text'>
                    ????????? ????????? ????????? ???????????? ?????? ???????????? ??????<br/>
                    ?????? ???????????? ?????? ????????? ????????????<br/>
                    ????????? ????????? ?????? ???????????????.
                </p>          
            </div>
            <div>
                <div className='signup-textbox'>
                    <p className='signup-small-text'>????????????</p>
                    <p className={smsSuccess? 'signup-sms-success' : 'signup-sms-success hide'}>??????????????? ??????????????????.</p>
                    <p ref = {smsAlertMessage} className={smsFail? 'signup-sms-fail' : 'signup-sms-fail hide'}>??????????????? ??????????????????.</p>
                </div>
                <input name='id' className = 'signup-id-input' type='tel' placeholder='???????????? ????????? ??????????????????' onChange={onChangePhoneInput}>
                </input>
                <button ref={getConfirmKeyButton} id = 'result-getConfirmKey' className='result-btn' onClick={onClickGetConfirmKey}>
                    ???????????? ?????? ??????
                </button>
                <div className='contour-16margin-both'/>
                <div className='signup-textbox'>
                    <p className='signup-small-text'>????????????</p>
                    <p ref={confirmKeyAlertMessage} className={confirmFailed? 'signup-confirm-fail' : 'signup-confirm-fail hide'}>??????????????? ????????????.</p>
                </div>
                <input name='pw' className = 'signup-pw-input' type='text' placeholder='??????????????? ??????????????????' onChange={onChangeConfirmKey}>
                </input>
                <button id = 'result-confirm' className='result-btn' onClick={onClickConfirm}>
                    ?????? ??? ?????? ????????????
                </button>
            </div>
            <ResultModal isModalOpen={showResultModal} showResult = {showResult} win={win} item_name={itemName}/>
        </div>
    )
}