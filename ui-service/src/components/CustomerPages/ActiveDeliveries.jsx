import { useState } from "react";
import {
  Table,
  ScrollArea,
  Group,
  Text,
  Button,
  Title,
  Modal,
  useMantineTheme,
  Stack,
  Loader,
  Center,
} from "@mantine/core";
import { IconTir, IconStatusChange, IconPackage } from "@tabler/icons";
import { useGetActiveDeliveries } from "./CustomerAPI";
import { useStyles } from "../MultilineEllipsisStyle";

function ActiveDeliveries() {
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const [detailsOpened, setDetailsOpened] = useState(false);
  const [delivery, setDelivery] = useState({});

  const resActiveDeliveries = useGetActiveDeliveries();
  if (resActiveDeliveries.isLoading) {
    return (
      <Center
        style={{
          height: "100%",
        }}
      >
        <Loader />
      </Center>
    );
  }
  if (resActiveDeliveries.isError) {
    return <div>Error! {resActiveDeliveries.error.message}</div>;
  }

  const handleOpenButtonClick = (item) => {
    setDelivery(item);
    setDetailsOpened(true);
  };

  const rows = resActiveDeliveries.data.map((item) => {
    return (
      <tr key={item.id}>
        <td>
          <Group spacing="sm">
            <Text
              size="sm"
              weight={500}
              fw={700}
              color="teal"
              className={classes.multilineEllipsis}
            >
              {item.trackingCode}
            </Text>
          </Group>
        </td>
        <td>
          <Text fw={700} color="red" className={classes.multilineEllipsis}>
            {item.status.replace("_", " ")}
          </Text>
        </td>
        <td>
          <Button
            color="pink"
            radius="xl"
            size="xs"
            compact
            onClick={() => handleOpenButtonClick(item)}
          >
            Details
          </Button>
        </td>
      </tr>
    );
  });

  return (
    <>
      <Title order={2} mx={50} mb={30} mt={10}>
        Active Deliveries
      </Title>
      <ScrollArea mx={80}>
        <Table
          sx={{
            width: "100%",
            tableLayout: "fixed",
            overflowWrap: "break-word",
          }}
          verticalSpacing="sm"
          striped
          highlightOnHover
          withBorder
        >
          <thead>
            <tr>
              <th>Tracking Code</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
        <Modal
          opened={detailsOpened}
          trapFocus={false}
          withCloseButton={false}
          onClose={() => setDetailsOpened(false)}
          size="sm"
          centered
          overlayColor={
            theme.colorScheme === "dark"
              ? theme.colors.dark[9]
              : theme.colors.gray[2]
          }
          overlayOpacity={0.55}
          overlayBlur={3}
        >
          <Stack align="left">
            <Group position="apart">
              <Title size={24} color="pink">
                Delivery Details
              </Title>
            </Group>
            <Group position="apart">
              <Group>
                <IconTir stroke={1}></IconTir>
                <Text fw={700}>TRACKING CODE </Text>
              </Group>
              <Text color="teal">{delivery.trackingCode}</Text>
            </Group>
            <Group position="apart">
              <Group>
                <IconStatusChange stroke={1}></IconStatusChange>
                <Text fw={700}>STATUS </Text>
              </Group>
              <Text color="red">{delivery.status?.replace("_", " ")}</Text>
            </Group>
            <Group>
              <IconPackage stroke={1}></IconPackage>
              <Text fw={700}> BOX ADDRESS </Text>
            </Group>
          </Stack>
          <Group position="apart">
            <Text ml={40} color="blue">
              Street Name
            </Text>
            <Text>{delivery.pickupBox?.street}</Text>
          </Group>
          <Group position="apart">
            <Text ml={40} color="blue">
              Postcode
            </Text>
            <Text>{delivery.pickupBox?.zip}</Text>
          </Group>
          <Group position="apart">
            <Text ml={40} color="blue">
              City
            </Text>
            <Text>{delivery.pickupBox?.city}</Text>
          </Group>
          <Group position="apart">
            <Text ml={40} color="blue">
              Country
            </Text>
            <Text>Germany</Text>
          </Group>
          <Group position="right">
            <Button
              color="pink"
              radius="sm"
              size="sm"
              onClick={() => setDetailsOpened(false)}
              mt={20}
            >
              Close
            </Button>
          </Group>
        </Modal>
      </ScrollArea>
    </>
  );
}

export default ActiveDeliveries;
