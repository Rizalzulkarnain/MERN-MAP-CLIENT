import { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { format } from 'timeago.js';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { Room, Star } from '@material-ui/icons';
import Register from './Register';
import Login from './Login';

const fetchPinMap = async () => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/pins`);
    return res.data.data;
  } catch (error) {
    console.log(error);
  }
};

const Map = () => {
  const [currentPlaceId, setCurrentPlaceId] = useState('');
  const [newPlace, setNewPlace] = useState('');
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: -6.175392,
    longitude: 106.827153,
    zoom: 14,
  });

  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(
    myStorage.getItem('user') || null
  );
  const { data } = useQuery('PinMap', fetchPinMap);

  const [pins, setPins] = useState([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [rating, setRating] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleClickMarker = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
  };

  const handleClickAdd = (e) => {
    const [long, lat] = e.lngLat;
    setNewPlace({ lat, long });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long,
    };

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/pins`,
        newPin
      );
      setPins([...pins, res.data.data]);
      setNewPlace(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    myStorage.removeItem('user');
    setCurrentUser(null);
  };

  return (
    <>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        onDblClick={handleClickAdd}
        transitionDuration="1000"
      >
        {data.map((pin) => (
          <div key={pin._id}>
            <Marker
              latitude={pin.lat}
              longitude={pin.long}
              offsetLeft={viewport.zoom * 3.5}
              offsetTop={viewport.zoom * 7}
            >
              <Room
                style={{
                  fontSize: viewport.zoom * 7,
                  color: pin.username === currentUser ? 'tomato' : 'slateblue',
                  cursor: 'pointer',
                }}
                onClick={() => handleClickMarker(pin._id, pin.lat, pin.long)}
              />
            </Marker>
            {pin._id === currentPlaceId && (
              <Popup
                latitude={pin.lat}
                longitude={pin.long}
                closeButton={true}
                closeOnClick={false}
                anchor="left"
                onClose={() => setCurrentPlaceId(null)}
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{pin.title}</h4>
                  <label>Review</label>
                  <p className="desc">{pin.desc}</p>
                  <label>Rating</label>
                  <div className="stars">
                    {Array(pin.rating).fill(<Star className="star " />)}
                  </div>
                  <label>Information</label>
                  <span className="username">
                    Created by <b>{pin.username}</b>
                  </span>
                  <span className="date">{format(pin.createdAt)}</span>
                </div>
              </Popup>
            )}
            {newPlace && (
              <Popup
                latitude={newPlace.lat}
                longitude={newPlace.long}
                closeButton={true}
                closeOnClick={false}
                anchor="left"
                onClose={() => setNewPlace(null)}
              >
                <div>
                  <form onSubmit={handleSubmit}>
                    <label>Title</label>
                    <input
                      type="text"
                      placeholder="Enter a title"
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    <label>Review</label>
                    <textarea
                      placeholder="Description about Place"
                      onChange={(e) => setDesc(e.target.value)}
                    />
                    <label>Rating</label>
                    <select onChange={(e) => setRating(e.target.value)}>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                    <button className="submitButton" ttype="submit">
                      Add Pin
                    </button>
                  </form>
                </div>
              </Popup>
            )}
          </div>
        ))}

        {currentUser ? (
          <button className="button logout" onClick={handleLogout}>
            Log out
          </button>
        ) : (
          <div className="buttons">
            <button className="button login" onClick={() => setShowLogin(true)}>
              Login
            </button>
            <button
              className="button register"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            myStorage={myStorage}
            setCurrentUser={setCurrentUser}
          />
        )}
      </ReactMapGL>
    </>
  );
};

export default Map;
