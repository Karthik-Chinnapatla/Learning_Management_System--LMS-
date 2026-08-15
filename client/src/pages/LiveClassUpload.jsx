import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../styles/LiveClassUpload.css";

const API_URL = process.env.REACT_APP_API_URL;

function LiveClassUpload() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    roomId: "",
    date: "",
    time: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post(
        `${API_URL}/api/liveclasses/create`,
        form
      );

      toast.success(
        "Live Class Created Successfully"
      );

      setForm({
        title: "",
        description: "",
        roomId: "",
        date: "",
        time: "",
      });

      setTimeout(() => {
        window.location.href = "/liveclasses";
      }, 1500);

    } catch (error) {
      console.log(error);

      toast.error(
        "Error creating live class"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="liveclass-container">
      <h1>Create Live Class</h1>

      <form
        className="liveclass-form"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="title"
          placeholder="Class Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Class Description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="roomId"
          placeholder="Meeting Room ID"
          value={form.roomId}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />

        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Creating..."
            : "Create Live Class"}
        </button>
      </form>
    </div>
  );
}

export default LiveClassUpload;