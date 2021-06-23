import { when } from 'jquery';
import React,{useState, useRef} from 'react'
import { Button } from './Button'
import './SignUp.css'

function SignUp(props) {
    const {isOpen, openPWAssign} = props;
    const [smsSuccess, setsmsSuccess] = useState(false);
    const [smsFail, setsmsFail] = useState(false);
    const [confirmFailed, setConfirmFailed] = useState(false);

    const confirmKeyAlertMessage = useRef(null);
    const smsAlertMessage = useRef(null);

    const [smsSent, setsmsSent] = useState(false);
    const [confirmed, setConfirmed] = useState(false);


    const [phone, setPhone] = useState('');
    const [sentPhone, setSentPhone] = useState('');
    const [confirmKey, setConfirmKey] = useState('');
    function onChangePhoneInput(e){
        setsmsSuccess(false);
        setsmsFail(false);
        setPhone(e.target.value);
    }
    function onChangeConfirmKey(e){
        setConfirmFailed(false);
        setConfirmKey(e.target.value);
    }

    function onClickGetConfirmKey() {
        if((phone != '')&&phone.length == 11){
            fetch('http://3.36.156.224:8000/api/v1/sms/send/',{
                method:"POST",
                headers:{
                    'accept' : 'application/json',
                    'content-type' : 'application/json;charset=UTF-8'},
                body:JSON.stringify({
                    phone:phone
                })
            }).then(function(res) {
                if(res.ok){
                    setsmsSuccess(true);//안내메시지
                    setsmsFail(false);//안내메시지
                    setsmsSent(true);
                    setSentPhone(phone);
                }else if(res.status == 410){
                    smsFailAlert('다시 시도해주세요.');
                    setsmsSent(false);
                }else{
                    return res.json();
                }
            }
            )
            .then(
                (res) => {
                    console.log(res);
                    if(res.non_field_errors[0] != ''){
                        smsFailAlert(res.non_field_errors[0]);
                    }else{
                        smsFailAlert('전화번호를 확인해주세요.')
                    }
                    setsmsSent(false);
                }
            ).catch(function(error){
                
            })
        }else{
            smsFailAlert('전화번호를 확인해주세요.');
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
                confirmFailAlert('인증번호를 입력해주세요.')
            }else{
                fetch('http://3.36.156.224:8000/api/v1/sms/confirm/',{
                    method:"POST",
                    headers:{
                        'accept' : 'application/json',
                        'content-type' : 'application/json;charset=UTF-8'},
                    body:JSON.stringify({
                        phone:sentPhone,
                        confirm_key : confirmKey
                    })
                }).then(function(res){
                    if(res.ok){
                        sessionStorage.setItem('phone', sentPhone);
                        sessionStorage.setItem('confirmKey', confirmKey);
                        openPWAssign();
                    }else{
                        return res.json();
                    }
                }).then(
                    (res) => {
                        if(res.non_field_errors[0] != ''){
                            confirmFailAlert(res.non_field_errors[0])
                        }else{
                            confirmFailAlert('잘못된 인증번호입니다.')
                        }
                    }
                ).catch(function(res){
                    
                })
            }
        }else{
            confirmFailAlert('인증번호를 먼저 전송해주세요.');
        }
    }
    function confirmFailAlert(text){
        confirmKeyAlertMessage.current.innerText = text;
        setConfirmFailed(true);
    }

    return (
        <>
        {
            isOpen?  (
                <>
                    <p className='signup-text'>디오디는<br/>휴대전화로 가입!</p>
                    <div className='signup-textbox'>
                        <p className='signup-small-text'>전화번호</p>
                        <p className={smsSuccess? 'signup-sms-success' : 'signup-sms-success hide'}>인증번호가 전송되었어요.</p>
                        <p ref = {smsAlertMessage} className={smsFail? 'signup-sms-fail' : 'signup-sms-fail hide'}>전화번호를 확인해주세요.</p>
                    </div>
                    <input name='id' className = 'signup-id-input' type='tel' placeholder='휴대전화 번호를 입력해주세요' onChange={onChangePhoneInput}>

                    </input>
                    <Button id = 'getConfirmKey' buttonSize='btn--xlarge' className='signup-getConfirmKey-btn' onClick={onClickGetConfirmKey}>
                        인증번호 문자 받기
                    </Button>
                    <div className='contour-16margin-both'/>
                    <div className='signup-textbox'>
                        <p className='signup-small-text'>인증번호</p>
                        <p ref={confirmKeyAlertMessage} className={confirmFailed? 'signup-confirm-fail' : 'signup-confirm-fail hide'}>인증번호가 다릅니다.</p>
                    </div>
                    <input name='pw' className = 'signup-pw-input' type='number' placeholder='인증번호를 입력해주세요' onChange={onChangeConfirmKey}>

                    </input>
                    <Button id = 'confirm' buttonSize='btn--xlarge' className='signup-confirm-btn' onClick={onClickConfirm}>
                        인증하기
                    </Button>
                </>
            ) : <></>
        }
        </>
    )
}

export default SignUp