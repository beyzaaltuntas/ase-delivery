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
  TextInput,
  HoverCard,
  Spoiler,
  Loader,
  Box,
  Center,
} from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons";
import {
  useGetDispatcherBoxes,
  useCreateBox,
  useDeleteBox,
  useUpdateBox,
} from "./DispatcherAPI";
import { useForm, isNotEmpty, matches } from "@mantine/form";
import { useStyles } from "../MultilineEllipsisStyle";

function DispatcherBoxes() {
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const [createOpened, setCreateOpened] = useState(false);
  const [deleteOpened, setDeleteOpened] = useState(false);
  const [updateOpened, setUpdateOpened] = useState(false);
  const box = useForm({
    initialValues: {
      id: "",
      name: "",
      raspberryId: "",
      street: "",
      zip: "",
      city: "",
    },

    validate: {
      name: isNotEmpty("Box name should not be empty."),
      raspberryId: matches(/^[0-9\b]+$/, "Enter a Raspberry ID number."),
      street: isNotEmpty("Street should not be empty."),
      zip: matches(/^[0-9\b]+$/, "Enter a valid ZIP code."),
      city: isNotEmpty("City should not be empty."),
    },
  });

  const { data, error, isError, isLoading } = useGetDispatcherBoxes();
  const mutationCreate = useCreateBox();
  const mutationDelete = useDeleteBox();
  const mutationUpdate = useUpdateBox();

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

  const handleCreateBoxButtonClick = () => {
    mutationCreate.mutate(box.values, {
      onSuccess: () => {
        setCreateOpened(false);
      },
    });
  };

  const handleDeleteBoxButtonClick = () => {
    mutationDelete.mutate(box.values.id, {
      onSuccess: () => {
        setDeleteOpened(false);
      },
    });
  };

  const handleUpdateBoxButtonClick = () => {
    mutationUpdate.mutate(box.values, {
      onSuccess: () => {
        setUpdateOpened(false);
      },
    });
  };

  const handleDeleteModalButtonClick = (item) => {
    box.setValues(item);
    setDeleteOpened(true);
  };

  const handleUpdateModalButtonClick = (item) => {
    box.setValues(item);
    setUpdateOpened(true);
  };

  const rows = data.map((item) => {
    return (
      <tr key={item.id}>
        <td>
          <Group spacing="sm">
            <Text size="sm" weight={500} fw={700}>
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
          <Text size="sm" weight={500}>
            {item.street}
          </Text>
          <Text size="sm" weight={500}>
            {item.zip}
          </Text>{" "}
          <Text size="sm" weight={500}>
            {item.city}
          </Text>
        </td>
        <td>
          <Group spacing="sm">
            {item.customer ? (
              <HoverCard width={280} shadow="md">
                <HoverCard.Target>
                  <Text
                    size="sm"
                    weight={500}
                    className={classes.multilineEllipsis}
                  >
                    {item.customer.email}
                  </Text>
                </HoverCard.Target>
                <HoverCard.Dropdown sx={{ backgroundColor: "#413f3e" }}>
                  <Text size="sm" color={"white"}>
                    {item.customer.email}
                  </Text>
                </HoverCard.Dropdown>
              </HoverCard>
            ) : (
              <Text></Text>
            )}
          </Group>
        </td>
        <td>
          <Spoiler maxHeight={45} showLabel="Show All" hideLabel="Hide">
            <Stack spacing="sm">
              {item.delivererList.length !== 0 ? (
                <Text size="sm" weight={500}>
                  {item.delivererList.map((el) => el.email + "\n")}
                </Text>
              ) : (
                <Text></Text>
              )}
            </Stack>
          </Spoiler>
        </td>

        <td>
          <Button
            loaderPosition="right"
            mr={10}
            onClick={() => handleUpdateModalButtonClick(item)}
          >
            <IconEdit size={14} />
          </Button>
          <Button
            loaderPosition="right"
            color={"red"}
            onClick={() => handleDeleteModalButtonClick(item)}
          >
            <IconTrash size={14} />
          </Button>
        </td>
      </tr>
    );
  });

  return (
    <>
      <Group position="apart" mb={30} mt={10}>
        <Title order={2} mx={50}>
          Boxes
        </Title>
        <Button
          color="pink"
          radius="xl"
          mx={50}
          onClick={() => {
            box.reset();
            setCreateOpened(true);
          }}
        >
          +
        </Button>
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
              <th>Name</th>
              <th>RaspberryId ID</th>
              <th>Status</th>
              <th>Address</th>
              <th>Customer</th>
              <th>Deliverer List</th>
              <th>Operations</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
      <Modal
        opened={createOpened}
        withCloseButton={false}
        onClose={() => setCreateOpened(false)}
        size="sm"
        centered
        trapFocus={false}
        overlayColor={
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : theme.colors.gray[2]
        }
        overlayOpacity={0.55}
        overlayBlur={3}
      >
        <Box
          component="form"
          maw={400}
          mx="auto"
          onSubmit={box.onSubmit(() => {
            handleCreateBoxButtonClick();
          })}
        >
          <Stack align="left">
            <Title size={24} color="pink">
              Create Box
            </Title>
            <TextInput
              placeholder="Box's Name"
              label="Name"
              withAsterisk
              {...box.getInputProps("name")}
            />
            <TextInput
              placeholder="Box's Rasperry ID"
              label="Rasperry ID"
              withAsterisk
              {...box.getInputProps("raspberryId")}
            />
            <TextInput
              placeholder="Street"
              label="Address"
              withAsterisk
              {...box.getInputProps("street")}
            />
            <Group spacing="xs" grow>
              <TextInput
                placeholder="ZIP Code"
                withAsterisk
                {...box.getInputProps("zip")}
              />
              <TextInput
                placeholder="City"
                withAsterisk
                {...box.getInputProps("city")}
              />
            </Group>
          </Stack>
          <Group position="right">
            <Button color="pink" radius="sm" size="sm" type="submit" mt={20}>
              Submit
            </Button>
            <Button
              color="blue"
              radius="sm"
              size="sm"
              onClick={() => setCreateOpened(false)}
              mt={20}
            >
              Cancel
            </Button>
          </Group>
        </Box>
      </Modal>
      <Modal
        opened={updateOpened}
        withCloseButton={false}
        onClose={() => setUpdateOpened(false)}
        size="sm"
        centered
        trapFocus={false}
        overlayColor={
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : theme.colors.gray[2]
        }
        overlayOpacity={0.55}
        overlayBlur={3}
      >
        <Box
          component="form"
          maw={400}
          mx="auto"
          onSubmit={box.onSubmit(() => {
            handleUpdateBoxButtonClick();
          })}
        >
          <Stack align="left">
            <Title size={24} color="pink">
              Update Box
            </Title>
            <TextInput
              placeholder="Box's Name"
              label="Name"
              value={box.values.name}
              withAsterisk
              {...box.getInputProps("name")}
            />
            <TextInput
              placeholder="Box's Rasperry ID"
              label="Rasperry ID"
              value={box.values.raspberryId}
              withAsterisk
              {...box.getInputProps("raspberryId")}
            />
            <TextInput
              placeholder="Street"
              label="Address"
              value={box.values.street}
              withAsterisk
              {...box.getInputProps("street")}
            />
            <Group spacing="xs" grow>
              <TextInput
                placeholder="ZIP Code"
                value={box.values.zip}
                withAsterisk
                {...box.getInputProps("zip")}
              />
              <TextInput
                placeholder="City"
                value={box.values.city}
                withAsterisk
                {...box.getInputProps("city")}
              />
            </Group>
          </Stack>
          <Group position="right">
            <Button color="pink" radius="sm" size="sm" type="submit" mt={20}>
              Update
            </Button>
            <Button
              color="blue"
              radius="sm"
              size="sm"
              onClick={() => setUpdateOpened(false)}
              mt={20}
            >
              Cancel
            </Button>
          </Group>
        </Box>
      </Modal>
      <Modal
        opened={deleteOpened}
        withCloseButton={false}
        onClose={() => setDeleteOpened(false)}
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
          <Title size={24} color="pink">
            Delete Box
          </Title>
          <Text>Are you sure to delete box?</Text>
        </Stack>
        <Group position="right">
          <Button
            color="pink"
            radius="sm"
            size="sm"
            onClick={handleDeleteBoxButtonClick}
            mt={20}
          >
            Delete
          </Button>
          <Button
            color="blue"
            radius="sm"
            size="sm"
            onClick={() => setDeleteOpened(false)}
            mt={20}
          >
            Cancel
          </Button>
        </Group>
      </Modal>
    </>
  );
}

export default DispatcherBoxes;
