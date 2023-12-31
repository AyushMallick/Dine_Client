import "./ReservationList.css";
import { formatDate } from "../utils/formatDate";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./Reservation";
import "./Restaurant";
import Empty from "../empty.png";

import { useAuth0 } from "@auth0/auth0-react";

const ReservationList = () => {
  const { id } = useParams();
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getAccessTokenSilently } = useAuth0();
  const [isError, setIsError] = useState(false);
  const [errorStatus, setErrorStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/reservations`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      setReservations(data);
      setIsLoading(false);
    };
    fetchData();
  }, [id, getAccessTokenSilently, isLoading]);

  if (isLoading) {
    return <p>Loading...</p>;
  }
  /* Added heading */
  if (reservations.length < 1) {
    return (
      <>
        <h1 className="upcoming">Upcoming reservations</h1>
        <div className="no-rez">
          <p className="no-reservations">You don't have any reservations.</p>
          <div className="emptyrez">
            <img className="empty" alt="empty" src={Empty}></img>
          </div>
          <div className="linkToInfo">
            <Link to="/">View the restaurants</Link>
          </div>
        </div>
      </>
    );
  }
  /*const deleteBooking=async(id)=>{
    // event.preventDefault();
    try {
      
    const accessToken = await getAccessTokenSilently();
    setIsLoading(true);

    const body = { id };

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/deleteBooking/${id}`,

      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      }
    );
    setIsLoading(false);
    navigate("/reservations");
    } catch(error){
      setIsError(true);
      // setErrorStatus(response.status);
    }finally {
      setIsLoading(false);
    }
      
    // if (!response.ok) {
    //   setIsError(true);
    //   setErrorStatus(response.status);
    // } else {
    //   setIsLoading(false);
    //   navigate("/reservations");
    // }
  };*/

  const deleteBooking = async (id) => {
    try {
      const accessToken = await getAccessTokenSilently();
      setIsLoading(true);

      const body = { id };

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/deleteBooking/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete booking. Status: ${response.status}`);
      }

      setIsLoading(false);
      navigate("/reservations");
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
      console.error("Error deleting booking:", error);
    }
  };

  // ... (rest of your code)



  return (
    <>
      <h1 className="upcoming">Reservations</h1>
      <div className="upContainer">
        <ul className="reservations-list">
          {reservations.map((reservation) => {
            return (
              <li key={reservation.id}>
                <p className="upRestaurantName">
                  <strong>{reservation.restaurantName}</strong>
                </p>

                <p className="formatDate"> {formatDate(reservation.date)}</p>

                <div className="linkToInfo">
                  <button onClick={() => deleteBooking(reservation.id)}>delete</button>
                  <button className="detailbtn">
                    <Link to={"/reservations/" + reservation.id}>
                      View details &raquo;
                    </Link>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default ReservationList;
