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
import { useAuth } from "../../AuthProvider";
import DispatcherLoginImg from "../../assets/DispatcherLogin.jpeg";
import { useForm, isEmail, isNotEmpty } from "@mantine/form";

function DispatcherLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const credentialsDispatcher = useForm({
    initialValues: {
      email: "",
      password: "",
      userRole: "DISPATCHER",
    },

    validate: {
      email: isEmail("Invalid email"),
      password: isNotEmpty("Password should not be empty."),
    },
  });

  const handleDispatcherLoginButtonClick = () => {
    login(credentialsDispatcher.values);
  };

  return (
    <BackgroundImage src={DispatcherLoginImg}>
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
              onSubmit={credentialsDispatcher.onSubmit(() => {
                handleDispatcherLoginButtonClick();
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
                  Dispatcher Login
                </Text>
                <TextInput
                  label="Email"
                  placeholder="you@mantine.dev"
                  {...credentialsDispatcher.getInputProps("email")}
                />
                <PasswordInput
                  label="Password"
                  placeholder="Your password"
                  mt="md"
                  {...credentialsDispatcher.getInputProps("password")}
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

export default DispatcherLogin;
