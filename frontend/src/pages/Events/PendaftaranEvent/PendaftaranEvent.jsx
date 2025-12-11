import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api/axios";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import "./PendaftaranEvent.css";

export default function PendaftaranEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    loadEvent();
  }, []);

  const loadEvent = async () => {
    try {
      const res = await api.get(`/events/${id}`);
      setEvent(res.data.data);
    } catch (error) {
      console.error("Gagal load event:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post(`/events/${id}/participants`, {
        name: form.name,
        email: form.email,
        phone: form.phone,
      });

      alert("Pendaftaran berhasil! Silakan simpan Kode Registrasi Anda.");
      navigate(`/events/${id}`);
    } catch (error) {
      console.error("Gagal mendaftar:", error.response?.data || error);
      alert(error.response?.data?.message || "Gagal mendaftar. Silakan coba lagi.");
    }
  };

  if (loading) return <p className="loading-text">Memuat data acara...</p>;

  if (!event) return <p className="loading-text">Event tidak ditemukan.</p>;

  return (
    <div className="pendaftaran-page">

      {/* HEADER */}
      <Header />

      <div className="content-wrapper">
        <button className="back-btn" onClick={() => navigate(`/events/${id}`)}>
          ← Kembali ke Detail Acara
        </button>

        <div className="form-card">
          <h1 className="form-title">Form Pendaftaran Acara</h1>

          <p className="sub-text">
            Anda akan mendapatkan Kode Registrasi Unik.
            <span className="highlight"> Kode Absensi Acara</span> akan diberikan oleh panitia saat event berlangsung.
          </p>

          <form onSubmit={handleSubmit} className="form-container">
            <label className="form-label">Nama Lengkap</label>
            <input
              type="text"
              name="name"
              placeholder="Nama Lengkap"
              value={form.name}
              onChange={handleChange}
              required
            />

            <label className="form-label">Email Aktif</label>
            <input
              type="email"
              name="email"
              placeholder="Email Aktif"
              value={form.email}
              onChange={handleChange}
            />

            <label className="form-label">Nomor Telepon</label>
            <input
              type="text"
              name="phone"
              placeholder="Nomor Telepon"
              value={form.phone}
              onChange={handleChange}
            />

            <button className="submit-btn">Daftar & Dapatkan Kode Regis</button>
          </form>
        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
