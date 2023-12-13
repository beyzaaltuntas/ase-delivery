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
import DelivererLoginImg from "../../assets/DelivererLogin.png";
import { useForm, isEmail, isNotEmpty } from "@mantine/form";
import { useAuth } from "../../AuthProvider";

function DelivererLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const credentialsDeliverer = useForm({
    initialValues: {
      email: "",
      password: "",
      userRole: "DELIVERER",
    },

    validate: {
      email: isEmail("Invalid email"),
      password: isNotEmpty("Password should not be empty."),
    },
  });

  const handleDelivererLoginButtonClick = () => {
    login(credentialsDeliverer.values);
  };

  return (
    <BackgroundImage src={DelivererLoginImg}>
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
              onSubmit={credentialsDeliverer.onSubmit(() => {
                handleDelivererLoginButtonClick();
              })}
            >
              <Title
                mb={20}
                align="center"
                color="white"
                sx={(theme) => ({
                  fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                  fontWeight: 900,
                })}
              >
                Welcome to ASE DELIVERY!
              </Title>
              <Paper withBorder shadow="md" p={20} radius="md">
                <Text mx={"auto"} size="md" weight={500} align="center">
                  Deliverer Login
                </Text>
                <TextInput
                  label="Email"
                  placeholder="you@mantine.dev"
                  {...credentialsDeliverer.getInputProps("email")}
                />
                <PasswordInput
                  label="Password"
                  placeholder="Your password"
                  mt="md"
                  {...credentialsDeliverer.getInputProps("password")}
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

export default DelivererLogin;
