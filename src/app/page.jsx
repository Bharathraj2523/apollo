"use client"; 
import './pages.css'
import { use, useEffect, useState } from 'react';

export default function Home() {
  const [showAllExperience, setShowAllExperience] = useState(false);

  const experienceOptions = [
    { value: '5', label: '0 - 5' },
    { value: '10', label: '6 - 10' },
    { value: '15', label: '11 - 15' },
    { value: '20', label: '16 - 20' }
  ];

  const [showlang , setshowlang] = useState(false);
  const languages = [
    "English" , "Hindi" ,"Tamil" , "Telugu" , "Malayalam" , "Punjabi"
  ];

  const [showopt,setshowopt] = useState(false);
  const sortOptions = [
    'Relevance',
    'Availability',
    'Nearby',
    'low to high',
    'High to low',
    'Years of Experience'
  ];

  const [doctors, setDoctors] = useState([]);
  const [currentpagedoctors , setCurrentPagedoctors] = useState([]);
  const [initialpage , setInitialPage] = useState(0);
  const [finalpage , setFinalPage] = useState(3); 
  const [tempfilters,settempfil] = useState([]);
  const [filters, setFilters] = useState({
    mode: [],
    exp: [],
    fee: [],
    lang: [],
    facility: [],
  });
  


  useEffect(() => {
    fetch('/api/doctors')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDoctors(data);
          console.log(data);
        } else {
          console.error('Unexpected data format:', data);
        }
      })
      .catch(err => console.error('Error fetching doctors:', err));
  }, []);
  

  
  useEffect(() => {
    const source = tempfilters.length > 0 ? tempfilters : doctors;
    setCurrentPagedoctors(source.slice(initialpage, finalpage));
  }, [initialpage, finalpage, doctors , tempfilters]);

  useEffect(() => {
    console.log("Updated finalpage:", finalpage);
  }, [finalpage]);

  useEffect(() => {
      const tempfil = doctors.filter((item) =>
      filters.mode.includes(item.availability)||filters.lang.some((lange)=>item.language.includes(lange)) || filters.exp.some((expe)=> (expe - 5) <=item.experience && expe >= item.experience)||filters.fee.some((fees)=> (fees <= item.fee && (fees + 500) >item.fee))
    );
    console.log(tempfil)
    settempfil(tempfil);
  }, [filters]);
  
  const handleNext = () => {
    if (finalpage < doctors.length) {
      setInitialPage(finalpage);
      setFinalPage(finalpage + 3);
     
    }
  };


  const handlePrevious = () => {
    if (initialpage > 0) {
      setFinalPage(initialpage);
      setInitialPage(initialpage - 3); 
    }
  };

  const handleavailibility = (option) => {
    let sortedDoctors = [...doctors]; 
  
    if (option === 'low to high') {
      sortedDoctors.sort((a, b) => a.fee - b.fee); 
    } else if (option === 'High to low') {
      sortedDoctors.sort((a, b) => b.fee - a.fee); 
    }
  
    settempfil(sortedDoctors); 
    setshowopt(false); 
  };
  
  return (
    <>
      <div className='top'>
        
        <div className="top-container">
          <div id="logo-field">
            <img id='logo' src="/Screenshot 2025-04-29 120746.png" alt="Apollo" className="logo" />
            <div className="location-selector">
              <img id='location' src="/image.png" alt="loc" className="location-icon" />
              <select className="address-select">
                <option>Select Address</option>
              </select>
            </div>
          </div>

          <div className="search-container">
          <input 
              type="text" 
              placeholder="Search Doctors, Specialties, Conditions etc." 
              className="searchbar"
              onChange={(e)=>{
                let query = e.target.value.toLowerCase();
                let temp = doctors.filter((item) => 
                  item.name.toLowerCase().includes(query)
              );
              settempfil(temp);
              }}
            />
            <button className="search-button">Search</button>
          </div>

          <button className="login-button">
            <span>Login</span>
            <img src="/Screenshot 2025-04-29 232142.png" alt="login" className="login-icon" />
          </button>
        </div>

        <div className="main-nav">
          <div className="nav-items">
            <ul>
              <li>Buy Medicine</li>
              <li>Find Doctors</li>
              <li>Lab Tests</li>
              <li>Circle Membership</li>
              <li>Health Records</li>
              <li>Diabetes Reversal</li>
              <li>Buy Insurance</li>
            </ul>
          </div>
        </div>
      </div>

      <div className='main-container'>
        <div className="side-container">
          {/* Filters */}
          <div className="headings">
            <h2>Filter</h2>
            <button id="clearall">Clear All</button>
          </div>
          <hr />
          <div className="filters"></div>

          <button id="nearme">Show Doctors near me</button>

          <div className="consult">
            <h3>Mode Of Conduct</h3>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input type="checkbox" name="mode" value="offline" onChange={(e)=>{
                      if(e.target.checked){
                        setFilters((prev)=>{
                          return{
                            ...prev,
                            [e.target.name] : [...prev[e.target.name] , e.target.value]
                          }
                        })
                      }
                      else{
                        setFilters((prev)=>{
                          return{
                            ...prev,
                            [e.target.name] : prev[e.target.name].filter((val)=>val !=e.target.value)
                          }
                        })
                      }
                    }}  />
                <span className="checkmark"></span>
                Hospital Visit
              </label>
              <label className="checkbox-label">
                <input type="checkbox" name="mode" value="online" onChange={(e)=>{
                      if(e.target.checked){
                        setFilters((prev)=>{
                          return{
                            ...prev,
                            [e.target.name] : [...prev[e.target.name] , e.target.value]
                          }
                        })
                      }
                      else{
                        setFilters((prev)=>{
                          return{
                            ...prev,
                            [e.target.name] : prev[e.target.name].filter((val)=>val !=e.target.value)
                          }
                        })
                      }
                    }} />
                <span className="checkmark"></span>
                Online Consult
              </label>
            </div>

            <h3>Years of Experience</h3>
            <div className="checkbox-group">
              {experienceOptions
                .slice(0, showAllExperience ? experienceOptions.length : 3)
                .map((exp, index) => (
                  <label key={index} className="checkbox-label">
                    <input type="checkbox" name="exp" value={exp.value}onChange={(e)=>{
                      if(e.target.checked){
                        setFilters((prev)=>{
                          return{
                            ...prev,
                            [e.target.name] : [...prev[e.target.name] , e.target.value]
                          }
                        })
                      }
                      else{
                        setFilters((prev)=>{
                          return{
                            ...prev,
                            [e.target.name] : prev[e.target.name].filter((val)=>val !=e.target.value)
                          }
                        })
                      }
                    }}  />
                    <span className="checkmark"></span>
                    {exp.label}
                  </label>
                ))}

              <button
                className='see'
                type="button"
                onClick={() => setShowAllExperience((prev) => !prev)}
              >
                {showAllExperience ? 'See Less' : 'See More+'}
              </button>
            </div>
            <h3>Fees (Rupees)</h3>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input type="checkbox" name="fee" value={0} onChange={(e)=>{
                      if(e.target.checked){
                        setFilters((prev)=>{
                          return{
                            ...prev,
                            [e.target.name] : [...prev[e.target.name] , e.target.value]
                          }
                        })
                      }
                      else{
                        setFilters((prev)=>{
                          return{
                            ...prev,
                            [e.target.name] : prev[e.target.name].filter((val)=>val !=e.target.value)
                          }
                        })
                      }
                    }} />
                <span className="checkmark"></span>
                100 - 500
              </label>
              <label className="checkbox-label">
                <input type="checkbox" name="fee" value={500}  onChange={(e)=>{
                      if(e.target.checked){
                        setFilters((prev)=>{
                          return{
                            ...prev,
                            [e.target.name] : [...prev[e.target.name] , e.target.value]
                          }
                        })
                      }
                      else{
                        setFilters((prev)=>{
                          return{
                            ...prev,
                            [e.target.name] : prev[e.target.name].filter((val)=>val !=e.target.value)
                          }
                        })
                      }
                    }} />
                <span className="checkmark"></span>
                600 - 1000
              </label>
              <label className="checkbox-label">
                <input type="checkbox" name="fee" value={1000}  onChange={(e)=>{
                      if(e.target.checked){
                        setFilters((prev)=>{
                          return{
                            ...prev,
                            [e.target.name] : [...prev[e.target.name] , e.target.value]
                          }
                        })
                      }
                      else{
                        setFilters((prev)=>{
                          return{
                            ...prev,
                            [e.target.name] : prev[e.target.name].filter((val)=>val !=e.target.value)
                          }
                        })
                      }
                    }} />
                <span className="checkmark"></span>
                1000+
              </label>
            </div>
            <h3>Languages</h3>
            <div className="checkbox-group">
              {languages.slice(0, showlang ? languages.length : 3)
                .map((lang, index) => (
                  <label key={index} className="checkbox-label">
                    <input type="checkbox" name="lang" value={lang} onChange={(e)=>{
                      if(e.target.checked){
                        setFilters((prev)=>{
                          return{
                            ...prev,
                            [e.target.name] : [...prev[e.target.name] , e.target.value]
                          }
                        })
                      }
                      else{
                        setFilters((prev)=>{
                          return{
                            ...prev,
                            [e.target.name] : prev[e.target.name].filter((val)=>val !=e.target.value)
                          }
                        })
                      }
                    }} />
                    <span className="checkmark"></span>
                    {lang}
                  </label>
                ))}
              <button
                className='see'
                type="button"
                onClick={() => setshowlang((prev) => !prev)}
              >
                {showlang ? 'see Less' : 'see More'}
              </button>
            </div>
            <h3>Facility</h3>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input type="checkbox" name="facility" value="apollohospital" />
                <span className="checkmark"></span>
                Apollo Hospital
              </label>
              <label className="checkbox-label">
                <input type="checkbox" name="facility" value="clinics" />
                <span className="checkmark"></span>
                Other Clinics
              </label>
            </div>
          </div>
        </div>

        <div className='left-container'>
          <div className='three-links'>
            <a href="#">Home</a>
            <a className='gen' onClick={()=>{
              let temp = doctors.filter((item)=>
                item.specialization.some((spec)=> spec!=="General Physician")
              )
              settempfil(temp);
            }}>Doctors</a>
            <a className='gen' onClick={()=>{
              let temp = doctors.filter((item)=>
                item.specialization.some((spec)=> spec==="General Physician")
              )
              settempfil(temp);
            }}>General Physicians</a>
          </div>

          <div className='main-header'>
            <div className='main-header-name'>
              <h3>Consult General Physicians Online - Internal Medicine Specialists</h3>
            </div>

            <div className='dropdown-container'>
              <button id='options' onClick={() => setshowopt((val) => !val)}>Availability</button>
              {showopt && (
                <div className='dropdown-menu'>
                  {sortOptions.map((option, index) => (
                    <div 
                      key={index}
                      className='dropdown-item'
                      onClick={() => handleavailibility(option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="doctor-list">
            {currentpagedoctors.map((doctor, index) => (
              <div key={index} className="doctor-content">
                <div className="profile-img">
                  <img id='doc-logo' src="/Screenshot 2025-04-29 232142.png" alt="profile" />
                </div>
                <div className="profile-details">
                  <h3>{doctor.name}</h3>
                  <p>{doctor.specialization.join('/')}</p>
                  <p>{doctor.experience} years of experience</p>
                  <p>Degrees: {doctor.degrees.join(', ')}</p>
                  <p>Location: {doctor.location}</p>
                  <p>Hospital: {doctor.hospital.name} - {doctor.hospital.location}</p>
                </div>
                <div className="profile-price">
                  <h4>Consultation Fee: ₹{doctor.fee}</h4>
                  <div className="profile-buttons">
                    <button id='consult-button'>{doctor.availability === "online" ? "Consult Online" : "Visit Doc"}</button>
                  </div>
                </div>
              </div>
            ))}
            
          </div>
          <div className='paging-buttons'>
              <button className='page-button' onClick={handlePrevious}>Prev</button>
              <button className='page-button' onClick={handleNext}>Next</button>
            </div>
        </div>
      </div>
    </>
  );
}
