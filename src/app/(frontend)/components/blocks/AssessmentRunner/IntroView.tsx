'use client';

import {
    Box, Button, Card, Container, Divider, Grid, Group, List,
    SimpleGrid, Stack, Text, TextInput, ThemeIcon, Title
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconBrain, IconCheck, IconClock, IconListNumbers, IconTrophy } from '@tabler/icons-react';

interface IntroViewProps {
    onStart: (candidateData: { name: string; phone: string }) => void;
    title: string;
}

export function IntroView({ onStart, title }: IntroViewProps) {
    const form = useForm({
        initialValues: { name: '', phone: '' },
        validate: {
            name: (val) => (val.length < 3 ? 'Nama wajib diisi' : null),
            phone: (val) => (val.length < 10 ? 'Nomor HP tidak valid' : null),
        },
    });

    return (
        <Container size="xl" py={60}>
            <Stack gap="xl">
                <Card
                    radius="lg"
                    p={{ base: 'md', md: 50 }}
                    bg="white"
                    withBorder
                    shadow="sm"
                >
                    <Box mb="xl">
                        <Text size="sm" c="dimmed" fw={700} mb={5} tt="uppercase" style={{ letterSpacing: '1px' }}>PT. Tech Solutions</Text>
                        <Title order={1} size={42} fw={900} c="dark.9" style={{ letterSpacing: -1 }}>{title}</Title>
                        <Text c="dimmed" size="lg" mt={5}>for: Senior JavaScript Developer</Text>
                    </Box>

                    <Divider my="xl" />

                    <SimpleGrid cols={{ base: 2, md: 4 }} spacing="xl">
                        <Box>
                            <Text size="xs" c="dimmed" fw={700} tt="uppercase" mb={5}>Duration</Text>
                            <Group gap={10} align="center">
                                <ThemeIcon variant="light" color="blue" size="md" radius="xl"><IconClock size={18} /></ThemeIcon>
                                <Text fw={700} size="xl" c="dark.8">45 min</Text>
                            </Group>
                        </Box>
                        <Box>
                            <Text size="xs" c="dimmed" fw={700} tt="uppercase" mb={5}>Questions</Text>
                            <Group gap={10} align="center">
                                <ThemeIcon variant="light" color="blue" size="md" radius="xl"><IconListNumbers size={18} /></ThemeIcon>
                                <Text fw={700} size="xl" c="dark.8">15 Butir</Text>
                            </Group>
                        </Box>
                        <Box>
                            <Text size="xs" c="dimmed" fw={700} tt="uppercase" mb={5}>Difficulty</Text>
                            <Group gap={10} align="center">
                                <ThemeIcon variant="light" color="orange" size="md" radius="xl"><IconBrain size={18} /></ThemeIcon>
                                <Text fw={700} size="xl" c="orange.7">Hard</Text>
                            </Group>
                        </Box>
                        <Box>
                            <Text size="xs" c="dimmed" fw={700} tt="uppercase" mb={5}>Passing Grade</Text>
                            <Group gap={10} align="center">
                                <ThemeIcon variant="light" color="green" size="md" radius="xl"><IconTrophy size={18} /></ThemeIcon>
                                <Text fw={700} size="xl" c="green.7">70%</Text>
                            </Group>
                        </Box>
                    </SimpleGrid>
                </Card>

                <Grid gutter="xl">
                    {/* KIRI: Instruksi */}
                    <Grid.Col span={{ base: 12, md: 8 }}>
                        <Card withBorder shadow="sm" radius="lg" p="xl" h="100%">
                            <Title order={3} mb="lg" c="dark.9">Instruksi Pengerjaan</Title>
                            <List
                                spacing="md"
                                icon={
                                    <ThemeIcon color="blue.6" size={24} radius="xl">
                                        <IconCheck size={14} stroke={3} />
                                    </ThemeIcon>
                                }
                            >
                                <List.Item>
                                    <Text span fw={600} c="dark.9">Waktu pengerjaan 45 menit.</Text> <Text span c="dimmed">Timer akan berjalan otomatis saat tombol Mulai ditekan.</Text>
                                </List.Item>
                                <List.Item>
                                    <Text span fw={600} c="dark.9">15 Soal Pilihan Ganda.</Text> <Text span c="dimmed">Setiap soal memiliki 4 pilihan jawaban, pilih satu yang paling tepat.</Text>
                                </List.Item>
                                <List.Item>
                                    <Text span fw={600} c="dark.9">Dilarang curang.</Text> <Text span c="dimmed">Sistem akan mendeteksi jika Anda membuka tab lain atau aplikasi tambahan.</Text>
                                </List.Item>
                                <List.Item>
                                    <Text span fw={600} c="dark.9">Passing Score 70%.</Text> <Text span c="dimmed">Anda harus menjawab benar minimal 11 soal untuk dinyatakan lulus.</Text>
                                </List.Item>
                                <List.Item>
                                    <Text span fw={600} c="dark.9">Review Jawaban.</Text> <Text span c="dimmed">Anda dapat kembali ke soal sebelumnya selama waktu masih tersedia.</Text>
                                </List.Item>
                            </List>
                        </Card>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Card shadow="sm" radius="lg" p="xl" withBorder style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Box mb="xl">
                                <Title order={3} size="h3" c="dark.9">Siap Memulai?</Title>
                                <Text c="dimmed" size="sm">Lengkapi data diri Anda untuk masuk ke ujian.</Text>
                            </Box>

                            <form onSubmit={form.onSubmit((values) => onStart(values))}>
                                <Stack>
                                    <TextInput
                                        label="Nama Lengkap"
                                        placeholder="Contoh: Budi Santoso"
                                        radius="md"
                                        size="md"
                                        required
                                        {...form.getInputProps('name')}
                                    />
                                    <TextInput
                                        label="Nomor WhatsApp"
                                        placeholder="0812..."
                                        radius="md"
                                        size="md"
                                        required
                                        type="tel"
                                        {...form.getInputProps('phone')}
                                    />

                                    <Button
                                        type="submit"
                                        fullWidth
                                        size="lg"
                                        radius="md"
                                        mt="md"
                                        color="blue"
                                    >
                                        Mulai Asesmen
                                    </Button>
                                </Stack>
                            </form>
                        </Card>
                    </Grid.Col>
                </Grid>
            </Stack>
        </Container>
    );
}