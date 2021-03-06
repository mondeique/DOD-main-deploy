import React,{useState} from 'react'
import { Button } from './Button';
import './SignIn.css'
import baseUrl from '../network/network';

function SignIn(props) {
    const {isOpen, closeModal, loginFunction} = props;
    const [id, updateWrittenId] = useState('');
    const [pw, updateWrittenPW] = useState('');
    const [showAlert, setAlertBoolean] = useState(false);

    function onChangeIdInput(e) {
        setAlertBoolean(false);
        updateWrittenId(e.target.value);
    }
    function onChangePWInput(e){
        setAlertBoolean(false);
        updateWrittenPW(e.target.value);
    }
    function readyToLogin(id, pw){
        var idReady = (id != '');
        var pwReady = (pw != '');
        return idReady && pwReady;
    }
    function loginClickHandler() {
        if(readyToLogin(id, pw)){
            fetch(`${baseUrl}/accounts/v1/login/`,{
                method:"POST",
                headers:{
                    'accept' : 'application/json',
                    'content-type' : 'application/json;charset=UTF-8'},
                body:JSON.stringify({
                    phone:id,
                    password:pw
                })
            }).then(res => res.json())
            .then(
                res => {
                    if(res.token){
                        sessionStorage.setItem('DODtoken', res.token);
                        sessionStorage.setItem('userName', res.name);
                        window.dataLayer.push({
                            'event' : 'loggedIn',
                            'userid': `${res.id}`
                        });
                        loginFunction();
                        closeModal();
                    }else{
                        setAlertBoolean(true);
                        console.log(res);
                    }
                }
            ).catch(function(error){
                console.log(error);
            })
        }else{
            setAlertBoolean(true);
        }
    }
    function onClickFindPW(){
        const a = document.createElement('a');
        a.setAttribute('href', 'https://www.notion.so/944fb33d73f04d638b43620184e4b0db');
        a.setAttribute('target', '_blank');
        a.click();
    }
    return (
        <>
        {
            isOpen?  (
                <>
                    <p className='signin-text'>????????????<br/>??????????????? ?????????!</p>
                    <div className='signin-textbox'>
                        <p className='signin-small-text'>????????????</p>
                        <p className={showAlert? 'signin-alert' : 'signin-alert hide'}>?????? ?????? ??????????????? ??????????????????.</p>
                    </div>
                    <input name='id' className = 'signin-id-input' onChange={onChangeIdInput} type='tel' placeholder='???????????? ????????? ??????????????????'>

                    </input>
                    <div className='signin-textbox'>
                        <p className='signin-small-text'>????????????</p>
                        <p className='signin-findpw' onClick={onClickFindPW}>???????????? ??????</p>
                    </div>
                    <input name='pw' className = 'signin-pw-input' onChange={onChangePWInput} type='password' placeholder='??????????????? ??????????????????'>

                    </input>
                    <div className='contour-16margin'/>
                    <Button buttonSize='btn--xlarge' id='signin' className='signin-submit-btn' onClick={loginClickHandler}>
                        ???????????????
                    </Button>
                </>
            ) : <></>
        }
        </>
    )
}

export default SignIn
