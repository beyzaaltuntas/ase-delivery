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
  useGetDispatchers,
  useDeleteUser,
  useUpdateUser,
  useCreateUser,
} from "./DispatcherAPI";
import { useForm, isEmail, hasLength } from "@mantine/form";
import { useStyles } from "../MultilineEllipsisStyle";

function Dispatchers() {
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const [createOpened, setCreateOpened] = useState(false);
  const [deleteOpened, setDeleteOpened] = useState(false);
  const [updateOpened, setUpdateOpened] = useState(false);
  const [updatePasswordOpened, setUpdatePasswordOpened] = useState(false);
  const dispatcher = useForm({
    initialValues: {
      id: "",
      email: "",
      password: "",
      userRole: "DISPATCHER",
    },

    validate: {
      email: isEmail("Invalid email"),
      password: hasLength(
        { min: 8, max: 32 },
        "Password lenght should be between 8 - 32 characters."
      ),
    },
  });

  const resDispatchers = useGetDispatchers();
  const mutationDelete = useDeleteUser("DISPATCHER");
  const mutationUpdate = useUpdateUser("DISPATCHER");
  const mutationCreate = useCreateUser("DISPATCHER");

  if (resDispatchers.isLoading) {
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
  if (resDispatchers.isError) {
    return <div>Error! {resDispatchers.error.message}</div>;
  }

  const dispatchers = resDispatchers.data;

  const handleDeleteDispatcherButtonClick = () => {
    mutationDelete.mutate(dispatcher.values.id, {
      onSuccess: () => {
        setDeleteOpened(false);
      },
    });
  };

  const handleUpdateDispatcherButtonClick = (type) => {
    let body = {};
    if (type === "updateDispatcher") {
      body = { ...dispatcher.values };
      delete body.password;
    } else {
      body = dispatcher.values;
    }

    mutationUpdate.mutate(body, {
      onSuccess: () => {
        setUpdateOpened(false);
        setUpdatePasswordOpened(false);
        dispatcher.reset();
      },
    });
  };

  const handleCreateDispatcherButtonClick = () => {
    mutationCreate.mutate(dispatcher.values, {
      onSuccess: () => {
        setCreateOpened(false);
        dispatcher.reset();
      },
    });
  };

  const handleDeleteModalButtonClick = (item) => {
    dispatcher.setValues(item);
    setDeleteOpened(true);
  };

  const handleUpdateModalButtonClick = (item, type) => {
    dispatcher.setValues(item);
    if (type === "updateDispatcher") {
      dispatcher.setFieldValue("password", "dummypass");
      setUpdateOpened(true);
    } else {
      setUpdatePasswordOpened(true);
    }
  };

  const rows = dispatchers.map((item) => {
    if (item.email !== "ase-delivery@gmail.com") {
      return (
        <tr key={item.id}>
          <td>
            <Group spacing="sm">
              <Text
                size="sm"
                weight={500}
                className={classes.multilineEllipsis}
              >
                {item.email}
              </Text>
            </Group>
          </td>
          <td>
            <Button
              loaderPosition="right"
              mr={10}
              color={"indigo"}
              onClick={() =>
                handleUpdateModalButtonClick(item, "updatePassword")
              }
            >
              Update
            </Button>
          </td>
          <td>
            <Button
              loaderPosition="right"
              mr={10}
              onClick={() =>
                handleUpdateModalButtonClick(item, "updateDispatcher")
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
    }
  });

  return (
    <>
      <Group position="apart" mb={30} mt={10}>
        <Title order={2} mx={50}>
          Dispatchers
        </Title>
        <Button
          color="pink"
          radius="xl"
          mx={50}
          onClick={() => {
            dispatcher.reset();
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
          onSubmit={dispatcher.onSubmit(() => {
            handleCreateDispatcherButtonClick();
          })}
        >
          <Stack align="left">
            <Title size={24} color="pink">
              Create Dispatcher
            </Title>
            <TextInput
              placeholder="Dispatcher's Email"
              label="Email"
              withAsterisk
              {...dispatcher.getInputProps("email")}
            />
            <PasswordInput
              placeholder="Dispatcher's Password"
              label="Password"
              withAsterisk
              {...dispatcher.getInputProps("password")}
            />
          </Stack>
          <Group position="right">
            <Button color="pink" radius="sm" size="sm" mt={20} type="submit">
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
          onSubmit={dispatcher.onSubmit(() => {
            handleUpdateDispatcherButtonClick("updateDispatcher");
          })}
        >
          <Stack align="left">
            <Title size={24} color="pink">
              Update Dispatcher
            </Title>
            <TextInput
              placeholder="Dispatcher's Email"
              label="Email"
              value={dispatcher.values.email}
              withAsterisk
              {...dispatcher.getInputProps("email")}
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
          onSubmit={dispatcher.onSubmit(() => {
            handleUpdateDispatcherButtonClick("updatePassword");
          })}
        >
          <Stack align="left">
            <Title size={24} color="pink">
              Update Password
            </Title>
            <PasswordInput
              placeholder="Dispatcher's Password"
              label="Password"
              value={dispatcher.values.password}
              withAsterisk
              {...dispatcher.getInputProps("password")}
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
            Delete Dispatcher
          </Title>
          <Text>Are you sure to delete dispatcher?</Text>
        </Stack>
        <Group position="right">
          <Button
            color="pink"
            radius="sm"
            size="sm"
            onClick={handleDeleteDispatcherButtonClick}
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

export default Dispatchers;
