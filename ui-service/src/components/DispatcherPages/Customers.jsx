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
  PasswordInput,
  Box,
  Center,
} from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons";
import {
  useGetCustomers,
  useDeleteUser,
  useUpdateUser,
  useCreateUser,
} from "./DispatcherAPI";
import { useForm, isEmail, hasLength, matches } from "@mantine/form";
import { useStyles } from "../MultilineEllipsisStyle";

function Customers() {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const [createOpened, setCreateOpened] = useState(false);
  const [deleteOpened, setDeleteOpened] = useState(false);
  const [updateOpened, setUpdateOpened] = useState(false);
  const [updatePasswordOpened, setUpdatePasswordOpened] = useState(false);

  const customer = useForm({
    initialValues: {
      id: "",
      email: "",
      rfidToken: "",
      password: "",
      userRole: "CUSTOMER",
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
  const resCustomers = useGetCustomers();
  const mutationDelete = useDeleteUser("CUSTOMER");
  const mutationUpdate = useUpdateUser("CUSTOMER");
  const mutationCreate = useCreateUser("CUSTOMER");

  const customers = resCustomers.data;

  const handleDeleteCustomerButtonClick = () => {
    mutationDelete.mutate(customer.values.id, {
      onSuccess: () => {
        setDeleteOpened(false);
      },
    });
  };

  const handleUpdateCustomerButtonClick = (type) => {
    let body = {};
    if (type === "updateCustomer") {
      body = { ...customer.values };
      delete body.password;
    } else {
      body = customer.values;
    }
    mutationUpdate.mutate(body, {
      onSuccess: () => {
        setUpdateOpened(false);
        setUpdatePasswordOpened(false);
        customer.reset();
      },
    });
  };

  const handleCreateCustomerButtonClick = () => {
    mutationCreate.mutate(customer.values, {
      onSuccess: () => {
        setCreateOpened(false);
        customer.reset();
      },
    });
  };

  const handleDeleteModalButtonClick = (item) => {
    customer.setValues(item);
    setDeleteOpened(true);
  };

  const handleUpdateModalButtonClick = (item, type) => {
    customer.setValues(item);
    if (type === "updateCustomer") {
      customer.setFieldValue("password", "dummypass");
      setUpdateOpened(true);
    } else {
      setUpdatePasswordOpened(true);
    }
  };

  if (resCustomers.isLoading) {
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
  if (resCustomers.isError) {
    return <div>Error! {resCustomers.error.message}</div>;
  }

  const rows = customers.map((item) => {
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
            onClick={() => handleUpdateModalButtonClick(item, "updateCustomer")}
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
          Customers
        </Title>
        <Button
          color="pink"
          radius="xl"
          mx={50}
          onClick={() => {
            customer.reset();
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
          onSubmit={customer.onSubmit(() => {
            handleCreateCustomerButtonClick();
          })}
        >
          <Stack align="left">
            <Title size={24} color="pink">
              Create Customer
            </Title>
            <TextInput
              placeholder="Customer's Email"
              label="Email"
              withAsterisk
              {...customer.getInputProps("email")}
            />
            <PasswordInput
              placeholder="Customer's Password"
              label="Password"
              withAsterisk
              {...customer.getInputProps("password")}
            />
            <TextInput
              placeholder="Customer's RFID"
              label="RFID"
              withAsterisk
              {...customer.getInputProps("rfidToken")}
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
          onSubmit={customer.onSubmit(() => {
            handleUpdateCustomerButtonClick("updateCustomer");
          })}
        >
          <Stack align="left">
            <Title size={24} color="pink">
              Update Customer
            </Title>
            <TextInput
              placeholder="Customer's Email"
              label="Email"
              value={customer.values.email}
              withAsterisk
              {...customer.getInputProps("email")}
            />
            <TextInput
              placeholder="Customer's RFID"
              label="RFID"
              value={customer.values.rfidToken}
              withAsterisk
              {...customer.getInputProps("rfidToken")}
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
      </Modal>{" "}
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
          onSubmit={customer.onSubmit(() => {
            handleUpdateCustomerButtonClick("updatePassword");
          })}
        >
          <Stack align="left">
            <Title size={24} color="pink">
              Update Password
            </Title>
            <PasswordInput
              placeholder="Customer's Password"
              label="Password"
              value={customer.values.password}
              withAsterisk
              {...customer.getInputProps("password")}
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
            Delete Customer
          </Title>
          <Text>Are you sure to delete customer?</Text>
        </Stack>
        <Group position="right">
          <Button
            color="pink"
            radius="sm"
            size="sm"
            onClick={handleDeleteCustomerButtonClick}
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

export default Customers;
