import React,{useState} from 'react'
import './CreateProject.css'
import CalenderModal from './CalendarModal'
import ProductCard from './ProductCard';

function CreateProject(props) {
    const {pageNum, onClickPay, setPrice, productList, setProductList, totalProductNum, setTotalProductNum, startDate, endDate, setStartDate, setEndDate} = props;
    const [dueDateOpen, setDueDateOpen] = useState(true);
    const [giftOpen, setGiftOpen] = useState(false);
    
    const [startDayModalOpen , setStartDayModalOpen] = useState(false);
    const [endDayModalOpen , setEndDayModalOpen] = useState(false);
    const [priceInfo, setPriceInfo] = useState({
        price:0,
        origin_price:0,
    });
    
    const [readyToPay, setReadyToPay] = useState(false);

    function onClickDueDate(){
        setDueDateOpen(true);
        setGiftOpen(false);
    }
    function onClickGift(){
        setDueDateOpen(false);
        setGiftOpen(true);
    }
    function closeStartModal(){
        setStartDayModalOpen(false);
    }
    function openStartModal(){
        setStartDayModalOpen(true);
    }
    function closeEndModal(){
        setEndDayModalOpen(false);
    }
    function openEndModal(){
        setEndDayModalOpen(true);
    }

    function countTotalProductNum(newArray){
        var num = 0;
        var tempPriceInfo = {
            price:0,
            origin_price:0,
        }
        newArray.map(function(item){
            num += item.num
            tempPriceInfo.price += item.num * item.price;
            tempPriceInfo.origin_price += item.num * item.origin_price;
        });
        setTotalProductNum(num);
        setPriceInfo(tempPriceInfo);
        if(num === 0){
            setReadyToPay(false);
        }else{
            setReadyToPay(true);
        }
    }
    function onChangeProductNum(index, newNum){
        var newArray = productList;
        newArray[index].num = newNum;
        setProductList(newArray);
        countTotalProductNum(newArray);
    }
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    function getDiscountRate(origin, temp){
        return parseInt(((origin - temp) * 100) / origin);
    }
    return (
        <>
            {(pageNum === 0)?
                <div className='createproject-container'>
                    <p className='createproject-text'>
                        2????????? ????????????<br/>?????? ????????? ???????????????.
                    </p>
                    <div id='select-date-btn' className={dueDateOpen?'create-project-selectBox open':'create-project-selectBox'} onClick={onClickDueDate}>
                        <div className='create-project-card'>
                            <p className='create-project-card-text'>1. ?????? ?????? ??????</p>
                            <p className={!dueDateOpen?'create-project-dueDate':'create-project-dueDate hide'}><img className='create-project-icon' src={process.env.PUBLIC_URL + 'icon-calendar.png'}/>
                                {startDate.getMonth() + 1}-{startDate.getDate()} ~ {endDate.getMonth() + 1}-{endDate.getDate()}
                            </p>
                        </div>
                        <div id='select-date-btn' className={dueDateOpen?'create-project-descriptionBox':'create-project-descriptionBox hide'}>
                            <p className='create-project-dueDate-description'>
                                ?????? ???????????? ???????????? ??????????????????.<br/>
                                ????????? 00:00?????? ????????? 24:00?????? <br/>????????? ???????????????.
                            </p>
                            <div className='create-project-box2'>
                                <p id='select-start-date-btn' className='create-project-dueDate-inline' onClick={openStartModal}><img className='create-project-icon' src={process.env.PUBLIC_URL + 'icon-calendar.png'}/>{startDate.getMonth()+1}-{startDate.getDate()}</p>
                                 ~ 
                                <p id='select-end-date-btn' className='create-project-dueDate-inline' onClick={openEndModal}><img className='create-project-icon' src={process.env.PUBLIC_URL + 'icon-calendar.png'} />{endDate.getMonth()+1}-{endDate.getDate()}</p>
                            </div>
                            <CalenderModal isStart={true} closeModal={closeStartModal} isModalOpen={startDayModalOpen} value={startDate} onChange={setStartDate}/>
                            <CalenderModal isStart={false} closeModal={closeEndModal} isModalOpen={endDayModalOpen} value={endDate} onChange={setEndDate}/>
                            </div>
                        <img className={dueDateOpen? 'create-project-arrow hide':'create-project-arrow'} src={process.env.PUBLIC_URL + 'arrow-down.png'}/>
                    </div>
                    <div id='select-gift-btn' className={giftOpen?'create-project-selectBox open':'create-project-selectBox'} onClick={onClickGift}>
                        <div className='create-project-card'>
                            <p className='create-project-card-text'>2. ???????????? ??????</p>
                            <p className={!giftOpen?'create-project-dueDate':'create-project-dueDate hide'}>
                                {totalProductNum}???
                            </p>
                        </div>
                        <div className={giftOpen?'create-project-descriptionBox':'create-project-descriptionBox hide'}>
                            <p className='create-project-gift-description'>
                                ??????????????? ????????? <br/>??????????????? ??????????????????.
                            </p>
                            {
                                productList.map((item, index) => <ProductCard key={index} item={item} index = {index} onChange={onChangeProductNum}/>)
                            }
                        </div>
                        <img className={giftOpen? 'create-project-arrow hide':'create-project-arrow'} src={process.env.PUBLIC_URL + 'arrow-down.png'}/>
                    </div>
                    <div className='contour-16margin'/>
                    <div className={readyToPay?'create-project-totalprice-box':'create-project-totalprice-box hide'}>
                        <p className='create-project-totalprice-text'>?????? ??????????????????<br/><span className='create-project-totaldiscount-price'>{numberWithCommas(priceInfo.origin_price - priceInfo.price)}???</span> ????????? ??? ?????????</p>
                        <div className='create-project-totalprice-innerbox'>
                            <p className='create-project-totaloriginprice'><del>{numberWithCommas(priceInfo.origin_price)}???</del> <span className='create-project-totaldiscountrate'>{getDiscountRate(priceInfo.origin_price, priceInfo.price)}%</span></p>
                            <p className='create-project-totalprice'>??? ????????????: {numberWithCommas(priceInfo.price)}???</p>
                        </div>
                    </div>
                    <button className={readyToPay?'create-project-pay-btn':'create-project-pay-btn disabled'} onClick={readyToPay?onClickPay:null}>????????????</button>
                </div>
            :
            <></>
            }
        
        </>
        
    )
}

export default CreateProject
