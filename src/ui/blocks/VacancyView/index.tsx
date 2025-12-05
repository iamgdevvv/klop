'use client';

import {
    Badge,
    Box, Button, Card, Container, Divider, Grid, Group,
    List,
    Paper,
    ScrollArea, Stack, Text,
    TextInput,
    ThemeIcon, Title
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
    ArrowRight, Building, Check, Link as LinkIcon, MapPin
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// --- MOCK DATA ---
const OTHER_JOBS = [
    { id: 'fe', title: "Senior Frontend Engineer", slug: "senior-frontend", salary: "Rp 20jt - 35jt", active: true },
    { id: 'be', title: "Backend Developer (Go)", slug: "backend-go", salary: "Rp 18jt - 30jt", active: false },
    { id: 'pm', title: "Product Manager", slug: "product-manager", salary: "SGD 5000", active: false },
    { id: 'qa', title: "QA Automation", slug: "qa-automation", salary: "Rp 12jt - 20jt", active: false },
    { id: 'ui', title: "UI/UX Designer", slug: "ui-ux", salary: "Rp 10jt - 15jt", active: false },
    { id: 'devops', title: "DevOps Engineer", slug: "devops", salary: "Rp 25jt - 40jt", active: false },
    { id: 'data', title: "Data Scientist", slug: "data-scientist", salary: "Rp 20jt - 30jt", active: false },
];

const CURRENT_JOB = {
    title: "Senior Frontend Engineer",
    company: "Tokopedia",
    location: "Jakarta Pusat (Hybrid)",
    salary: "Rp 20.000.000 - Rp 35.000.000",
    description: "Kami mencari Senior Frontend Engineer yang memiliki passion dalam membangun antarmuka pengguna yang responsif, cepat, dan interaktif. Anda akan bekerja sama dengan tim produk dan desain untuk menciptakan pengalaman belanja terbaik.",
    requirements: [
        "Pengalaman minimal 5 tahun dengan React.js & Next.js.",
        "Pemahaman mendalam tentang TypeScript dan Modern CSS.",
        "Terbiasa dengan Unit Testing (Jest/RTL).",
        "Mampu memimpin tim kecil dan melakukan code review."
    ]
};

export function VacancyView({ companySlug, vacancySlug }: { companySlug: string, vacancySlug: string }) {
    const router = useRouter();

    // Form State Management
    const form = useForm({
        initialValues: {
            name: '',
            phone: '',
            cvLink: '',
            portfolioLink: '',
        },
        validate: {
            name: (val) => (val.length < 3 ? 'Nama terlalu pendek' : null),
            phone: (val) => (val.length < 10 ? 'Nomor HP tidak valid' : null),
            // CV & Portfolio opsional, tidak perlu validasi ketat
        },
    });

    const handleSubmit = (values: typeof form.values) => {
        console.log("Application Data:", values);
        // Redirect ke halaman assessment
        router.push(`/assessments/${vacancySlug}`);
    };

    return (
        <Container size="xl" py={40}>
            <Grid gutter="xl">

                {/* --- SIDEBAR: LIST LOWONGAN (Scrollable Independen) --- */}
                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Box mb="md">
                        <Title order={4}>Available Positions</Title>
                        <Text size="sm" c="dimmed">Lowongan lain di {CURRENT_JOB.company}</Text>
                    </Box>

                    {/* SCROLL AREA FIX: Menggunakan tinggi dinamis viewport (vh) */}
                    <Card withBorder radius="lg" p={0} bg="transparent" style={{ border: 'none' }}>
                        <ScrollArea h="calc(100vh - 200px)" scrollbarSize={6} type="auto">
                            <Stack gap="sm" pr="sm"> {/* Padding kanan biar scrollbar gak nempel */}
                                {OTHER_JOBS.map((job) => (
                                    <Card
                                        key={job.id}
                                        component={Link}
                                        href={`/${companySlug}/${job.slug}`}
                                        radius="md"
                                        p="md"
                                        withBorder
                                        bg={job.active ? 'blue.0' : 'white'}
                                        style={{
                                            cursor: 'pointer',
                                            borderColor: job.active ? 'var(--mantine-color-blue-4)' : undefined,
                                            transition: 'transform 0.2s ease'
                                        }}
                                        className="hover:scale-[1.02]"
                                    >
                                        <Title order={5} size="sm" mb={4} c={job.active ? 'blue.9' : 'dark.9'}>
                                            {job.title}
                                        </Title>
                                        <Group justify="space-between">
                                            <Text size="xs" c="dimmed">{CURRENT_JOB.company}</Text>
                                            <Text size="xs" fw={700} c={job.active ? 'blue.6' : 'green.6'}>
                                                {job.salary}
                                            </Text>
                                        </Group>
                                    </Card>
                                ))}
                            </Stack>
                        </ScrollArea>
                    </Card>
                </Grid.Col>

                {/* --- CONTENT: DETAIL LOWONGAN --- */}
                <Grid.Col span={{ base: 12, md: 8 }}>
                    <Card withBorder radius="lg" p={{ base: 'md', md: 40 }} bg="white">

                        {/* Header Detail */}
                        <Group justify="space-between" align="start" mb="xl">
                            <Box>
                                <Title order={2} mb="xs">{CURRENT_JOB.title}</Title>
                                <Group gap="md">
                                    <Group gap={6}>
                                        <Building size={18} color="gray" />
                                        <Text size="sm" c="dimmed">{CURRENT_JOB.company}</Text>
                                    </Group>
                                    <Group gap={6}>
                                        <MapPin size={18} color="gray" />
                                        <Text size="sm" c="dimmed">{CURRENT_JOB.location}</Text>
                                    </Group>
                                </Group>
                            </Box>
                            <Badge size="lg" color="green" variant="light">{CURRENT_JOB.salary}</Badge>
                        </Group>

                        <Divider mb="xl" />

                        <Stack gap="xl">
                            <Box>
                                <Title order={4} mb="md">Job Description</Title>
                                <Text lh={1.7} c="dimmed">
                                    {CURRENT_JOB.description}
                                </Text>
                            </Box>

                            <Box>
                                <Title order={4} mb="md">Requirements</Title>
                                <List spacing="sm" icon={<ThemeIcon color="blue.6" size={20} radius="xl"><Check size={12} /></ThemeIcon>}>
                                    {CURRENT_JOB.requirements.map((req, i) => (
                                        <List.Item key={i}><Text c="dimmed">{req}</Text></List.Item>
                                    ))}
                                </List>
                            </Box>
                        </Stack>

                        <Divider my="xl" />

                        {/* --- FORMULIR LAMARAN (QUICK APPLY) --- */}
                        <Paper
                            p="xl"
                            radius="md"
                            bg="gray.0"
                            withBorder
                            style={{ borderColor: 'var(--mantine-color-blue-2)' }}
                        >
                            <Title order={3} mb="sm" size="h4">Lamar Sekarang</Title>
                            <Text size="sm" c="dimmed" mb="lg">
                                Isi data singkat Anda untuk melanjutkan ke tahap asesmen.
                            </Text>

                            <form onSubmit={form.onSubmit(handleSubmit)}>
                                <Grid gutter="md">
                                    <Grid.Col span={{ base: 12, md: 6 }}>
                                        <TextInput
                                            label="Nama Lengkap"
                                            placeholder="Budi Santoso"
                                            required
                                            radius="md"
                                            bg="white"
                                            {...form.getInputProps('name')}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={{ base: 12, md: 6 }}>
                                        <TextInput
                                            label="Nomor WhatsApp"
                                            placeholder="0812..."
                                            required
                                            radius="md"
                                            bg="white"
                                            type="tel"
                                            {...form.getInputProps('phone')}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={12}>
                                        <TextInput
                                            label="Link CV / Resume (Google Drive/LinkedIn)"
                                            placeholder="https://..."
                                            radius="md"
                                            bg="white"
                                            leftSection={<LinkIcon size={16} />}
                                            {...form.getInputProps('cvLink')}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={12}>
                                        <TextInput
                                            label="Link Portofolio (Opsional)"
                                            placeholder="https://..."
                                            radius="md"
                                            bg="white"
                                            leftSection={<LinkIcon size={16} />}
                                            {...form.getInputProps('portfolioLink')}
                                        />
                                    </Grid.Col>
                                </Grid>

                                <Button
                                    type="submit"
                                    fullWidth
                                    size="md"
                                    color="blue"
                                    radius="md"
                                    mt="xl"
                                    rightSection={<ArrowRight size={18} />}
                                >
                                    Lanjut ke Asesmen
                                </Button>
                            </form>
                        </Paper>

                    </Card>
                </Grid.Col>
            </Grid>
        </Container>
    );
}