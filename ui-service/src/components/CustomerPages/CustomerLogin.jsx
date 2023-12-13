import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
  BackgroundImage,
  AppShell,
  Center,
  Text,
  Box,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import CustomerLoginImg from "../../assets/CustomerLogin.webp";
import { useAuth } from "../../AuthProvider";
import { useForm, isEmail, isNotEmpty } from "@mantine/form";

function CustomerLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const credentialsCustomer = useForm({
    initialValues: {
      email: "",
      password: "",
      userRole: "CUSTOMER",
    },

    validate: {
      email: isEmail("Invalid email"),
      password: isNotEmpty("Password should not be empty."),
    },
  });

  const handleCustomerLoginButtonClick = () => {
    login(credentialsCustomer.values);
  };

  return (
    <BackgroundImage src={CustomerLoginImg}>
      <AppShell
        style={{
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <Center
          style={{
            height: "100%",
          }}
        >
          <Container size={420}>
            <Box
              component="form"
              maw={400}
              mx="auto"
              onSubmit={credentialsCustomer.onSubmit(() => {
                handleCustomerLoginButtonClick();
              })}
            >
              <Title
                mb={20}
                align="center"
                color="white"
                sx={(theme) => ({
                  fontFamily: `Verdana, sans-serif, ${theme.fontFamily}`,
                  fontWeight: 900,
                })}
              >
                Welcome to ASE DELIVERY!
              </Title>
              <Paper withBorder shadow="md" p={20} radius="md">
                <Text mx={"auto"} size="md" weight={500} align="center">
                  Customer Login
                </Text>
                <TextInput
                  label="Email"
                  placeholder="you@mantine.dev"
                  {...credentialsCustomer.getInputProps("email")}
                />
                <PasswordInput
                  label="Password"
                  placeholder="Your password"
                  mt="md"
                  {...credentialsCustomer.getInputProps("password")}
                />
                <Button fullWidth mt="xl" type="submit">
                  Sign in
                </Button>
              </Paper>
            </Box>
          </Container>
        </Center>
      </AppShell>
    </BackgroundImage>
  );
}

export default CustomerLogin;
