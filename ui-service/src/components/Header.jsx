import ASE from "../assets/ASE.gif";
import { Header, Group } from "@mantine/core";
import { useAuth } from "../AuthProvider";

function CustomerHeader() {
  const { isLoading, isAuthenticated } = useAuth();

  if (!isAuthenticated && isLoading) {
    return;
  }

  return (
    <Header height={{ base: 50, md: 70 }} p="md">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Group position="apart" mr="md" ml="xs">
          <img src={ASE} width={250} height={66.67} />
        </Group>
      </div>
    </Header>
  );
}

export default CustomerHeader;
