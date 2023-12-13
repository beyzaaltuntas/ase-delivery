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
  Loader,
  Box,
  PasswordInput,
  Center,
} from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons";
import {
  useGetDeliverers,
  useDeleteUser,
  useUpdateUser,
  useCreateUser,
} from "./DispatcherAPI";
import { useForm, isEmail, hasLength, matches } from "@mantine/form";
import { useStyles } from "../MultilineEllipsisStyle";

function Deliverers() {
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const [createOpened, setCreateOpened] = useState(false);
  const [deleteOpened, setDeleteOpened] = useState(false);
  const [updateOpened, setUpdateOpened] = useState(false);
  const [updatePasswordOpened, setUpdatePasswordOpened] = useState(false);
  const deliverer = useForm({
    initialValues: {
      id: "",
      email: "",
      rfidToken: "",
      password: "",
      userRole: "DELIVERER",
    },

    validate: {
      email: isEmail("Invalid email"),
      password: hasLength(
        { min: 8, max: 32 },
        "Password lenght should be between 8 - 32 characters."
      ),
      rfidToken: matches(/^[0-9\b]+$/, "Enter a RFID token number."),
    },
  });

  const resDeliverers = useGetDeliverers();
  const mutationDelete = useDeleteUser("DELIVERER");
  const mutationUpdate = useUpdateUser("DELIVERER");
  const mutationCreate = useCreateUser("DELIVERER");

  if (resDeliverers.isLoading) {
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
  if (resDeliverers.isError) {
    return <div>Error! {resDeliverers.error.message}</div>;
  }

  const deliverers = resDeliverers.data;

  const handleDeleteDelivererButtonClick = () => {
    mutationDelete.mutate(deliverer.values.id, {
      onSuccess: () => {
        setDeleteOpened(false);
      },
    });
  };

  const handleUpdateDelivererButtonClick = (type) => {
    let body = {};
    if (type === "updateDeliverer") {
      body = { ...deliverer.values };
      delete body.password;
    } else {
      body = deliverer.values;
    }

    mutationUpdate.mutate(body, {
      onSuccess: () => {
        setUpdateOpened(false);
        setUpdatePasswordOpened(false);
        deliverer.reset();
      },
    });
  };

  const handleCreateDelivererButtonClick = () => {
    mutationCreate.mutate(deliverer.values, {
      onSuccess: () => {
        setCreateOpened(false);
        deliverer.reset();
      },
    });
  };
  const handleDeleteModalButtonClick = (item) => {
    deliverer.setValues(item);
    setDeleteOpened(true);
  };

  const handleUpdateModalButtonClick = (item, type) => {
    deliverer.setValues(item);
    if (type === "updateDeliverer") {
      deliverer.setFieldValue("password", "dummypass");
      setUpdateOpened(true);
    } else {
      setUpdatePasswordOpened(true);
    }
  };

  const rows = deliverers.map((item) => {
    return (
      <tr key={item.id}>
        <td>
          <Group spacing="sm">
            <Text size="sm" weight={500} className={classes.multilineEllipsis}>
              {item.email}
            </Text>
          </Group>
        </td>
        <td>
          <Text fw={700} color="indigo" className={classes.multilineEllipsis}>
            {item.rfidToken}
          </Text>
        </td>
        <td>
          <Button
            loaderPosition="right"
            mr={10}
            color={"indigo"}
            onClick={() => handleUpdateModalButtonClick(item, "updatePassword")}
          >
            Update
          </Button>
        </td>
        <td>
          <Button
            loaderPosition="right"
            mr={10}
            onClick={() =>
              handleUpdateModalButtonClick(item, "updateDeliverer")
            }
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
          Deliverers
        </Title>
        <Button
          color="pink"
          radius="xl"
          mx={50}
          onClick={() => {
            deliverer.reset();
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
              <th>Email</th>
              <th>RFID</th>
              <th>Password</th>
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
          onSubmit={deliverer.onSubmit(() => {
            handleCreateDelivererButtonClick();
          })}
        >
          <Stack align="left">
            <Title size={24} color="pink">
              Create Deliverer
            </Title>
            <TextInput
              placeholder="Deliverer's Email"
              label="Email"
              withAsterisk
              {...deliverer.getInputProps("email")}
            />
            <PasswordInput
              placeholder="Deliverer's Password"
              label="Password"
              withAsterisk
              {...deliverer.getInputProps("password")}
            />
            <TextInput
              placeholder="Deliverer's RFID"
              label="RFID"
              withAsterisk
              {...deliverer.getInputProps("rfidToken")}
            />
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
          onSubmit={deliverer.onSubmit(() => {
            handleUpdateDelivererButtonClick("updateDeliverer");
          })}
        >
          <Stack align="left">
            <Title size={24} color="pink">
              Update Deliverer
            </Title>
            <TextInput
              placeholder="Deliverer's Email"
              label="Email"
              value={deliverer.values.email}
              withAsterisk
              {...deliverer.getInputProps("email")}
            />
            <TextInput
              placeholder="Deliverer's RFID"
              label="RFID"
              value={deliverer.values.rfidToken}
              withAsterisk
              {...deliverer.getInputProps("rfidToken")}
            />
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
        opened={updatePasswordOpened}
        withCloseButton={false}
        onClose={() => setUpdatePasswordOpened(false)}
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
          onSubmit={deliverer.onSubmit(() => {
            handleUpdateDelivererButtonClick("updatePassword");
          })}
        >
          <Stack align="left">
            <Title size={24} color="pink">
              Update Password
            </Title>
            <PasswordInput
              placeholder="Deliverer's Password"
              label="Password"
              value={deliverer.values.password}
              withAsterisk
              {...deliverer.getInputProps("password")}
            />
          </Stack>
          <Group position="right">
            <Button color="pink" radius="sm" size="sm" type="submit" mt={20}>
              Update
            </Button>
            <Button
              color="blue"
              radius="sm"
              size="sm"
              onClick={() => setUpdatePasswordOpened(false)}
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
            Delete Deliverer
          </Title>
          <Text>Are you sure to delete deliverer?</Text>
        </Stack>
        <Group position="right">
          <Button
            color="pink"
            radius="sm"
            size="sm"
            onClick={handleDeleteDelivererButtonClick}
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

export default Deliverers;
