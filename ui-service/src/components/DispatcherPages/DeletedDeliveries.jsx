import {
  Table,
  ScrollArea,
  Group,
  Text,
  Title,
  Stack,
  Loader,
  Center,
} from "@mantine/core";

import { useGetDeletedDeliveries } from "./DispatcherAPI";
import { useStyles } from "../MultilineEllipsisStyle";

function DeletedDeliveries() {
  const { classes } = useStyles();

  const { data, isError, error, isLoading } = useGetDeletedDeliveries();

  if (isLoading) {
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
  if (isError) {
    return <div>Error! {error.message}</div>;
  }

  const timeFormat = (timestamp) => {
    if (timestamp === null) {
      return null;
    }
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(timestamp);
  };

  const rows = data.map((item) => {
    return (
      <tr key={item.id}>
        <td>
          <Group spacing="sm">
            <Text size="sm" weight={500} className={classes.multilineEllipsis}>
              {item.customerEmail}
            </Text>
          </Group>
        </td>
        <td>
          <Group spacing="sm">
            <Text
              size="sm"
              weight={500}
              color={"gray"}
              fw={700}
              className={classes.multilineEllipsis}
            >
              CANCELED
            </Text>
            from
            <Text
              size="sm"
              className={classes.multilineEllipsis}
              weight={500}
              color={"red"}
              fw={700}
            >
              {item.lastDeliveryStatus.replace("_", " ")}
            </Text>
          </Group>
        </td>
        <td>
          <Group spacing="sm">
            <Text
              size="sm"
              weight={500}
              className={classes.multilineEllipsis}
              fw={700}
            >
              {item.pickupBox?.name}
            </Text>
          </Group>
        </td>
        <td>
          <Stack spacing="sm">
            <Text size="sm" weight={500} className={classes.multilineEllipsis}>
              {item.delivererEmail}
            </Text>
          </Stack>
        </td>
        <td>
          <Stack spacing="sm">
            <Text size="sm" weight={500} className={classes.multilineEllipsis}>
              {timeFormat(item.createdAt)}
            </Text>
          </Stack>
        </td>
        <td>
          <Stack spacing="sm">
            <Text size="sm" weight={500} className={classes.multilineEllipsis}>
              {timeFormat(item.deletedAt)}
            </Text>
          </Stack>
        </td>
      </tr>
    );
  });

  return (
    <>
      <Group position="apart" mb={30} mt={10}>
        <Title order={2} mx={50}>
          Deleted Deliveries
        </Title>
      </Group>
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
              <th>Customer</th>
              <th>Status</th>
              <th>Box</th>
              <th>Deliverer</th>
              <th>Created At</th>
              <th>Deleted At</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    </>
  );
}

export default DeletedDeliveries;
