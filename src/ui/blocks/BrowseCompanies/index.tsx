'use client';

import {
    Avatar, Badge, Box, Button, Card, Container, Group,
    SimpleGrid, Stack, Text, TextInput, Title
} from '@mantine/core';
import { ArrowRight, Building2, MapPin, Search } from 'lucide-react';
import Link from 'next/link';

// --- MOCK DATA ---
const COMPANIES = [
    { id: 1, name: "Tokopedia", industry: "Internet", location: "Jakarta", jobs: 12, logo: "https://assets.tokopedia.net/assets-tokopedia-lite/v2/zeus/kratos/60524cdd.png", slug: "tokopedia" },
    { id: 2, name: "Traveloka", industry: "Travel & Tech", location: "Jakarta", jobs: 8, logo: "https://images.glints.com/unsafe/glints-dashboard.s3.amazonaws.com/company-logo/8f6e2e36c7c006767223605273397972.png", slug: "traveloka" },
    { id: 3, name: "Gojek", industry: "Transportation", location: "Jakarta", jobs: 24, logo: "https://lelogama.go-jek.com/component/nav/logo_gajek_horizontal_black_2.svg", slug: "gojek" },
    { id: 4, name: "Bank Jago", industry: "Banking", location: "Jakarta", jobs: 5, logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Logo_Bank_Jago_2020.svg/2560px-Logo_Bank_Jago_2020.svg.png", slug: "bank-jago" },
    { id: 5, name: "Ruangguru", industry: "EdTech", location: "Jakarta", jobs: 10, logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Ruangguru_Logo.png/1200px-Ruangguru_Logo.png", slug: "ruangguru" },
    { id: 6, name: "Halodoc", industry: "HealthTech", location: "Jakarta", jobs: 3, logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Halodoc_logo.svg/2560px-Halodoc_logo.svg.png", slug: "halodoc" },
];

export function BrowseCompanies() {
    return (
        <Container size="xl" py={60}>

            {/* --- HEADER SEARCH --- */}
            <Stack align="center" mb={60} gap="md" ta="center">
                <Badge variant="light" size="lg" color="blue">Discover</Badge>
                <Title order={1} size={48} fw={900} style={{ letterSpacing: -1 }}>
                    Temukan Perusahaan Impian
                </Title>
                <Text c="dimmed" size="lg" maw={600}>
                    Jelajahi perusahaan teknologi terbaik yang menggunakan Klop! untuk mencari talenta seperti Anda.
                </Text>

                <Box w="100%" maw={600} mt="lg" style={{ position: 'relative' }}>
                    <TextInput
                        placeholder="Cari nama perusahaan..."
                        size="xl"
                        radius="xl"
                        leftSection={<Search size={20} />}
                        rightSection={
                            <Button radius="xl" size="sm" color="blue">Cari</Button>
                        }
                        rightSectionWidth={80}
                        style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                    />
                </Box>
            </Stack>

            {/* --- GRID COMPANIES --- */}
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
                {COMPANIES.map((company) => (
                    <Card
                        key={company.id}
                        padding="lg"
                        radius="lg"
                        withBorder
                        bg="white"
                        className="hover-card"
                        style={{ transition: 'transform 0.2s, box-shadow 0.2s' }}
                    >
                        <Group justify="space-between" mb="lg">
                            <Avatar
                                src={company.logo}
                                size="lg"
                                radius="md"
                                style={{ border: '1px solid var(--mantine-color-gray-2)' }}
                            />
                            <Badge variant="light" color="gray">{company.jobs} Jobs</Badge>
                        </Group>

                        <Title order={3} size="h4" mb={4}>{company.name}</Title>

                        <Stack gap="xs" mb="xl">
                            <Group gap={6}>
                                <Building2 size={16} color="gray" />
                                <Text size="sm" c="dimmed">{company.industry}</Text>
                            </Group>
                            <Group gap={6}>
                                <MapPin size={16} color="gray" />
                                <Text size="sm" c="dimmed">{company.location}</Text>
                            </Group>
                        </Stack>

                        <Button
                            component={Link}
                            href={`/${company.slug}`}
                            variant="light"
                            color="blue"
                            fullWidth
                            radius="md"
                            rightSection={<ArrowRight size={16} />}
                        >
                            Lihat Profil
                        </Button>
                    </Card>
                ))}
            </SimpleGrid>

        </Container>
    );
}