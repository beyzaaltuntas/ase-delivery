import { useState } from "react";
import {
  Table,
  ScrollArea,
  Group,
  Text,
  Title,
  Stack,
  Modal,
  useMantineTheme,
  Button,
  Loader,
  Center,
} from "@mantine/core";
import {
  useGetDelivererBoxes,
  useGetDelivererDeliveries,
} from "./DelivererAPI";
import { useStyles } from "../MultilineEllipsisStyle";

function DelivererBoxes() {
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const [detailsOpened, setDetailsOpened] = useState(false);
  const [box, setBox] = useState({});

  const resGetBoxes = useGetDelivererBoxes();
  const resGetDeliveries = useGetDelivererDeliveries(box.id);
  const handleOpenButtonClick = (box) => {
    setBox(box);
    setDetailsOpened(true);
  };

  if (resGetBoxes.isLoading || resGetDeliveries.isLoading) {
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
  if (resGetBoxes.isError) {
    return <div>Error! {resGetBoxes.error.message}</div>;
  }

  if (resGetDeliveries.isError) {
    return <div>Error! {resGetDeliveries.error.message}</div>;
  }

  const boxes = resGetBoxes.data;
  const deliveries = resGetDeliveries.data;

  const rowsBoxes = boxes.map((item) => {
    return (
      <tr key={item.id}>
        <td>
          <Group spacing="sm">
            <Text
              size="sm"
              weight={500}
              fw={700}
              className={classes.multilineEllipsis}
            >
              {item.name}
            </Text>
          </Group>
        </td>
        <td>
          <Group spacing="sm">
            <Text
              size="sm"
              weight={500}
              color={"blue"}
              fw={700}
              className={classes.multilineEllipsis}
            >
              {item.raspberryId}
            </Text>
          </Group>
        </td>
        <td>
          <Group spacing="sm">
            <Text
              size="sm"
              weight={500}
              color={"orange"}
              fw={700}
              className={classes.multilineEllipsis}
            >
              {item.status.replace("_", " ")}
            </Text>
          </Group>
        </td>
        <td>
          <Text size="sm" weight={500} className={classes.multilineEllipsis}>
            {item.street}
          </Text>
          <Text size="sm" weight={500} className={classes.multilineEllipsis}>
            {item.zip}
          </Text>{" "}
          <Text size="sm" weight={500} className={classes.multilineEllipsis}>
            {item.city}
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

  const rowsDeliveries = deliveries?.map((item) => {
    return (
      <tr key={item.id}>
        <td>
          <Group spacing="sm">
            <Text size="sm" weight={500} color={"red"} fw={700}>
              {item.status.replace("_", " ")}
            </Text>
          </Group>
        </td>
        <td>
          <Group spacing="sm">
            <Text size="sm" weight={500} color={"teal"} fw={700}>
              {item.trackingCode}
            </Text>
          </Group>
        </td>
      </tr>
    );
  });

  return (
    <>
      <Title order={2} mx={50} mb={30} mt={10}>
        Boxes
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
              <th>Name</th>
              <th>RaspberryId ID</th>
              <th>Status</th>
              <th>Address</th>
              <th>Deliveries</th>
            </tr>
          </thead>
          <tbody>{rowsBoxes}</tbody>
        </Table>
      </ScrollArea>
      <Modal
        opened={detailsOpened}
        trapFocus={false}
        withCloseButton={false}
        onClose={() => setDetailsOpened(false)}
        size="lg"
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
          <ScrollArea mx={20}>
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
                  <th>Status</th>
                  <th>Tracking Code</th>
                </tr>
              </thead>
              <tbody>{rowsDeliveries}</tbody>
            </Table>
          </ScrollArea>
        </Stack>
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
    </>
  );
}

export default DelivererBoxes;
