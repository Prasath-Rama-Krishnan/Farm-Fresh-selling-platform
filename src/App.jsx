import Header from './Header.jsx';
import Footer from "./Footer.jsx";
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
function App(){
  const handlescrolldown=()=>{
    window.scrollBy({
      top:520,
      behavior:"smooth",
    });
  };
  return(
<>
    <div> 
      <Header/>
      <Helmet>
        <meta property="og:title" content="AVFarm" />
        <meta property="og:description" content="This is a description of the AVFarm website." />
        <meta property="og:image" content="https://i.pinimg.com/736x/b9/3b/7b/b93b7bb7f7dda76f873917f70e636cf7.jpg" />
        <meta property="og:url" content="https://avfarm.vercel.app" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@avfarm" />
      </Helmet>
      <div>
        <img src="https://i.pinimg.com/736x/b9/3b/7b/b93b7bb7f7dda76f873917f70e636cf7.jpg" className="images" />
      </div>
      <div className="product">
        <div className="contain">
        <h1>Fresh Produce, Straight from the Source to Your Doorstep</h1>
        <p>We aim to bridge the gap between farmers and consumers by providing an easy-to-use platform for direct sales</p>
    <center> <button onClick={handlescrolldown}>see more</button></center> 
    </div>  
      </div>
    </div>
    <div className="card-container">
    <div className="card-grid">
    <div className="card">
    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_Q6_a4SY8s-oSZNphgn_Erc-2wfrj8t_Vjw&s" alt="" />
      <h3>Producers</h3>
      
      <p> We partner with farmers to deliver the freshest fruits, vegetables, and other farm goods.</p> 
      <Link to="/producer"><button>Register</button></Link>
    </div>
    <div className="card">
    <img src="https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop" alt="Product Management" />
      <h3>Our Products</h3>
      <p> Manage your products, edit details, update prices, and track your inventory.
      </p>
     <Link to="/buy-products"> <button>Manage Products</button></Link>
    </div>
    <div className="card">
    <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop" alt="Buy Products" />
      <h3>Buy Products</h3>
      <p> Browse our fresh farm products. View detailed information, prices, and contact producers directly.
      </p>
     <Link to="/products"> <button>Browse Products</button></Link>
    </div></div>
    </div>
    
    <div className="instruction-banner" style={{
      marginTop: '60px',
      background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
      padding: '60px 20px',
      textAlign: 'center',
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '20px',
      margin: '60px 20px 0 20px',
      boxShadow: '0 15px 35px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=600&fit=crop") center/cover',
        opacity: 0.2,
        borderRadius: '20px'
      }}></div>
      <div style={{position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto'}}>
        <h2 style={{
          fontSize: '2.5em',
          marginBottom: '20px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          fontWeight: 'bold'
        }}>Need Help Getting Started?</h2>
        <p style={{
          fontSize: '1.3em',
          marginBottom: '30px',
          lineHeight: '1.6',
          textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
        }}>
          Master our platform with comprehensive step-by-step guides. From setting up your first product to managing your entire inventory - we've got you covered!
        </p>
        <Link to="/instruction">
          <button style={{
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '2px solid white',
            padding: '15px 40px',
            fontSize: '1.1em',
            borderRadius: '50px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'white';
            e.target.style.color = '#27ae60';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.2)';
            e.target.style.color = 'white';
            e.target.style.transform = 'translateY(0)';
          }}>
            Explore Instructions
          </button>
        </Link>
      </div>
    </div>

    <div className="about-container">
    <div className="aboutit">
     <center><h1>About us</h1></center> 
      <p>
      Welcome to Farm Fresh Products, your trusted platform for connecting farmers and consumers directly. We are committed to providing fresh, high-quality, and locally grown products straight from farms to your doorstep. Our mission is to empower farmers by giving them a platform to showcase their produce while ensuring consumers enjoy the freshness and transparency they deserve. From grains and vegetables to spices and organic products, we bring you a wide range of sustainably sourced items. By supporting Farm Fresh Products, you&apos;re not only choosing healthier options but also contributing to a greener, more sustainable future for all.</p>
        <center><Link to="/about"><button>learn more</button></Link></center>
      </div>
    <div className="about-img"><center><img src="https://i.pinimg.com/originals/8d/8c/ac/8d8cacc7074eaeb9178a03b9cc4c788d.gif" alt="" /></center></div>
    </div>
    <div className="about-container1">
    
    <div className="about-img1"><center><img src="https://i.pinimg.com/originals/83/27/8e/83278ee8facf9002f7852fc645d201c1.gif" alt="" /></center></div><div className="aboutit1">
     <center><h1>Benifits</h1></center> 
      <p>
      <strong> 1.  </strong>  Fresh products sourced directly from farmers.
      <br /><br />
      <strong> 2.  </strong> Transparent pricing with no middlemen.
      <br /><br />
      <strong>3.  </strong>Easy-to-use platform for browsing and purchasing<br /><br />
      <strong> 4.  </strong>Eco-friendly and sustainable practices.<br /><br />
      <strong>5.  </strong>For example, natural oils like coconut oil or argan oil are packed with fatty acids and vitamins that nourish the skin and hair.</p>
        
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default App;