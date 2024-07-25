import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface IGroupExpenseVerifyEmailProps {
  validationCode: string;
  expiredPeriod: string;
}

export const GroupExpenseVerifyEmail = ({
  validationCode = '123456',
  expiredPeriod = '5 minutes',
}: IGroupExpenseVerifyEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://lh3.googleusercontent.com/drive-viewer/AKGpihakqD4yd17gAhpH2l1VQBu5FmgOAqowLdI8z34jMWQeIl63UIJVsbDfXk0GfNef4DImQB9SBt_jSkbnm8h3K8B6VdxDBj76fas=s1600-rw-v1"
          width="212"
          height="88"
          alt="Group Expense"
          style={logo}
        />
        <Text style={tertiary}>Verify Your Email</Text>
        <Heading style={secondary}>
          Enter the following code to start using Group Expense
        </Heading>
        <Section style={codeContainer}>
          <Text style={code}>{validationCode}</Text>
          <Text style={codeWarning}>Code expires in {expiredPeriod}</Text>
        </Section>
        <Text style={paragraph}>Not expecting this email?</Text>
        <Text style={paragraph}>
          Contact{' '}
          <Link href="mailto:groupexpense.calvin@gmail.com" style={link}>
            groupexpense.calvin@gmail.com
          </Link>{' '}
          if you did not request this code.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default GroupExpenseVerifyEmail;

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #eee',
  borderRadius: '5px',
  boxShadow: '0 5px 10px rgba(20,50,70,.2)',
  marginTop: '20px',
  maxWidth: '360px',
  margin: '0 auto',
  padding: '68px 20px',
};

const logo = {
  margin: '0 auto',
  width: '90px',
  aspectRatio: '1',
  borderRadius: '50%',
} as React.CSSProperties;

const tertiary = {
  color: '#f6d146',
  fontSize: '11px',
  fontWeight: 700,
  fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
  height: '16px',
  letterSpacing: '0',
  lineHeight: '16px',
  margin: '16px 8px 8px 8px',
  textTransform: 'uppercase' as const,
  textAlign: 'center' as const,
};

const secondary = {
  color: '#000',
  display: 'inline-block',
  fontFamily: 'HelveticaNeue-Medium,Helvetica,Arial,sans-serif',
  fontSize: '20px',
  fontWeight: 500,
  lineHeight: '24px',
  marginBottom: '0',
  marginTop: '0',
  textAlign: 'center' as const,
};

const codeContainer = {
  background: 'rgba(0,0,0,.05)',
  borderRadius: '4px',
  margin: '16px auto 16px',
  padding: '8px 0px',
  verticalAlign: 'middle',
  width: '280px',
} as React.CSSProperties;

const code = {
  color: '#000',
  display: 'inline-block',
  fontFamily: 'HelveticaNeue-Bold',
  fontSize: '32px',
  fontWeight: 700,
  letterSpacing: '6px',
  lineHeight: '40px',
  margin: '0 auto',
  width: '100%',
  textAlign: 'center' as const,
};

const codeWarning = {
  margin: '0 auto',
  textAlign: 'center' as const,
} as React.CSSProperties;

const paragraph = {
  color: '#444',
  fontSize: '15px',
  fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
  letterSpacing: '0',
  lineHeight: '23px',
  padding: '0 40px',
  margin: '0',
  textAlign: 'center' as const,
};

const link = {
  color: '#444',
  textDecoration: 'underline',
};
