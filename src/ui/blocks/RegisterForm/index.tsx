'use client'

import {
    Anchor,
    Button,
    Checkbox,
    Container,
    Divider,
    Group,
    Paper,
    PasswordInput,
    Select,
    SimpleGrid,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';

export function RegisterForm() {
    const form = useForm({
        initialValues: {
            firstName: '', lastName: '', email: '', phone: '', position: 'Owner',
            companyName: '', industry: '', employees: '', companyPhone: '',
            address: '', city: '', taxId: '', website: '',
            password: '', confirmPassword: '', terms: false,
        },
        validate: {
            email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
            password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
            confirmPassword: (val, values) => (val !== values.password ? 'Passwords did not match' : null),
        },
    });

    return (
        <Container size={800} my={40}>
            <Title ta="center" fw={900}>
                Register Your Account
            </Title>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
                Join Klop! to find your perfect candidate match
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <form onSubmit={form.onSubmit((values) => console.log(values))}>

                    <Title order={4} mb="md" c="blue.7">1. Account Owner Information</Title>
                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                        <TextInput label="First Name" placeholder="John" required {...form.getInputProps('firstName')} />
                        <TextInput label="Last Name" placeholder="Doe" required {...form.getInputProps('lastName')} />
                    </SimpleGrid>

                    <TextInput mt="md" label="Email" placeholder="john@example.com" required {...form.getInputProps('email')} />

                    <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md" spacing="md">
                        <TextInput label="Phone Number" placeholder="+62..." required {...form.getInputProps('phone')} />
                        <Select
                            label="Position"
                            placeholder="Select Position"
                            data={['Owner', 'HR Manager', 'Recruiter']}
                            defaultValue="Owner"
                            {...form.getInputProps('position')}
                        />
                    </SimpleGrid>

                    <Divider my="xl" label="Company Details" labelPosition="center" />

                    <Title order={4} mb="md" c="blue.7">2. Company Information</Title>
                    <TextInput label="Company Name" placeholder="PT. Your Company" required {...form.getInputProps('companyName')} />

                    <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md" spacing="md">
                        <Select label="Industry" placeholder="Select Industry" data={['Tech', 'Health', 'Finance']} required {...form.getInputProps('industry')} />
                        <Select label="Number of Employees" placeholder="Select Range" data={['1-10', '11-50', '50+']} required {...form.getInputProps('employees')} />
                    </SimpleGrid>

                    <TextInput mt="md" label="Company Phone" placeholder="+62 21..." required {...form.getInputProps('companyPhone')} />
                    <TextInput mt="md" label="Address" placeholder="Jl. Sudirman No..." required {...form.getInputProps('address')} />

                    <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md" spacing="md">
                        <TextInput label="City" placeholder="Jakarta" required {...form.getInputProps('city')} />
                        <TextInput label="Tax ID (NPWP)" placeholder="xx.xxx.xxx..." {...form.getInputProps('taxId')} />
                    </SimpleGrid>

                    <TextInput mt="md" label="Website" placeholder="https://yourcompany.com" {...form.getInputProps('website')} />

                    <Divider my="xl" />

                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                        <PasswordInput label="Password" placeholder="Your password" required {...form.getInputProps('password')} />
                        <PasswordInput label="Confirm Password" placeholder="Confirm password" required {...form.getInputProps('confirmPassword')} />
                    </SimpleGrid>

                    <Group justify="space-between" mt="xl">
                        <Checkbox label="I agree to the Terms & Conditions" {...form.getInputProps('terms', { type: 'checkbox' })} />
                    </Group>

                    <Button fullWidth mt="xl" size="md" type="submit">
                        Create Account
                    </Button>

                    <Text ta="center" mt="md">
                        Already have an account?{' '}
                        <Anchor href="/login" fw={700}>
                            Login
                        </Anchor>
                    </Text>
                </form>
            </Paper>
        </Container>
    );
}