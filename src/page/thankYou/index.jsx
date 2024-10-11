import React, {useEffect} from 'react';
import Header from '../../component/header/index';
import Footer from '../../component/footer/index';
import Tagbar from '../../component/tagbar';
import styles from './ThankYou.module.css';
import { useNavigate } from 'react-router-dom';


const ThankYou = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Thêm style cho body khi component mount
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.boxSizing = 'border-box';
        document.body.style.fontFamily = 'sans-serif';
        document.body.style.textAlign = 'center';
        document.body.style.backgroundColor = '#ffffff';
        document.body.style.backgroundImage = 'linear-gradient(to bottom, #ffffff 0%, #e1e8ed 100%)';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundAttachment = 'fixed';
    
        // Cleanup style khi component unmount
        return () => {
            document.body.style.margin = '';
            document.body.style.padding = '';
            document.body.style.boxSizing = '';
            document.body.style.fontFamily = '';
            document.body.style.textAlign = '';
            document.body.style.backgroundColor = '';
            document.body.style.backgroundImage = '';
            document.body.style.backgroundRepeat = '';
            document.body.style.backgroundAttachment = '';
        };
    }, []);
    

  return (
    <>
    <Header />
    <Tagbar />
    <div className={styles.content1}>
      <div className={styles['wrapper-1-thank']}>
        <div className={styles['wrapper-2-thank']}>
          <h1>Thank you !</h1>
          <p>Cảm ơn bạn đã tin tưởng mua hàng của chúng tôi.</p>
          <button className={styles['go-home']} onClick={() => navigate('/')}>
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
    <Footer />
    </>
    
  );
};

export default ThankYou;
