import React, { useState, useEffect } from 'react';
import { Home, User, Settings, LogOut, ArrowLeft, Phone, Shield, Camera, Upload, Send, MapPin } from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [currentLocation, setCurrentLocation] = useState('Detecting location...');
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [tempUserData, setTempUserData] = useState(null);

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Simulate reverse geocoding (in real app, use Google Maps API)
          setCurrentLocation('Agra, Uttar Pradesh, India');
        },
        (error) => {
          setCurrentLocation('Location not available');
        }
      );
    } else {
      setCurrentLocation('Agra, Uttar Pradesh, India'); // Default location
    }
  }, []);

  // Check if user is already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('nexoraUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
      setCurrentPage('dashboard');
    }
  }, []);

  const showSuccess = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (email && password) {
      const userData = {
        name: 'Demo User',
        email: email,
        phone: '+91 9876543210',
        role: 'citizen',
        location: currentLocation
      };
      
      setUser(userData);
      setIsLoggedIn(true);
      localStorage.setItem('nexoraUser', JSON.stringify(userData));
      setCurrentPage('dashboard');
      showSuccess('Login successful!');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const phone = e.target.phone.value;
    const password = e.target.password.value;
    const role = e.target.role.value;

    if (name && email && phone && password && role) {
      // Store temporary user data
      setTempUserData({ name, email, phone, role, location: currentLocation });
      
      // Show OTP modal
      setShowOTPModal(true);
      showSuccess('OTP sent to your phone number!');
    }
  };

  const verifyOTP = () => {
    // Simulate OTP verification (in real app, verify with backend)
    if (otpCode === '1234' || otpCode.length === 4) {
      const userData = tempUserData;
      
      setUser(userData);
      setIsLoggedIn(true);
      localStorage.setItem('nexoraUser', JSON.stringify(userData));
      setShowOTPModal(false);
      setOtpCode('');
      setTempUserData(null);
      setCurrentPage('dashboard');
      showSuccess('Registration successful!');
    } else {
      showSuccess('Invalid OTP! Try 1234 for demo');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('nexoraUser');
    setCurrentPage('home');
    showSuccess('Logged out successfully!');
  };

  // OTP Modal Component
  const OTPModal = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '32px',
        width: '100%',
        maxWidth: '400px',
        margin: '20px'
      }}>
        <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>
          📱 Verify OTP
        </h3>
        <p style={{ textAlign: 'center', marginBottom: '24px', color: '#6b7280' }}>
          Enter the 4-digit OTP sent to {tempUserData?.phone}
        </p>
        <input
          type="text"
          value={otpCode}
          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
          placeholder="Enter 4-digit OTP"
          style={{
            ...inputStyle,
            textAlign: 'center',
            fontSize: '24px',
            letterSpacing: '8px',
            marginBottom: '20px'
          }}
          maxLength="4"
        />
        <p style={{ fontSize: '14px', color: '#6b7280', textAlign: 'center', marginBottom: '20px' }}>
          Demo OTP: 1234
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => {
              setShowOTPModal(false);
              setOtpCode('');
              setTempUserData(null);
            }}
            style={{
              ...primaryButtonStyle,
              backgroundColor: '#6b7280',
              flex: 1
            }}
          >
            Cancel
          </button>
          <button
            onClick={verifyOTP}
            style={{
              ...primaryButtonStyle,
              flex: 1
            }}
          >
            Verify OTP
          </button>
        </div>
      </div>
    </div>
  );

  // Header Component
  const Header = () => (
    <header style={{
      backgroundColor: 'white',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      padding: '16px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          background: 'linear-gradient(to right, #22c55e, #3b82f6)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0
        }}>
          🌟 Nexora
        </h1>
        {isLoggedIn && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
            <MapPin size={16} />
            <span>{user?.location || currentLocation}</span>
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <button onClick={() => setCurrentPage('home')} style={navButtonStyle}>
          <Home size={16} /> Home
        </button>
        
        {isLoggedIn && (
          <>
            <button onClick={() => setCurrentPage('dashboard')} style={navButtonStyle}>
              📊 Dashboard
            </button>
            <button onClick={() => setCurrentPage('profile')} style={navButtonStyle}>
              <User size={16} /> Profile
            </button>
            <button onClick={() => setCurrentPage('settings')} style={navButtonStyle}>
              <Settings size={16} /> Settings
            </button>
            <button onClick={handleLogout} style={primaryButtonStyle}>
              <LogOut size={16} /> Logout
            </button>
          </>
        )}
        
        {!isLoggedIn && (
          <button onClick={() => setCurrentPage('login')} style={primaryButtonStyle}>
            Login
          </button>
        )}
      </div>
    </header>
  );

  // Home Page
  const HomePage = () => (
    <div style={pageContainerStyle}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ 
          fontSize: '48px', 
          fontWeight: 'bold', 
          marginBottom: '16px',
          background: 'linear-gradient(to right, #22c55e, #3b82f6)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Welcome to Nexora
        </h1>
        <p style={{ fontSize: '20px', color: '#6b7280', marginBottom: '16px' }}>
          एकीकृत डिजिटल प्लेटफॉर्म - Empowering India's Future
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
          <MapPin size={16} style={{ color: '#6b7280' }} />
          <span style={{ color: '#6b7280' }}>{currentLocation}</span>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '24px',
          marginBottom: '32px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            color: 'white',
            padding: '32px',
            borderRadius: '16px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌾</div>
            <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
              कृषि (Agriculture)
            </h3>
            <p>Smart farming, IoT sensors, market access</p>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            color: 'white',
            padding: '32px',
            borderRadius: '16px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎓</div>
            <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
              शिक्षा (Education)
            </h3>
            <p>Skill verification, career guidance</p>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            color: 'white',
            padding: '32px',
            borderRadius: '16px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏛️</div>
            <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
              नागरिक सेवा (Civic)
            </h3>
            <p>Grievance redressal, emergency services</p>
          </div>
        </div>
        
        <button onClick={() => setCurrentPage('register')} style={{
          ...primaryButtonStyle,
          fontSize: '18px',
          padding: '16px 32px'
        }}>
          🚀 Get Started
        </button>
      </div>
    </div>
  );

  // Login Page
  const LoginPage = () => (
    <div style={authContainerStyle}>
      <h2 style={authHeaderStyle}>🔐 Login to Nexora</h2>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
        <MapPin size={16} style={{ color: '#6b7280' }} />
        <span style={{ color: '#6b7280', fontSize: '14px' }}>{currentLocation}</span>
      </div>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={labelStyle}>📧 Email</label>
          <input name="email" type="email" placeholder="Enter your email" style={inputStyle} required />
        </div>
        <div>
          <label style={labelStyle}>🔒 Password</label>
          <input name="password" type="password" placeholder="Enter your password" style={inputStyle} required />
        </div>
        <button type="submit" style={{ ...primaryButtonStyle, width: '100%' }}>
          Login
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        Don't have an account? 
        <button onClick={() => setCurrentPage('register')} style={linkButtonStyle}>
          Register here
        </button>
      </p>
    </div>
  );

  // Registration Page
  const RegisterPage = () => (
    <div style={authContainerStyle}>
      <h2 style={authHeaderStyle}>✍️ Register for Nexora</h2>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
        <MapPin size={16} style={{ color: '#6b7280' }} />
        <span style={{ color: '#6b7280', fontSize: '14px' }}>{currentLocation}</span>
      </div>
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={labelStyle}>👤 Full Name</label>
          <input name="name" type="text" placeholder="Enter your full name" style={inputStyle} required />
        </div>
        <div>
          <label style={labelStyle}>📧 Email</label>
          <input name="email" type="email" placeholder="Enter your email" style={inputStyle} required />
        </div>
        <div>
          <label style={labelStyle}>📱 Phone Number (For OTP)</label>
          <input name="phone" type="tel" placeholder="Enter your phone number" style={inputStyle} required />
        </div>
        <div>
          <label style={labelStyle}>🔒 Password</label>
          <input name="password" type="password" placeholder="Create a password" style={inputStyle} required />
        </div>
        <div>
          <label style={labelStyle}>💼 Role</label>
          <select name="role" style={inputStyle} required>
            <option value="">Select your role</option>
            <option value="farmer">🌾 Farmer (किसान)</option>
            <option value="student">🎓 Student (छात्र)</option>
            <option value="citizen">👥 Citizen (नागरिक)</option>
            <option value="business">💼 Business (व्यापारी)</option>
          </select>
        </div>
        <button type="submit" style={{ ...primaryButtonStyle, width: '100%' }}>
          📱 Send OTP & Register
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        Already have an account? 
        <button onClick={() => setCurrentPage('login')} style={linkButtonStyle}>
          Login here
        </button>
      </p>
    </div>
  );

  // Dashboard Page
  const DashboardPage = () => (
    <div style={pageContainerStyle}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
          📊 Dashboard
        </h2>
        <p style={{ color: '#6b7280', fontSize: '18px' }}>
          Welcome back, <strong>{user?.name || 'User'}</strong>! 👋
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
          <MapPin size={16} style={{ color: '#6b7280' }} />
          <span style={{ color: '#6b7280', fontSize: '14px' }}>{user?.location || currentLocation}</span>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '24px' 
      }}>
        <div 
          onClick={() => setCurrentPage('agriculture')}
          style={{
            ...moduleCardStyle,
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌾</div>
          <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
            कृषि (Agriculture)
          </h3>
          <p style={{ marginBottom: '16px' }}>Smart farming solutions</p>
          <div style={statusBadgeStyle}>✅ Active</div>
        </div>

        <div 
          onClick={() => setCurrentPage('education')}
          style={{
            ...moduleCardStyle,
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎓</div>
          <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
            शिक्षा (Education)
          </h3>
          <p style={{ marginBottom: '16px' }}>Skill verification & learning</p>
          <div style={statusBadgeStyle}>✅ Active</div>
        </div>

        <div 
          onClick={() => setCurrentPage('civic')}
          style={{
            ...moduleCardStyle,
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏛️</div>
          <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
            नागरिक सेवा (Civic)
          </h3>
          <p style={{ marginBottom: '16px' }}>Government services</p>
          <div style={statusBadgeStyle}>✅ Active</div>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ marginTop: '32px', background: '#f9fafb', padding: '24px', borderRadius: '12px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>📈 Quick Stats</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e' }}>3</div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Active Farms</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>12</div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Civic Reports</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>5</div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Certificates</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>4.8</div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>User Rating</div>
          </div>
        </div>
      </div>
    </div>
  );

  /// Agriculture Module (Enhanced with Hardware & Software Sub-modules)
const AgricultureModule = () => {
  const [currentSubModule, setCurrentSubModule] = useState('main');
  const [irrigationOn, setIrrigationOn] = useState(false);
  const [sprayingActive, setSprayingActive] = useState(false);
  const [machineMode, setMachineMode] = useState('manual');
  const [sensorData, setSensorData] = useState({
    soilMoisture: 65,
    temperature: 28,
    humidity: 72,
    cropHeight: 45
  });

  const handleMachineControl = (action) => {
    switch(action) {
      case 'spray':
        setSprayingActive(!sprayingActive);
        showSuccess(sprayingActive ? 'Spraying stopped' : 'Multipurpose machine spraying started');
        break;
      case 'irrigation':
        setIrrigationOn(!irrigationOn);
        showSuccess(irrigationOn ? 'Irrigation turned OFF' : 'Smart irrigation activated');
        break;
      case 'seeding':
        showSuccess('Automatic seeding process initiated');
        break;
      case 'monitoring':
        showSuccess('Crop monitoring sensors activated');
        break;
      default:
        showSuccess('Machine operation completed');
    }
  };

  if (currentSubModule === 'hardware') {
    return (
      <div style={pageContainerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
          <button onClick={() => setCurrentSubModule('main')} style={backButtonStyle}>
            <ArrowLeft size={16} /> Back to Agriculture
          </button>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginLeft: '16px' }}>
            🔧 Hardware Sub-module
          </h2>
        </div>

        {/* Hardware Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px',
          marginBottom: '32px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #f97316, #ea580c)',
            color: 'white',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🌡️</div>
            <h3 style={{ marginBottom: '4px' }}>Temperature</h3>
            <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{sensorData.temperature}°C</p>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
            color: 'white',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>💧</div>
            <h3 style={{ marginBottom: '4px' }}>Soil Moisture</h3>
            <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{sensorData.soilMoisture}%</p>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            color: 'white',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📏</div>
            <h3 style={{ marginBottom: '4px' }}>Crop Height</h3>
            <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{sensorData.cropHeight} cm</p>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            color: 'white',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔋</div>
            <h3 style={{ marginBottom: '4px' }}>Battery</h3>
            <p style={{ fontSize: '20px', fontWeight: 'bold' }}>85%</p>
          </div>
        </div>

        {/* Multipurpose Machine Controls */}
        <div style={sectionCardStyle}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
            🚜 Multipurpose Agriculture Machine
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <button 
              onClick={() => handleMachineControl('spray')}
              style={{
                ...primaryButtonStyle,
                backgroundColor: sprayingActive ? '#ef4444' : '#22c55e',
                flexDirection: 'column',
                padding: '20px',
                height: 'auto'
              }}
            >
              <span style={{ fontSize: '24px', marginBottom: '8px' }}>💨</span>
              <span>{sprayingActive ? 'Stop Spraying' : 'Start Pesticide Spraying'}</span>
              <small style={{ opacity: 0.8 }}>कीटनाशक छिड़काव</small>
            </button>

            <button 
              onClick={() => handleMachineControl('seeding')}
              style={{
                ...primaryButtonStyle,
                backgroundColor: '#3b82f6',
                flexDirection: 'column',
                padding: '20px',
                height: 'auto'
              }}
            >
              <span style={{ fontSize: '24px', marginBottom: '8px' }}>🌱</span>
              <span>Auto Seeding</span>
              <small style={{ opacity: 0.8 }}>स्वचालित बीज बुवाई</small>
            </button>

            <button 
              onClick={() => handleMachineControl('irrigation')}
              style={{
                ...primaryButtonStyle,
                backgroundColor: irrigationOn ? '#ef4444' : '#06b6d4',
                flexDirection: 'column',
                padding: '20px',
                height: 'auto'
              }}
            >
              <span style={{ fontSize: '24px', marginBottom: '8px' }}>🚿</span>
              <span>{irrigationOn ? 'Stop Irrigation' : 'Smart Irrigation'}</span>
              <small style={{ opacity: 0.8 }}>स्मार्ट सिंचाई</small>
            </button>

            <button 
              onClick={() => handleMachineControl('monitoring')}
              style={{
                ...primaryButtonStyle,
                backgroundColor: '#8b5cf6',
                flexDirection: 'column',
                padding: '20px',
                height: 'auto'
              }}
            >
              <span style={{ fontSize: '24px', marginBottom: '8px' }}>📡</span>
              <span>Sensor Monitoring</span>
              <small style={{ opacity: 0.8 }}>सेंसर निगरानी</small>
            </button>
          </div>
        </div>

        {/* IoT Components */}
        <div style={sectionCardStyle}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
            🔧 Hardware Components Status
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div style={{ padding: '12px', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #0ea5e9' }}>
              <span style={{ fontWeight: '600' }}>🔌 Arduino Uno</span>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>Status: Active</p>
            </div>
            <div style={{ padding: '12px', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #0ea5e9' }}>
              <span style={{ fontWeight: '600' }}>🔋 12V Battery</span>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>Charge: 85%</p>
            </div>
            <div style={{ padding: '12px', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #0ea5e9' }}>
              <span style={{ fontWeight: '600' }}>☀️ Solar Panel</span>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>Output: 12V</p>
            </div>
            <div style={{ padding: '12px', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #0ea5e9' }}>
              <span style={{ fontWeight: '600' }}>💧 Water Pump</span>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>135PSI Ready</p>
            </div>
            <div style={{ padding: '12px', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #0ea5e9' }}>
              <span style={{ fontWeight: '600' }}>📡 Soil Sensor</span>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>Reading: {sensorData.soilMoisture}%</p>
            </div>
            <div style={{ padding: '12px', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #0ea5e9' }}>
              <span style={{ fontWeight: '600' }}>⚙️ Motor Driver</span>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>L298N Active</p>
            </div>
          </div>
        </div>

        {/* Machine Specifications */}
        <div style={sectionCardStyle}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
            📋 Machine Specifications
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            <div>
              <h4 style={{ fontWeight: '600', marginBottom: '8px' }}>💰 Cost Details</h4>
              <p>Making Cost: <strong>₹9,000</strong></p>
              <p>Market Price: <strong>₹15,000</strong></p>
            </div>
            <div>
              <h4 style={{ fontWeight: '600', marginBottom: '8px' }}>⚡ Power System</h4>
              <p>Solar Powered: <strong>12V System</strong></p>
              <p>Battery Backup: <strong>8-10 Hours</strong></p>
            </div>
            <div>
              <h4 style={{ fontWeight: '600', marginBottom: '8px' }}>📏 Coverage Area</h4>
              <p>Spraying Width: <strong>10-15 feet</strong></p>
              <p>Efficiency: <strong>5x faster</strong></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentSubModule === 'software') {
    return (
      <div style={pageContainerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
          <button onClick={() => setCurrentSubModule('main')} style={backButtonStyle}>
            <ArrowLeft size={16} /> Back to Agriculture
          </button>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginLeft: '16px' }}>
            💻 Software Sub-module
          </h2>
        </div>

        {/* AI Analytics Dashboard */}
        <div style={sectionCardStyle}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
            🤖 AI-Powered Analytics
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '8px' }}>🌾 Crop Health AI</h4>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>Analyzing crop patterns and predicting diseases</p>
              <div style={{ marginTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px' }}>Health Score</span>
                  <span style={{ fontSize: '12px', fontWeight: '600' }}>87%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px' }}>
                  <div style={{ width: '87%', height: '100%', background: '#22c55e', borderRadius: '3px' }}></div>
                </div>
              </div>
            </div>

            <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '8px' }}>📊 Yield Prediction</h4>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>Expected harvest based on current conditions</p>
              <div style={{ marginTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px' }}>Predicted Yield</span>
                  <span style={{ fontSize: '12px', fontWeight: '600' }}>4.2 tons/acre</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px' }}>
                  <div style={{ width: '84%', height: '100%', background: '#3b82f6', borderRadius: '3px' }}></div>
                </div>
              </div>
            </div>

            <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '8px' }}>🌤️ Weather AI</h4>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>Smart weather predictions for farming</p>
              <div style={{ marginTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px' }}>Rain Probability</span>
                  <span style={{ fontSize: '12px', fontWeight: '600' }}>23%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px' }}>
                  <div style={{ width: '23%', height: '100%', background: '#06b6d4', borderRadius: '3px' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Market Intelligence */}
        <div style={sectionCardStyle}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
            📈 Market Intelligence & Pricing
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '16px', background: 'linear-gradient(135deg, #22c55e, #16a34a)', borderRadius: '12px', color: 'white' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '8px' }}>🌾 Current Market Prices</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Wheat</span>
                <span style={{ fontWeight: '600' }}>₹2,100/quintal ↗️</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Rice</span>
                <span style={{ fontWeight: '600' }}>₹3,200/quintal ↗️</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Corn</span>
                <span style={{ fontWeight: '600' }}>₹1,850/quintal ↘️</span>
              </div>
            </div>

            <div style={{ padding: '16px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', borderRadius: '12px', color: 'white' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '8px' }}>📊 Price Predictions</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Next Week</span>
                <span style={{ fontWeight: '600' }}>+5% increase</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Next Month</span>
                <span style={{ fontWeight: '600' }}>+12% increase</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Best Sell Time</span>
                <span style={{ fontWeight: '600' }}>2 weeks</span>
              </div>
            </div>

            <div style={{ padding: '16px', background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', borderRadius: '12px', color: 'white' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '8px' }}>🎯 Smart Recommendations</h4>
              <p style={{ fontSize: '14px', marginBottom: '8px' }}>• Hold wheat for 2 weeks for better price</p>
              <p style={{ fontSize: '14px', marginBottom: '8px' }}>• Sell rice immediately - peak price</p>
              <p style={{ fontSize: '14px' }}>• Consider corn alternatives</p>
            </div>
          </div>
        </div>

        {/* Data Analytics */}
        <div style={sectionCardStyle}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
            📊 Farm Data Analytics
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <button 
              onClick={() => showSuccess('Generating detailed crop analytics report...')}
              style={{
                ...primaryButtonStyle,
                backgroundColor: '#22c55e',
                flexDirection: 'column',
                padding: '20px',
                height: 'auto'
              }}
            >
              <span style={{ fontSize: '24px', marginBottom: '8px' }}>📈</span>
              <span>Crop Analytics</span>
              <small style={{ opacity: 0.8 }}>फसल विश्लेषण</small>
            </button>

            <button 
              onClick={() => showSuccess('Soil health report generated!')}
              style={{
                ...primaryButtonStyle,
                backgroundColor: '#3b82f6',
                flexDirection: 'column',
                padding: '20px',
                height: 'auto'
              }}
            >
              <span style={{ fontSize: '24px', marginBottom: '8px' }}>🌱</span>
              <span>Soil Analysis</span>
              <small style={{ opacity: 0.8 }}>मिट्टी विश्लेषण</small>
            </button>

            <button 
              onClick={() => showSuccess('Water usage optimization report ready!')}
              style={{
                ...primaryButtonStyle,
                backgroundColor: '#06b6d4',
                flexDirection: 'column',
                padding: '20px',
                height: 'auto'
              }}
            >
              <span style={{ fontSize: '24px', marginBottom: '8px' }}>💧</span>
              <span>Water Analytics</span>
              <small style={{ opacity: 0.8 }}>जल विश्लेषण</small>
            </button>

            <button 
              onClick={() => showSuccess('Financial profit/loss analysis completed!')}
              style={{
                ...primaryButtonStyle,
                backgroundColor: '#8b5cf6',
                flexDirection: 'column',
                padding: '20px',
                height: 'auto'
              }}
            >
              <span style={{ fontSize: '24px', marginBottom: '8px' }}>💰</span>
              <span>Financial Report</span>
              <small style={{ opacity: 0.8 }}>वित्तीय रिपोर्ट</small>
            </button>
          </div>
        </div>

        {/* Smart Recommendations */}
        <div style={sectionCardStyle}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
            🎯 AI Smart Recommendations
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '12px', background: '#dcfce7', borderRadius: '8px', border: '1px solid #22c55e' }}>
              <span style={{ fontWeight: '600', color: '#15803d' }}>🌱 Optimal Seeding Time:</span>
              <span style={{ color: '#374151', marginLeft: '8px' }}>Next 3-5 days based on weather patterns</span>
            </div>
            <div style={{ padding: '12px', background: '#dbeafe', borderRadius: '8px', border: '1px solid #3b82f6' }}>
              <span style={{ fontWeight: '600', color: '#1d4ed8' }}>💧 Irrigation Schedule:</span>
              <span style={{ color: '#374151', marginLeft: '8px' }}>Reduce by 20% - soil moisture sufficient</span>
            </div>
            <div style={{ padding: '12px', background: '#fef3c7', borderRadius: '8px', border: '1px solid #f59e0b' }}>
              <span style={{ fontWeight: '600', color: '#d97706' }}>🦠 Disease Alert:</span>
              <span style={{ color: '#374151', marginLeft: '8px' }}>Low risk detected - continue monitoring</span>
            </div>
            <div style={{ padding: '12px', background: '#fce7f3', borderRadius: '8px', border: '1px solid #ec4899' }}>
              <span style={{ fontWeight: '600', color: '#be185d' }}>💰 Market Timing:</span>
              <span style={{ color: '#374151', marginLeft: '8px' }}>Hold harvest for 2 weeks for 8% better price</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Agriculture Module with Sub-module Selection
  return (
    <div style={pageContainerStyle}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
        <button onClick={() => setCurrentPage('dashboard')} style={backButtonStyle}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginLeft: '16px' }}>
          🌾 Agriculture Module
        </h2>
      </div>

      {/* Quick Stats Overview */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '24px',
        marginBottom: '32px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #f97316, #ea580c)',
          color: 'white',
          padding: '24px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🌡️</div>
          <h3 style={{ marginBottom: '8px' }}>Temperature</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold' }}>28°C</p>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
          color: 'white',
          padding: '24px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>💧</div>
          <h3 style={{ marginBottom: '8px' }}>Soil Moisture</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold' }}>65%</p>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
          color: 'white',
          padding: '24px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>💰</div>
          <h3 style={{ marginBottom: '8px' }}>Market Price</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold' }}>₹2,500/kg</p>
        </div>
      </div>

      {/* Sub-modules Selection */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: '24px',
        marginBottom: '32px'
      }}>
        <div 
          onClick={() => setCurrentSubModule('hardware')}
          style={{
            ...moduleCardStyle,
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            cursor: 'pointer'
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔧</div>
          <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
            Hardware Sub-module
          </h3>
          <p style={{ marginBottom: '16px' }}>Multipurpose machine controls, IoT sensors, physical operations</p>
          <div style={statusBadgeStyle}>🚜 Machine Ready</div>
        </div>

        <div 
          onClick={() => setCurrentSubModule('software')}
          style={{
            ...moduleCardStyle,
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            cursor: 'pointer'
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💻</div>
          <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
            Software Sub-module
          </h3>
          <p style={{ marginBottom: '16px' }}>AI analytics, market intelligence, data insights</p>
          <div style={statusBadgeStyle}>🤖 AI Active</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={sectionCardStyle}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
          ⚡ Quick Actions
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '12px' 
        }}>
          <button 
            onClick={() => {
              setIrrigationOn(!irrigationOn);
              showSuccess(irrigationOn ? 'Irrigation turned OFF' : 'Smart irrigation activated');
            }}
            style={{
              ...primaryButtonStyle,
              backgroundColor: irrigationOn ? '#ef4444' : '#3b82f6'
            }}
          >
            {irrigationOn ? '🔴 Stop Irrigation' : '🔵 Start Irrigation'}
          </button>
          <button 
            onClick={() => showSuccess('Weather forecast: Clear skies, perfect for farming!')}
            style={{
              ...primaryButtonStyle,
              backgroundColor: '#f59e0b'
            }}
          >
            🌤️ Weather Alert
          </button>
          <button 
            onClick={() => showSuccess('Market prices updated! Check Software module for details.')}
            style={{
              ...primaryButtonStyle,
              backgroundColor: '#22c55e'
            }}
          >
            📈 Market Update
          </button>
          <button 
            onClick={() => showSuccess('Running comprehensive farm diagnostics...')}
            style={{
              ...primaryButtonStyle,
              backgroundColor: '#8b5cf6'
            }}
          >
            🔍 System Check
          </button>
        </div>
      </div>

      {/* Traditional Market Access (keeping existing feature) */}
      <div style={sectionCardStyle}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
          🛒 Market Access
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={marketItemStyle}>
            <span>🌾 Wheat - ₹2,100/quintal</span>
            <button onClick={() => showSuccess('Wheat sale request submitted!')} style={sellButtonStyle}>
              Sell Now
            </button>
          </div>
          <div style={marketItemStyle}>
            <span>🍚 Rice - ₹3,200/quintal</span>
            <button onClick={() => showSuccess('Rice sale request submitted!')} style={sellButtonStyle}>
              Sell Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

  // Education Module (keeping existing code)
  const EducationModule = () => (
    <div style={pageContainerStyle}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
        <button onClick={() => setCurrentPage('dashboard')} style={backButtonStyle}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginLeft: '16px' }}>
          🎓 Education Module
        </h2>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '24px' 
      }}>
        <div style={sectionCardStyle}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
            📜 Skill Verification
          </h3>
          <button 
            onClick={() => showSuccess('Certificate verification completed!')}
            style={primaryButtonStyle}
          >
            <Upload size={16} /> 📤 Upload & Verify Certificate
          </button>
        </div>

        <div style={sectionCardStyle}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
            📚 Available Courses
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={courseItemStyle}>
              <div>
                <h4 style={{ fontWeight: '600' }}>📱 Digital Marketing</h4>
                <p style={{ color: '#6b7280' }}>Duration: 3 months</p>
              </div>
              <button 
                onClick={() => showSuccess('Enrolled in Digital Marketing!')}
                style={enrollButtonStyle}
              >
                Enroll
              </button>
            </div>
            <div style={courseItemStyle}>
              <div>
                <h4 style={{ fontWeight: '600' }}>💻 Web Development</h4>
                <p style={{ color: '#6b7280' }}>Duration: 6 months</p>
              </div>
              <button 
                onClick={() => showSuccess('Enrolled in Web Development!')}
                style={enrollButtonStyle}
              >
                Enroll
              </button>
            </div>
          </div>
        </div>

        <div style={{ ...sectionCardStyle, gridColumn: '1 / -1' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
            🎓 Scholarships
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '16px' 
          }}>
            <div style={scholarshipItemStyle}>
              <span>🏆 PM Scholarship - Apply Now</span>
              <button 
                onClick={() => showSuccess('Applied for PM Scholarship!')}
                style={applyButtonStyle}
              >
                Apply
              </button>
            </div>
            <div style={scholarshipItemStyle}>
              <span>⭐ Merit Scholarship - Apply Now</span>
              <button 
                onClick={() => showSuccess('Applied for Merit Scholarship!')}
                style={applyButtonStyle}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Civic Services Module (Enhanced with CivicEye Features)
const CivicModule = () => {
  const [currentSubModule, setCurrentSubModule] = useState('main');
  const [grievanceText, setGrievanceText] = useState('');
  const [complaints, setComplaints] = useState([
    { id: 'GR001', issue: 'Road Repair', status: 'In Progress', confidence: 87, location: 'Agra Main Road', votes: 15 },
    { id: 'GR002', issue: 'Water Supply', status: 'Resolved', confidence: 95, location: 'Sector 12', votes: 23 },
    { id: 'GR003', issue: 'Street Light', status: 'Verified', confidence: 92, location: 'Civil Lines', votes: 8 }
  ]);
  const [userReputation, setUserReputation] = useState(78);
  const [selectedIssueType, setSelectedIssueType] = useState('');
  const [issueLocation, setIssueLocation] = useState('');

  const issueTypes = [
    { id: 'pothole', label: '🕳️ Pothole/Road Damage', points: 10 },
    { id: 'garbage', label: '🗑️ Illegal Dumping', points: 8 },
    { id: 'streetlight', label: '💡 Broken Street Light', points: 5 },
    { id: 'drainage', label: '🌊 Sewage/Drainage Issue', points: 12 },
    { id: 'traffic', label: '🚦 Broken Traffic Light', points: 15 },
    { id: 'water', label: '💧 Water Supply Problem', points: 10 },
    { id: 'other', label: '📝 Other Issue', points: 5 }
  ];

  const submitAdvancedGrievance = () => {
    if (grievanceText.trim() && selectedIssueType && issueLocation) {
      const newComplaint = {
        id: `GR${String(complaints.length + 1).padStart(3, '0')}`,
        issue: grievanceText.substring(0, 30) + '...',
        status: 'AI Verifying',
        confidence: Math.floor(Math.random() * 20) + 80, // 80-100
        location: issueLocation,
        votes: 1,
        type: selectedIssueType,
        reportedBy: user?.name || 'User'
      };
      
      setComplaints([newComplaint, ...complaints]);
      setGrievanceText('');
      setSelectedIssueType('');
      setIssueLocation('');
      
      // Simulate AI verification process
      setTimeout(() => {
        setComplaints(prev => prev.map(c => 
          c.id === newComplaint.id ? {...c, status: 'Verified', confidence: 94} : c
        ));
        showSuccess('🤖 AI Verification completed! Report is now public.');
      }, 3000);
      
      // Increase user reputation
      const points = issueTypes.find(t => t.id === selectedIssueType)?.points || 5;
      setUserReputation(prev => prev + points);
      
      showSuccess(`📝 CivicEye report submitted! +${points} reputation points earned.`);
    }
  };

  const voteOnReport = (reportId) => {
    setComplaints(prev => prev.map(c => 
      c.id === reportId ? {...c, votes: c.votes + 1} : c
    ));
    setUserReputation(prev => prev + 2);
    showSuccess('✅ Vote submitted! +2 reputation points earned.');
  };

  if (currentSubModule === 'reporting') {
    return (
      <div style={pageContainerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
          <button onClick={() => setCurrentSubModule('main')} style={backButtonStyle}>
            <ArrowLeft size={16} /> Back to Civic Services
          </button>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginLeft: '16px' }}>
            📱 Citizen Reporting & Engagement
          </h2>
        </div>

        {/* User Reputation Dashboard */}
        <div style={sectionCardStyle}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
            🏆 Your CivicEye Profile
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
            <div style={{ textAlign: 'center', padding: '16px', background: '#f0f9ff', borderRadius: '12px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>{userReputation}</div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Reputation Score</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', background: '#f0fdf4', borderRadius: '12px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e' }}>{complaints.filter(c => c.reportedBy === user?.name).length}</div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Reports Filed</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', background: '#fefce8', borderRadius: '12px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#eab308' }}>
                {userReputation >= 90 ? 'Gold' : userReputation >= 60 ? 'Silver' : 'Bronze'}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Citizen Badge</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', background: '#fdf2f8', borderRadius: '12px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ec4899' }}>Level {Math.floor(userReputation / 20) + 1}</div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Civic Level</div>
            </div>
          </div>
        </div>

        {/* Advanced Grievance Filing */}
        <div style={sectionCardStyle}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
            📝 Report Civic Issue (CivicEye)
          </h3>
          
          {/* Issue Type Selection */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
              🏷️ Issue Type
            </label>
            <select 
              value={selectedIssueType}
              onChange={(e) => setSelectedIssueType(e.target.value)}
              style={{
                ...inputStyle,
                marginBottom: '8px'
              }}
            >
              <option value="">Select issue type...</option>
              {issueTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.label} (+{type.points} points)
                </option>
              ))}
            </select>
          </div>

          {/* Location Input */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
              📍 Location
            </label>
            <input 
              type="text"
              value={issueLocation}
              onChange={(e) => setIssueLocation(e.target.value)}
              placeholder="Enter specific location (e.g., Main Road near City Mall)"
              style={inputStyle}
            />
          </div>

          {/* Issue Description */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
              📄 Issue Description
            </label>
            <textarea 
              value={grievanceText}
              onChange={(e) => setGrievanceText(e.target.value)}
              placeholder="Describe the issue in detail... (AI will analyze and verify)"
              rows="4"
              style={{
                ...inputStyle,
                resize: 'vertical',
                minHeight: '100px'
              }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button style={{ ...primaryButtonStyle, backgroundColor: '#6b7280' }}>
              <Camera size={16} /> 📷 Add Photo Evidence
            </button>
            <button style={{ ...primaryButtonStyle, backgroundColor: '#8b5cf6' }}>
              📍 Auto-Detect Location
            </button>
            <button onClick={submitAdvancedGrievance} style={primaryButtonStyle}>
              <Send size={16} /> 🚀 Submit to CivicEye
            </button>
          </div>

          {/* AI Features Info */}
          <div style={{ marginTop: '16px', padding: '12px', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #3b82f6' }}>
            <h4 style={{ fontWeight: '600', color: '#1d4ed8', marginBottom: '8px' }}>🤖 AI-Powered Features:</h4>
            <ul style={{ fontSize: '14px', color: '#374151', paddingLeft: '20px' }}>
              <li>Automatic content verification and spam detection</li>
              <li>Issue type classification with confidence scoring</li>
              <li>Duplicate report detection and merging</li>
              <li>Reputation-based priority scoring</li>
            </ul>
          </div>
        </div>

        {/* Community Reporting Feed */}
        <div style={sectionCardStyle}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
            🌍 Community Issues Feed
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {complaints.map((complaint) => (
              <div key={complaint.id} style={{
                padding: '16px',
                background: 'white',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '600' }}>{complaint.issue}</span>
                      <span style={{
                        fontSize: '12px',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        backgroundColor: complaint.status === 'Resolved' ? '#22c55e' : 
                                       complaint.status === 'In Progress' ? '#f59e0b' : 
                                       complaint.status === 'Verified' ? '#3b82f6' : '#8b5cf6',
                        color: 'white'
                      }}>
                        {complaint.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                      📍 {complaint.location} • #{complaint.id}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>
                        🤖 AI Confidence: {complaint.confidence}%
                      </span>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>
                        👥 {complaint.votes} votes
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => voteOnReport(complaint.id)}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#22c55e',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    👍 Support (+2 pts)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gamification Leaderboard */}
        <div style={sectionCardStyle}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
            🏅 Community Leaderboard
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#fef3c7', borderRadius: '8px' }}>
              <span>🥇 Rajesh Kumar</span>
              <span style={{ fontWeight: '600' }}>156 points</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#e5e7eb', borderRadius: '8px' }}>
              <span>🥈 Priya Sharma</span>
              <span style={{ fontWeight: '600' }}>134 points</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#fed7aa', borderRadius: '8px' }}>
              <span>🥉 Amit Singh</span>
              <span style={{ fontWeight: '600' }}>98 points</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#dbeafe', borderRadius: '8px' }}>
              <span>4️⃣ {user?.name || 'You'}</span>
              <span style={{ fontWeight: '600' }}>{userReputation} points</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentSubModule === 'ai-tracking') {
    return (
      <div style={pageContainerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
          <button onClick={() => setCurrentSubModule('main')} style={backButtonStyle}>
            <ArrowLeft size={16} /> Back to Civic Services
          </button>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginLeft: '16px' }}>
            🤖 AI Verification & Municipal Tracking
          </h2>
        </div>

        {/* AI Verification Dashboard */}
        <div style={sectionCardStyle}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
            🧠 AI Verification System
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ textAlign: 'center', padding: '20px', background: '#f0fdf4', borderRadius: '12px' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#22c55e', marginBottom: '8px' }}>94.2%</div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Verification Accuracy</div>
            </div>
            <div style={{ textAlign: 'center', padding: '20px', background: '#fef3c7', borderRadius: '12px' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '8px' }}>156</div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Reports Processed</div>
            </div>
            <div style={{ textAlign: 'center', padding: '20px', background: '#fef2f2', borderRadius: '12px' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ef4444', marginBottom: '8px' }}>12</div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Spam Detected</div>
            </div>
            <div style={{ textAlign: 'center', padding: '20px', background: '#f0f9ff', borderRadius: '12px' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '8px' }}>2.3s</div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Avg Processing Time</div>
            </div>
          </div>
        </div>

        {/* AI Models Performance */}
        <div style={sectionCardStyle}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
            ⚙️ AI Models Performance
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '12px' }}>🔍 Content Verification Model</h4>
              <div style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '14px' }}>ResNet-50 Accuracy</span>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>96.8%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px' }}>
                  <div style={{ width: '96.8%', height: '100%', background: '#22c55e', borderRadius: '3px' }}></div>
                </div>
              </div>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>Detects fake images, inappropriate content</p>
            </div>

            <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '12px' }}>🏷️ Issue Classification Model</h4>
              <div style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '14px' }}>CLIP Model Accuracy</span>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>92.4%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px' }}>
                  <div style={{ width: '92.4%', height: '100%', background: '#3b82f6', borderRadius: '3px' }}></div>
                </div>
              </div>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>Auto-categorizes civic issues accurately</p>
            </div>

            <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '12px' }}>🔄 Duplicate Detection</h4>
              <div style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '14px' }}>Similarity Detection</span>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>89.6%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px' }}>
                  <div style={{ width: '89.6%', height: '100%', background: '#8b5cf6', borderRadius: '3px' }}></div>
                </div>
              </div>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>Prevents duplicate issue reporting</p>
            </div>
          </div>
        </div>

        {/* Municipal Dashboard */}
        <div style={sectionCardStyle}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
            🏛️ Municipal Transparency Dashboard
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '20px', background: 'linear-gradient(135deg, #22c55e, #16a34a)', borderRadius: '12px', color: 'white' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '12px' }}>✅ Resolution Metrics</h4>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ fontSize: '24px', fontWeight: 'bold' }}>73%</span>
                <span style={{ marginLeft: '8px', fontSize: '14px' }}>resolved in 7 days</span>
              </div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>
                Target: 80% • Improving: +12% this month
              </div>
            </div>

            <div style={{ padding: '20px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', borderRadius: '12px', color: 'white' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '12px' }}>⏱️ Response Times</h4>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ fontSize: '24px', fontWeight: 'bold' }}>4.2</span>
                <span style={{ marginLeft: '8px', fontSize: '14px' }}>hours avg response</span>
              </div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>
                Target: 6 hours • Improved: -2.1hrs this month
              </div>
            </div>

            <div style={{ padding: '20px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', borderRadius: '12px', color: 'white' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '12px' }}>📊 Citizen Satisfaction</h4>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ fontSize: '24px', fontWeight: 'bold' }}>4.6</span>
                <span style={{ marginLeft: '8px', fontSize: '14px' }}>/ 5.0 rating</span>
              </div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>
                Based on 1,247 feedback responses
              </div>
            </div>
          </div>
        </div>

        {/* Live AI Processing Feed */}
        <div style={sectionCardStyle}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
            🔄 Live AI Processing Feed
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ padding: '12px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #22c55e' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px' }}>🤖 Processing: Road damage report #GR156</span>
                <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: '600' }}>✅ VERIFIED (94% confidence)</span>
              </div>
            </div>
            <div style={{ padding: '12px', background: '#fef3c7', borderRadius: '8px', border: '1px solid #f59e0b' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px' }}>🔍 Analyzing: Garbage dump image #GR157</span>
                <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: '600' }}>⏳ PROCESSING...</span>
              </div>
            </div>
            <div style={{ padding: '12px', background: '#fef2f2', borderRadius: '8px', border: '1px solid #ef4444' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px' }}>🚫 Rejected: Inappropriate content #GR158</span>
                <span style={{ fontSize: '12px', color: '#ef4444', fontWeight: '600' }}>❌ SPAM DETECTED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Government Analytics */}
        <div style={sectionCardStyle}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
            📈 Government Analytics & Insights
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <button 
              onClick={() => showSuccess('Generating detailed civic analytics report...')}
              style={{
                ...primaryButtonStyle,
                backgroundColor: '#22c55e',
                flexDirection: 'column',
                padding: '20px',
                height: 'auto'
              }}
            >
              <span style={{ fontSize: '24px', marginBottom: '8px' }}>📊</span>
              <span>Issue Heatmap</span>
              <small style={{ opacity: 0.8 }}>Geospatial Analysis</small>
            </button>

            <button 
              onClick={() => showSuccess('Trust score analysis completed!')}
              style={{
                ...primaryButtonStyle,
                backgroundColor: '#3b82f6',
                flexDirection: 'column',
                padding: '20px',
                height: 'auto'
              }}
            >
              <span style={{ fontSize: '24px', marginBottom: '8px' }}>🏆</span>
              <span>Trust Metrics</span>
              <small style={{ opacity: 0.8 }}>Reputation Analysis</small>
            </button>

            <button 
              onClick={() => showSuccess('Predictive insights generated!')}
              style={{
                ...primaryButtonStyle,
                backgroundColor: '#8b5cf6',
                flexDirection: 'column',
                padding: '20px',
                height: 'auto'
              }}
            >
              <span style={{ fontSize: '24px', marginBottom: '8px' }}>🔮</span>
              <span>Predictive AI</span>
              <small style={{ opacity: 0.8 }}>Future Issue Trends</small>
            </button>

            <button 
              onClick={() => showSuccess('Performance dashboard updated!')}
              style={{
                ...primaryButtonStyle,
                backgroundColor: '#f59e0b',
                flexDirection: 'column',
                padding: '20px',
                height: 'auto'
              }}
            >
              <span style={{ fontSize: '24px', marginBottom: '8px' }}>⚡</span>
              <span>Performance</span>
              <small style={{ opacity: 0.8 }}>Municipal KPIs</small>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Civic Services Module with Sub-module Selection
  return (
    <div style={pageContainerStyle}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
        <button onClick={() => setCurrentPage('dashboard')} style={backButtonStyle}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginLeft: '16px' }}>
          🏛️ CivicEye Services
        </h2>
      </div>

      {/* CivicEye Overview Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>🤖</div>
          <h3 style={{ marginBottom: '4px' }}>AI Accuracy</h3>
          <p style={{ fontSize: '20px', fontWeight: 'bold' }}>94.2%</p>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>📝</div>
          <h3 style={{ marginBottom: '4px' }}>Active Reports</h3>
          <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{complaints.length}</p>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏱️</div>
          <h3 style={{ marginBottom: '4px' }}>Avg Response</h3>
          <p style={{ fontSize: '20px', fontWeight: 'bold' }}>4.2 hrs</p>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>👥</div>
          <h3 style={{ marginBottom: '4px' }}>Citizens Engaged</h3>
          <p style={{ fontSize: '20px', fontWeight: 'bold' }}>2,847</p>
        </div>
      </div>

      {/* Sub-modules Selection */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: '24px',
        marginBottom: '32px'
      }}>
        <div 
          onClick={() => setCurrentSubModule('reporting')}
          style={{
            ...moduleCardStyle,
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            cursor: 'pointer'
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📱</div>
          <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
            Citizen Reporting & Engagement
          </h3>
          <p style={{ marginBottom: '16px' }}>Report issues, gamification, community engagement, user reputation system</p>
          <div style={statusBadgeStyle}>🏆 {userReputation} Rep Points</div>
        </div>

        <div 
          onClick={() => setCurrentSubModule('ai-tracking')}
          style={{
            ...moduleCardStyle,
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            cursor: 'pointer'
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤖</div>
          <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
            AI Verification & Municipal Tracking
          </h3>
          <p style={{ marginBottom: '16px' }}>AI content verification, transparency dashboard, government analytics</p>
          <div style={statusBadgeStyle}>🔍 94.2% Accuracy</div>
        </div>
      </div>

      {/* Quick Emergency Services (keeping existing feature) */}
      <div style={sectionCardStyle}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
          🚨 Emergency Services (Quick Access)
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minMax(200px, 1fr))', 
          gap: '16px' 
        }}>
          <button 
            onClick={() => showSuccess('Calling Police (100)...')}
            style={{
              ...emergencyButtonStyle,
              backgroundColor: '#ef4444'
            }}
          >
            <Shield size={20} /> 👮 Police (100)
          </button>
          <button 
            onClick={() => showSuccess('Calling Fire Brigade (101)...')}
            style={{
              ...emergencyButtonStyle,
              backgroundColor: '#f97316'
            }}
          >
            🔥 Fire (101)
          </button>
          <button 
            onClick={() => showSuccess('Calling Ambulance (108)...')}
            style={{
              ...emergencyButtonStyle,
              backgroundColor: '#22c55e'
            }}
          >
            🚑 Ambulance (108)
          </button>
        </div>
      </div>

      {/* CivicEye Features Showcase */}
      <div style={sectionCardStyle}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
          ✨ CivicEye Innovation Features
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
          <div style={{ padding: '12px', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #3b82f6' }}>
            <span style={{ fontWeight: '600', color: '#1d4ed8' }}>🤖 AI-Driven Verification:</span>
            <span style={{ color: '#374151', marginLeft: '8px' }}>Scans media for harmful content & calculates confidence scores</span>
          </div>
          <div style={{ padding: '12px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #22c55e' }}>
            <span style={{ fontWeight: '600', color: '#15803d' }}>🎮 Gamified Engagement:</span>
            <span style={{ color: '#374151', marginLeft: '8px' }}>Reputation system incentivizes active citizen participation</span>
          </div>
          <div style={{ padding: '12px', background: '#fefce8', borderRadius: '8px', border: '1px solid #f59e0b' }}>
            <span style={{ fontWeight: '600', color: '#d97706' }}>👁️ Transparent Tracking:</span>
            <span style={{ color: '#374151', marginLeft: '8px' }}>Full visibility into municipal resolution progress</span>
          </div>
          <div style={{ padding: '12px', background: '#fdf2f8', borderRadius: '8px', border: '1px solid #ec4899' }}>
            <span style={{ fontWeight: '600', color: '#be185d' }}>✅ User Verification:</span>
            <span style={{ color: '#374151', marginLeft: '8px' }}>Citizens approve reports after witnessing completed work</span>
          </div>
        </div>
      </div>
    </div>
  );
};
  // Profile Page
  const ProfilePage = () => (
    <div style={pageContainerStyle}>
      <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '32px' }}>
        👤 User Profile
      </h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '16px' 
      }}>
        <div style={profileFieldStyle}>
          <label>👤 Name</label>
          <p style={{ fontSize: '18px', fontWeight: '600' }}>{user?.name}</p>
        </div>
        <div style={profileFieldStyle}>
          <label>📧 Email</label>
          <p>{user?.email}</p>
        </div>
        <div style={profileFieldStyle}>
          <label>📱 Phone</label>
          <p>{user?.phone}</p>
        </div>
        <div style={profileFieldStyle}>
          <label>💼 Role</label>
          <p style={{ textTransform: 'capitalize' }}>{user?.role}</p>
        </div>
        <div style={profileFieldStyle}>
          <label>📍 Location</label>
          <p>{user?.location || currentLocation}</p>
        </div>
      </div>
      <div style={{ marginTop: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button style={primaryButtonStyle}>✏️ Edit Profile</button>
        <button style={{ ...primaryButtonStyle, backgroundColor: '#6b7280' }}>🔑 Change Password</button>
      </div>
    </div>
  );

  // Settings Page
  const SettingsPage = () => (
    <div style={pageContainerStyle}>
      <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '32px' }}>
        ⚙️ Settings
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={settingsSectionStyle}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>🔔 Notifications</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={settingItemStyle}>
              <label>📧 Email Notifications</label>
              <input type="checkbox" defaultChecked />
            </div>
            <div style={settingItemStyle}>
              <label>📱 SMS Notifications</label>
              <input type="checkbox" defaultChecked />
            </div>
            <div style={settingItemStyle}>
              <label>🔔 Push Notifications</label>
              <input type="checkbox" defaultChecked />
            </div>
          </div>
        </div>
        
        <div style={settingsSectionStyle}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>🌐 Language & Location</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <select style={inputStyle}>
              <option value="en">🇺🇸 English</option>
              <option value="hi">🇮🇳 हिंदी</option>
            </select>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={16} style={{ color: '#6b7280' }} />
              <span style={{ color: '#6b7280' }}>{currentLocation}</span>
              <button style={{ ...primaryButtonStyle, padding: '4px 8px', fontSize: '12px' }}>
                Update Location
              </button>
            </div>
          </div>
        </div>
        
        <div style={settingsSectionStyle}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>🔒 Privacy</h3>
          <select style={inputStyle}>
            <option value="public">🌍 Public</option>
            <option value="private">🔒 Private</option>
          </select>
        </div>
      </div>
    </div>
  );

  // Styles (keeping all existing styles)
  const pageContainerStyle = {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
    padding: '32px',
    margin: '24px',
    minHeight: 'calc(100vh - 150px)'
  };

  const authContainerStyle = {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
    padding: '32px',
    margin: '50px auto'
  };

  const authHeaderStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '24px',
    color: '#1f2937'
  };

  const navButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    border: '2px solid #3b82f6',
    color: '#3b82f6',
    backgroundColor: 'transparent',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s'
  };

  const primaryButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'linear-gradient(to right, #22c55e, #3b82f6)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.3s'
  };

  const linkButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#3b82f6',
    cursor: 'pointer',
    textDecoration: 'underline',
    marginLeft: '4px'
  };

  const backButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: '#e5e7eb',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  };

  const moduleCardStyle = {
    color: 'white',
    padding: '24px',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'transform 0.3s',
    textAlign: 'center'
  };

  const statusBadgeStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600'
  };

  const sectionCardStyle = {
    backgroundColor: '#f9fafb',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #e5e7eb'
  };

  const marketItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #e5e7eb'
  };

  const sellButtonStyle = {
    padding: '6px 12px',
    backgroundColor: '#22c55e',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  };

  const courseItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #e5e7eb'
  };

  const enrollButtonStyle = {
    padding: '8px 16px',
    backgroundColor: '#22c55e',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  };

  const scholarshipItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #e5e7eb'
  };

  const applyButtonStyle = {
    padding: '6px 12px',
    backgroundColor: '#8b5cf6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  };

  const complaintItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #e5e7eb'
  };

  const emergencyButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '16px',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '16px'
  };

  const profileFieldStyle = {
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb'
  };

  const settingsSectionStyle = {
    padding: '20px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb'
  };

  const settingItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px'
  };

  // Main render
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #22c55e, #3b82f6)' 
    }}>
      <Header />
      
      {showNotification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#22c55e',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '8px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
          zIndex: 1000,
          animation: 'bounce 1s infinite'
        }}>
          {notificationMessage}
        </div>
      )}

      {showOTPModal && <OTPModal />}
      
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'login' && <LoginPage />}
      {currentPage === 'register' && <RegisterPage />}
      {currentPage === 'dashboard' && <DashboardPage />}
      {currentPage === 'agriculture' && <AgricultureModule />}
      {currentPage === 'education' && <EducationModule />}
      {currentPage === 'civic' && <CivicModule />}
      {currentPage === 'profile' && <ProfilePage />}
      {currentPage === 'settings' && <SettingsPage />}
    </div>
  );
}

export default App;