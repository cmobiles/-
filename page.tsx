"use client";

import Image from "next/image";
import { useState } from "react";

const phone = "6360509055";
const wa = `https://wa.me/91${phone}`;

function openBuy() {
  const name = window.prompt("Enter your name");
  if (!name) return;
  const customerPhone = window.prompt("Enter your phone number") || "";
  const place = window.prompt("Enter your place/location") || "";
  const text = `Hello Charan Mobiles,%0A%0AI am interested in a product.%0AName: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(customerPhone)}%0APlace: ${encodeURIComponent(place)}`;
  window.open(`${wa}?text=${text}`, "_blank");
}

export default function Home() {
  const [showOffer, setShowOffer] = useState(true);

  return (
    <main>
      {showOffer && (
        <div style={{position:"fixed",inset:0,zIndex:50,display:"grid",placeItems:"center",background:"rgba(0,0,0,.76)",padding:20}}>
          <div className="glass card offer" style={{width:"min(520px,100%)"}}>
            <button onClick={()=>setShowOffer(false)} style={{position:"absolute",right:16,top:14,border:0,borderRadius:99,width:38,height:38,fontSize:22,cursor:"pointer"}}>×</button>
            <p className="gold" style={{letterSpacing:3}}>CHARAN MOBILES</p>
            <h2 style={{fontSize:42,margin:"18px 0"}}>SPECIAL OFFERS</h2>
            <p className="section-sub">Offers are displayed only when published by the owner. No fake information.</p>
            <button className="btn btn-light" onClick={()=>setShowOffer(false)}>View Website</button>
          </div>
        </div>
      )}

      <section className="hero">
        <div className="shell hero-grid">
          <div>
            <div className="logo-wrap">
              <Image className="logo" src="/assets/charan-logo.png" width={76} height={76} alt="Charan Mobiles logo" />
              <div><div className="brand">CHARAN MOBILES</div><div className="small">SMART CHOICE. SMART LIFE.</div></div>
            </div>
            <h1>PREMIUM.<br/><span className="gold">SIMPLE.</span><br/>TRUSTED.</h1>
            <p className="subtitle">Real mobiles, genuine product information, accessories, offers and electronic gadgets — managed directly by Charan Mobiles.</p>
            <div className="actions">
              <a href="#products" className="btn btn-light">View Products</a>
              <a href="#offers" className="btn btn-dark">View Offers</a>
              <a href={wa} target="_blank" className="btn btn-dark">WhatsApp Us</a>
            </div>
          </div>

          <div className="glass hero-card">
            <div>
              <div className="small">OWNER</div>
              <div className="mk"><span>M</span>UTHU <span>K</span>UMAR</div>
            </div>
            <div>
              <div className="small">CHARAN MOBILES</div>
              <h2 style={{fontSize:34,margin:"8px 0"}}>Naravi · 574109</h2>
              <p className="section-sub">Near Sooryanarayana Temple, Belthangady Taluk, Dakshina Kannada, Karnataka, India.</p>
            </div>
            <div className="actions">
              <button className="btn btn-light" onClick={openBuy}>Slide to Buy →</button>
              <a className="btn btn-dark" target="_blank" href="https://maps.app.goo.gl/bKs9CdG2TAaKtRuy5?g_st=ac">Slide to Reach →</a>
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="section">
        <div className="shell">
          <p className="brand">PRODUCTS</p>
          <h2 className="section-title">Only real products.</h2>
          <p className="section-sub">The public catalogue is owner-controlled. Products can be new, used or refurbished, with real specifications, condition and damage details.</p>
          <div className="grid3">
            {["Smartphones","Accessories","Electronic Gadgets"].map((x,i)=>(
              <div key={x} className="glass card product">
                <div className="tag">CATEGORY 0{i+1}</div>
                <h3>{x}</h3>
                <p className="section-sub">Owner can publish stock, actual price, offer price, details and multiple real images.</p>
                <button className="slide" onClick={openBuy}>SLIDE TO BUY →</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="offers" className="section">
        <div className="shell grid2">
          <div>
            <p className="brand">OFFERS & EVENTS</p>
            <h2 className="section-title">Premium offers.<br/>No disturbance.</h2>
            <p className="section-sub">Owner-uploaded offers can appear as a dismissible popup and remain available in this section for customers who want to see them.</p>
          </div>
          <div className="glass card">
            <h3 style={{fontSize:30}}>Owner Controlled Ads</h3>
            <div className="info-list">
              <div className="glass info-row"><span>Popup</span><b>Optional</b></div>
              <div className="glass info-row"><span>Multiple Images</span><b>Supported</b></div>
              <div className="glass info-row"><span>Fake Information</span><b>Not Allowed</b></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <p className="brand">SIDE SERVICES</p>
          <h2 className="section-title">More than mobiles.</h2>
          <div className="grid2">
            {[
              ["SBI Insurance","Insurance-related enquiries and information. Ask details through WhatsApp."],
              ["Rubber Jobs","Questions and enquiries related to rubber tapping and workers."],
              ["Water Pumps & Motors","Durable motors and pumps with competitive pricing and owner-provided real product details."],
              ["Used Vehicles","No permanent vehicle stock. Information and assistance may be available through WhatsApp."]
            ].map(([t,d])=>(
              <div className="glass card" key={t}><h3>{t}</h3><p className="section-sub">{d}</p><a href={wa} target="_blank" className="btn btn-dark">Ask on WhatsApp</a></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell grid2">
          <div>
            <p className="brand">SHOP INFORMATION</p>
            <h2 className="section-title">Easy to visit.</h2>
            <div className="info-list">
              <div className="glass info-row"><span>Opening</span><b>8:00 AM</b></div>
              <div className="glass info-row"><span>Closing</span><b>8:00 PM</b></div>
              <div className="glass info-row"><span>Holiday</span><b>Sunday</b></div>
            </div>
            <div className="actions">
              <a href="https://maps.app.goo.gl/bKs9CdG2TAaKtRuy5?g_st=ac" target="_blank" className="btn btn-light">Get Direction</a>
              <a href={wa} target="_blank" className="btn btn-dark">6360509055</a>
            </div>
          </div>
          <div className="glass card">
            <p className="brand">PAYMENT</p>
            <h3 style={{fontSize:34}}>Scan securely with UPI</h3>
            <Image className="qr" src="/assets/payment-qr.jpg" width={500} height={700} alt="Charan Mobiles payment QR" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell grid2">
          <div>
            <p className="brand">E-BILL</p>
            <h2 className="section-title">Your bill template preserved.</h2>
            <p className="section-sub">The supplied bill design is retained as the reference template. Customers can later retrieve bills by registered phone number after the Supabase backend is connected.</p>
            <a href="#owner" className="btn btn-light">Owner Bill Management</a>
          </div>
          <Image className="ebill" src="/assets/ebill-template.png" width={900} height={1100} alt="Charan Mobiles E-Bill template" />
        </div>
      </section>

      <section id="owner" className="section">
        <div className="shell">
          <div className="glass card" style={{textAlign:"center",padding:"60px 24px"}}>
            <p className="brand">PRIVATE BACKEND</p>
            <h2 className="section-title">Owner Corner 🔒</h2>
            <p className="section-sub" style={{margin:"auto"}}>Products, offers, bills, reminders, payments, timings, colours, effects and website settings belong under secure owner-only authentication.</p>
            <div className="actions" style={{justifyContent:"center"}}>
              <a href="/owner" className="btn btn-light">Open Owner Login</a>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="shell">© {new Date().getFullYear()} CHARAN MOBILES · SMART CHOICE. SMART LIFE.</div>
      </footer>
    </main>
  );
}
