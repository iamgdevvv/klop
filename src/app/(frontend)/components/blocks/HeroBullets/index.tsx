'use client'

import {
  Button,
  Container,
  Group,
  Image,
  List,
  Text,
  ThemeIcon,
  Title
} from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

import classes from './HeroBullets.module.css';

interface HeroBulletsProps {
  title?: React.ReactNode;
  description?: string;
  imageSrc?: string;
}

export function HeroBullets({
  title,
  description,
  imageSrc = ""
}: HeroBulletsProps) {

  return (
    <Container size="md">
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>
            Temukan Kandidat yang <span className={classes.highlight}>Klop!</span> dengan Bantuan AI
          </Title>

          <Text c="dimmed" mt="md">
            {description || "Rekrutmen bukan sekadar mencari nilai tinggi, tapi menemukan kecocokan. Klop! membantu Anda meracik asesmen, menilai secara objektif, dan menemukan talenta yang benar-benar pas dengan kultur perusahaan."}
          </Text>

          <List
            mt={30}
            spacing="sm"
            size="sm"
            icon={
              <ThemeIcon size={20} radius="xl">
                <IconCheck size={12} stroke={1.5} />
              </ThemeIcon>
            }
          >
            <List.Item>
              <b>Asesmen Otomatis</b> – AI meracik pertanyaan yang relevan dan presisi.
            </List.Item>
            <List.Item>
              <b>Penilaian Objektif</b> – Hilangkan bias dengan *scoring* instan dan adil.
            </List.Item>
            <List.Item>
              <b>Insight Kandidat</b> – Keputusan lebih percaya diri dengan data kecocokan.
            </List.Item>
          </List>

          <Group mt={30}>
            <Button radius="xl" size="md" className={classes.control}>
              Coba Klop! Sekarang
            </Button>
            <Button variant="default" radius="xl" size="md" className={classes.control}>
              Pelajari Cara Kerja
            </Button>
          </Group>
        </div>

        {/* Gambar Ilustrasi */}
        {/* Class image di CSS sudah mengatur agar responsive */}
        <Image
          src={imageSrc}
          className={classes.image}
          alt="Ilustrasi Seleksi Kandidat Klop"
        />
      </div>
    </Container>
  );
}