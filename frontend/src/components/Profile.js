import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import getMe from '../api/me';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      getMe(token)
        .then((data) => setUserData(data))
        .catch((err) => alert(err));
    }
  }, [navigate]);

  return (
    <div>
      {userData ? (
        <>
          <p>Email or userId: {userData.email}</p>
          <p>DbId: {userData.id}</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;
