import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api/axios";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

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

  if (loading) return <p className="p-6">Memuat data acara...</p>;

  if (!event) return <p className="p-6">Event tidak ditemukan.</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-10">
        <button className="text-sm text-gray-600 mb-4" onClick={() => navigate(`/events/${id}`)}>← Kembali ke Detail Acara</button>

        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-semibold text-[#0e2a47] mb-2">Form Pendaftaran Acara</h1>

          <p className="text-sm text-gray-600 mb-6">Anda akan mendapatkan Kode Registrasi Unik. <span className="font-semibold text-red-600">Kode Absensi Acara</span> akan diberikan oleh panitia saat event berlangsung.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
              <input type="text" name="name" placeholder="Nama Lengkap" value={form.name} onChange={handleChange} required className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0e2a47]" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email Aktif</label>
              <input type="email" name="email" placeholder="Email Aktif" value={form.email} onChange={handleChange} className="mt-1 block w-full border rounded-md px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
              <input type="text" name="phone" placeholder="Nomor Telepon" value={form.phone} onChange={handleChange} className="mt-1 block w-full border rounded-md px-3 py-2" />
            </div>

            <button className="w-full bg-[#0e2a47] text-white py-3 rounded-md font-semibold">Daftar & Dapatkan Kode Regis</button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
