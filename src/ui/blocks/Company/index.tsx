'use client';

import {
    Anchor,
    Avatar, Badge, Box, Button, Card, Container, Divider,
    Group,
    Image,
    SimpleGrid, Stack, Text, ThemeIcon, Title
} from '@mantine/core';
import {
    IconBrandFacebook,
    IconBrandInstagram,
    IconBrandLinkedin,
    IconBrandX,
    IconBuildingSkyscraper,
    IconCheck,
    IconLink,
    IconMapPin, IconUsers
} from '@tabler/icons-react';
import Link from 'next/link';

// --- MOCK DATA ---
const COMPANY_DATA = {
    name: "Tokopedia",
    tagline: "Selalu Ada Selalu Bisa",
    industry: "Internet",
    location: "Jakarta Pusat, DKI Jakarta, Indonesia",
    employees: "1001 - 5000 karyawan",
    status: "Verified",
    website: "https://tokopedia.com",
    description: "Tokopedia is an Indonesian technology company that continues to transform into Super Ecosystem with a mission to democratize commerce through technology. Tokopedia is here for creating an ecosystem where anyone can start and discover anything.\n\nToday, Tokopedia empowers millions of sellers and users through marketplaces and digital products, fintech and payments, logistics and fulfillment, as well as Mitra Tokopedia.",
    logo: "https://assets.tokopedia.net/assets-tokopedia-lite/v2/zeus/kratos/60524cdd.png",
    socials: [
        { icon: IconLink, label: "Website", link: "https://tokopedia.com" },
        { icon: IconBrandFacebook, label: "Facebook", link: "#" },
        { icon: IconBrandInstagram, label: "Instagram", link: "#" },
        { icon: IconBrandLinkedin, label: "LinkedIn", link: "#" },
        { icon: IconBrandX, label: "X", link: "#" },
    ],
    gallery: [
        "https://images.glints.com/unsafe/glints-dashboard.s3.amazonaws.com/company-gallery/a699039a7b97394073d9370605030d97.png",
        "https://images.glints.com/unsafe/glints-dashboard.s3.amazonaws.com/company-gallery/2d694539665795325956030999557375.jpg",
        "https://images.glints.com/unsafe/glints-dashboard.s3.amazonaws.com/company-gallery/93392336336332306352929009772097.jpg",
        "https://images.glints.com/unsafe/glints-dashboard.s3.amazonaws.com/company-gallery/83332766329003666699320399559300.jpg"
    ]
};

const JOBS_DATA = [
    { id: '1', title: "Senior Full Stack Programmer", type: "Penuh Waktu", exp: "1-3 tahun", salary: "Rp9jt - Rp11jt", location: "Jakarta Pusat", company: "Tokopedia" },
    { id: '2', title: "Sales Engineer", type: "Penuh Waktu", exp: "Kurang dari setahun", salary: "Rp4jt - Rp5,3jt", location: "Jakarta Pusat", company: "Tokopedia" },
    { id: '3', title: "Marketing Manager", type: "Kontrak", exp: "3-5 tahun", salary: "Rp12jt - Rp18jt", location: "Remote", company: "Tokopedia" },
    { id: '4', title: "UI/UX Designer", type: "Penuh Waktu", exp: "2-4 tahun", salary: "Rp8jt - Rp12jt", location: "Jakarta Selatan", company: "Tokopedia" },
];

export function Company({ companySlug }: { companySlug: string }) {
    return (
        <Container size="xl" py={40}>

            {/* --- 1. HEADER PERUSAHAAN --- */}
            <Card withBorder padding="xl" radius="lg" bg="white" mb="xl">
                <Group align="flex-start" wrap="nowrap">
                    {/* Logo */}
                    <Avatar
                        src={COMPANY_DATA.logo}
                        size={100}
                        radius="md"
                        style={{ border: '1px solid var(--mantine-color-gray-2)' }}
                    />

                    {/* Info */}
                    <Box style={{ flex: 1 }}>
                        <Group align="center" gap="xs" mb={4}>
                            <ThemeIcon size="xs" radius="xl" color="blue" variant="filled">
                                <IconCheck size={10} stroke={4} />
                            </ThemeIcon>
                            <Title order={2} size="h2" fw={700}>{COMPANY_DATA.name}</Title>
                        </Group>
                        <Text c="dimmed" size="md" mb="lg">{COMPANY_DATA.tagline}</Text>

                        <Group gap="xl" mt="md">
                            <Group gap="xs">
                                <IconMapPin size={18} color="gray" />
                                <Text size="sm" c="dimmed">{COMPANY_DATA.location}</Text>
                            </Group>
                            <Group gap="xs">
                                <IconUsers size={18} color="gray" />
                                <Text size="sm" c="dimmed">{COMPANY_DATA.employees}</Text>
                            </Group>
                        </Group>

                        <Group gap="xl" mt="xs">
                            <Group gap="xs">
                                <IconBuildingSkyscraper size={18} color="gray" />
                                <Text size="sm" c="dimmed">{COMPANY_DATA.industry}</Text>
                            </Group>
                            <Group gap="xs">
                                <IconCheck size={18} color="var(--mantine-color-blue-6)" />
                                <Text size="sm" c="blue" fw={500}>{COMPANY_DATA.status}</Text>
                            </Group>
                        </Group>
                    </Box>
                </Group>
            </Card>

            {/* --- 2. KONTEN (Disusun Vertikal Tanpa Tab) --- */}
            <Stack gap={40}>

                {/* Section: Deskripsi */}
                <Box id="deskripsi">
                    <Card withBorder radius="lg" p="xl">
                        <Title order={3} mb="lg">Tentang Perusahaan</Title>
                        <Box mb="xl">
                            <Text fw={700} mb="xs">Deskripsi</Text>
                            <Text c="dimmed" style={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                                {COMPANY_DATA.description}
                            </Text>
                        </Box>
                    </Card>
                </Box>

                {/* Section: Kultur */}
                <Box id="kultur">
                    <Card withBorder radius="lg" p="xl">
                        <Title order={3} mb="lg">Kultur Perusahaan</Title>
                        <Text c="dimmed">Perusahaan belum menambahkan bagian ini.</Text>
                    </Card>
                </Box>

                {/* Section: Hubungi Kami */}
                <Box id="kontak">
                    <Card withBorder radius="lg" p="xl">
                        <Title order={3} mb="lg">Hubungi Kami</Title>
                        <Text fw={600} mb="md">Web dan Media Sosial</Text>
                        <Group gap="xl">
                            {COMPANY_DATA.socials.map((item, index) => (
                                <Group key={index} gap={6} style={{ cursor: 'pointer' }}>
                                    <item.icon size={20} color="gray" />
                                    <Anchor href={item.link} target="_blank" c="blue" size="sm" fw={500}>
                                        {item.label}
                                    </Anchor>
                                </Group>
                            ))}
                        </Group>
                    </Card>
                </Box>

                {/* Section: Galeri */}
                <Box id="galeri">
                    <Card withBorder radius="lg" p="xl">
                        <Title order={3} mb="lg">Galeri</Title>
                        <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
                            {COMPANY_DATA.gallery.map((img, idx) => (
                                <Image
                                    key={idx}
                                    src={img}
                                    radius="md"
                                    h={180}
                                    fit="cover"
                                    alt="Company Gallery"
                                    style={{ border: '1px solid var(--mantine-color-gray-2)' }}
                                />
                            ))}
                        </SimpleGrid>
                    </Card>
                </Box>

                {/* Section: Loker (4 Kolom) */}
                <Box id="loker">
                    <Card withBorder radius="lg" p="xl" bg="gray.0">
                        <Title order={3} mb="lg">Lowongan di {COMPANY_DATA.name}</Title>
                        {/* UPDATE: Menggunakan 4 kolom di layar besar (lg) */}
                        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
                            {JOBS_DATA.map((job) => (
                                <Card key={job.id} shadow="sm" padding="md" radius="md" withBorder bg="white">
                                    <Group align="start" justify="space-between" mb="xs">
                                        <Group gap="xs">
                                            <IconCheck size={14} color="var(--mantine-color-blue-5)" />
                                            <Text fw={700} size="xs" c="dimmed">{job.company}</Text>
                                        </Group>
                                    </Group>

                                    <Text fw={600} size="sm" mb={2} lineClamp={2} style={{ minHeight: 42 }}>{job.title}</Text>
                                    <Text size="xs" c="dimmed" mb="md">{job.location}</Text>

                                    <Group gap="xs" mb="lg">
                                        <Badge variant="light" color="gray" radius="sm" size="xs">{job.type}</Badge>
                                    </Group>

                                    <Divider mb="xs" />

                                    <Group justify="space-between" align="center">
                                        <Text fw={700} size="xs" c="blue.6">{job.salary}</Text>
                                        <Button
                                            component={Link}
                                            href={`/${companySlug}/vacancy-detail`}
                                            variant="subtle"
                                            size="xs"
                                            color="gray"
                                        >
                                            Detail
                                        </Button>
                                    </Group>
                                </Card>
                            ))}
                        </SimpleGrid>
                    </Card>
                </Box>

            </Stack>
        </Container>
    );
}