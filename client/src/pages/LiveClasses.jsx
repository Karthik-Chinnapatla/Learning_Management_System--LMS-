import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import { Link } from "react-router-dom";

import "../styles/LiveClasses.css";

const API_URL = process.env.REACT_APP_API_URL;

const LiveClasses = () => {
  const [classes, setClasses] =
    useState([]);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses =
    async () => {
      try {
        const res =
          await axios.get(
            `${API_URL}/api/liveclasses`
          );
        setClasses(
          res.data.data
        );
      } catch (error) {
        console.log(
          error
        );
      }
    };

  return (
    <div className="live-container">
      <h1 className="live-title">
        Live Classes
      </h1>

      {classes.length === 0 ? (
        <p>
          No live classes
          available
        </p>
      ) : (
        classes.map(
          (item) => (
            <div
              className="live-card"
              key={item._id}
            >
              <h2>
                {item.title}
              </h2>

              <p>
                {
                  item.description
                }
              </p>

              <p>
                <strong>
                  Date:
                </strong>{" "}
                {item.date}
              </p>

              <p>
                <strong>
                  Time:
                </strong>{" "}
                {item.time}
              </p>

              <Link
                to={`/liveclassroom/${item.roomId}`}
              >
                <button className="join-btn">
                  Join Class
                </button>
              </Link>
            </div>
          )
        )
      )}
    </div>
  );
};

export default LiveClasses;