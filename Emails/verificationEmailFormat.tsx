import { Html, Head, Font, Preview, Heading, Row, Section, Text, Button } from "@react-email/components";
import { StringValidation } from "zod";
interface verificationEmailProps {
    username: string;
    otp: string;
}

export default function verificationEmail({ username, otp }: verificationEmailProps) {
    return (
        <Html lang="en" dir="ltr">
            <Head>
                <title>Verification Code </title>
                <Font fontFamily="Roboto" fallbackFontFamily="Verdana" webFont={{
                    url: 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap',
                    format: 'woff2'
                }}
                    fontWeight={400}
                    fontStyle="normal" />

            </Head>
            <Preview>
                Here&apos;s your Verification code: {otp}
            </Preview>
            <Section>
                <Row>
                    <Heading as="h1">
                        Verify Your Account
                    </Heading>
                </Row>
                <Row>
                    <Text>
                        Dear {username},
                    </Text>
                </Row>
                <Row>
                    <Text>
                        Thank you for registering, Please use this verification code to verify your email address, to proceed further.
                    </Text>
                </Row>
                <Row>
                    <Text>
                        Verification code: {otp}
                    </Text>
                </Row>
                <Row>
                    <Text>
                        If you didn&apos;t request this verification, please ignore this email.
                    </Text>
                </Row>
                <Row>
                    <Text>
                        Thanks,
                    </Text>
                </Row>

            </Section>
        </Html>


    )
}