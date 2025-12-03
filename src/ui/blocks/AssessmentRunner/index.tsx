'use client';

import { Button, Center, Container, Text, Title } from '@mantine/core';
import { useState } from 'react';
import { ExamView } from './ExamView';
import { IntroView } from './IntroView';

export function AssessmentRunner() {
    // STATE: 'INTRO' | 'EXAM' | 'FINISHED'
    const [step, setStep] = useState<'INTRO' | 'EXAM' | 'FINISHED'>('EXAM');

    // Simpan data biodata peserta
    const [candidate, setCandidate] = useState({ name: '', phone: '' });

    const handleStart = (data: { name: string; phone: string }) => {
        setCandidate(data);
        setStep('EXAM');
    };

    const handleFinish = () => {
        setStep('FINISHED');
        console.log("Ujian Selesai! Data:", candidate);
    };

    // --- RENDER LOGIC ---

    if (step === 'INTRO') {
        return <IntroView title="Senior JavaScript Assessment" onStart={handleStart} />;
    }

    if (step === 'EXAM') {
        return <ExamView candidate={candidate} onFinish={handleFinish} />;
    }

    // Tampilan Selesai Sederhana
    return (
        <Center h="60vh">
            <Container ta="center">
                <Title>Asesmen Selesai!</Title>
                <Text c="dimmed" mt="md">Terima kasih {candidate.name}, jawaban Anda telah kami rekam.</Text>
                <Button mt="xl" onClick={() => window.location.href = '/'}>Kembali ke Beranda</Button>
            </Container>
        </Center>
    );
}