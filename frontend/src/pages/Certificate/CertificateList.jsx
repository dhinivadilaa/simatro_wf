import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function CertificateList() {
    const navigate = useNavigate();
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            const response = await api.get('/certificates/debug/list');
            if (response.data && response.data.success) {
                setCertificates(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching certificates:', error);
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        pageContainer: {
            padding: '20px',
            backgroundColor: '#f4f7f9',
            fontFamily: 'Arial, sans-serif',
            minHeight: '100vh'
        },
        container: {
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            padding: '20px',
            maxWidth: '800px',
            margin: '0 auto'
        },
        title: {
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '20px',
            color: '#002C6A'
        },
        certificateCard: {
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '15px',
            backgroundColor: '#f9f9f9'
        },
        button: {
            padding: '8px 16px',
            backgroundColor: '#002C6A',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px'
        }
    };

    if (loading) {
        return (
            <div style={styles.pageContainer}>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <p>Memuat daftar sertifikat...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div style={styles.pageContainer}>
                <div style={styles.container}>
                    <h2 style={styles.title}>Daftar Sertifikat Tersedia</h2>
                    
                    {certificates.length === 0 ? (
                        <p>Tidak ada sertifikat yang tersedia</p>
                    ) : (
                        certificates.map(cert => (
                            <div key={cert.id} style={styles.certificateCard}>
                                <h4>Certificate #{cert.id}</h4>
                                <p><strong>Nomor:</strong> {cert.certificate_number}</p>
                                <p><strong>Peserta:</strong> {cert.participant_name}</p>
                                <p><strong>Event:</strong> {cert.event_title}</p>
                                <p><strong>File:</strong> {cert.file_path}</p>
                                <div>
                                    <button 
                                        style={styles.button}
                                        onClick={() => navigate(`/certificate/${cert.id}`)}
                                    >
                                        Lihat Sertifikat
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                    
                    <button 
                        style={styles.button}
                        onClick={() => navigate('/riwayat')}
                    >
                        Kembali ke Dashboard
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
}