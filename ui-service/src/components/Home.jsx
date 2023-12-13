import {
  Title,
  Text,
  Container,
  Button,
  Center,
  AppShell,
  BackgroundImage,
} from "@mantine/core";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LOGO from "../assets/LOGO.png";

function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.clear();
  });

  return (
    <BackgroundImage src={LOGO}>
      <AppShell
        style={{
          backgroundColor: "rgba(0,0,0,0.8)",
        }}
      >
        <Center
          style={{
            height: "100%",
          }}
        >
          <Container>
            <Text color={"blue"} weight={700} size={100}>
              Ase Delivery
            </Text>

            <Title color={"white"}>
              Smart Delivery Service for{" "}
              <Text color="#ff5657" span inherit>
                Everyone
              </Text>
            </Title>
            <Container my={20}>
              <Text color={"white"} size="lg">
                Experience lightning-fast delivery of your every need, as we
                take pride in delivering your desires directly to your doorstep.
                With our cutting-edge technology and exceptional customer
                service, your satisfaction is guaranteed every time you choose
                us.
              </Text>
            </Container>

            <Button
              gradient={{ from: "#ed6ea0", to: "#ec8c69", deg: 35 }}
              variant="gradient"
              size="lg"
              onClick={(event) => {
                event.preventDefault();
                navigate("/customer/login");
              }}
            >
              Customer Login
            </Button>
            <Button
              variant="gradient"
              size="lg"
              mx={10}
              onClick={(event) => {
                event.preventDefault();
                navigate("/deliverer/login");
              }}
            >
              Deliverer Login
            </Button>
            <Button
              gradient={{ from: "pink", to: "blue", deg: 35 }}
              variant="gradient"
              size="lg"
              onClick={(event) => {
                event.preventDefault();
                navigate("/dispatcher/login");
              }}
            >
              Dispatcher Login
            </Button>
          </Container>
        </Center>
      </AppShell>
    </BackgroundImage>
  );
}

export default Home;
