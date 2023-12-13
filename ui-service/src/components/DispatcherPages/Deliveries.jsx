import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
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
  Select,
  Loader,
  Box,
  Center,
} from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons";
import { useForm, isNotEmpty } from "@mantine/form";

import {
  useGetDeliveries,
  useGetCustomerEmails,
  useGetPickupboxNames,
  useGetDelivererEmails,
  useCreateDelivery,
  useDeleteDelivery,
  useUpdateDelivery,
} from "./DispatcherAPI";
import { useStyles } from "../MultilineEllipsisStyle";

const deliveryStatuses = [
  { value: "IN_WAREHOUSE", label: "IN WAREHOUSE" },
  { value: "IN_DELIVERY", label: "IN DELIVERY" },
  { value: "IN_PICKUPBOX", label: "IN PICKUPBOX" },
  { value: "DELIVERED", label: "DELIVERED" },
];
function Deliveries() {
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const [createOpened, setCreateOpened] = useState(false);
  const [deleteOpened, setDeleteOpened] = useState(false);
  const [updateOpened, setUpdateOpened] = useState(false);
  const [qrCodeOpened, setQRCodeOpened] = useState(false);
  const delivery = useForm({
    initialValues: {
      id: "",
      customerId: "",
      pickupBoxId: "",
      delivererId: "",
      status: "IN_WAREHOUSE",
    },

    validate: {
      customerId: isNotEmpty("Customer id value should not be empty."),
      pickupBoxId: isNotEmpty("Pickupbox id value should not be empty."),
      delivererId: isNotEmpty("Deliverer id value should not be empty."),
      status: isNotEmpty("Delivery status should not be empty."),
    },
  });

  const resDelivery = useGetDeliveries();
  const resCustomerEmail = useGetCustomerEmails();
  const resDelivererEmail = useGetDelivererEmails();
  const resPickupBoxNames = useGetPickupboxNames();
  const mutationCreate = useCreateDelivery();
  const mutationDelete = useDeleteDelivery();
  const mutationUpdate = useUpdateDelivery();

  const handleCreateDeliveryButtonClick = () => {
    mutationCreate.mutate(delivery.values, {
      onSuccess: () => {
        setCreateOpened(false);
      },
    });
  };
  const handleDeleteDeliveryButtonClick = () => {
    mutationDelete.mutate(delivery.values.id, {
      onSuccess: () => {
        setDeleteOpened(false);
      },
    });
  };
  const handleUpdateDeliveryButtonClick = () => {
    mutationUpdate.mutate(delivery.values, {
      onSuccess: () => {
        setUpdateOpened(false);
      },
    });
  };

  if (
    resDelivery.isLoading ||
    resCustomerEmail.isLoading ||
    resDelivererEmail.isLoading ||
    resPickupBoxNames.isLoading ||
    mutationCreate.isLoading ||
    mutationUpdate.isLoading
  ) {
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
  if (resDelivery.isError) {
    return <div>Error! {resDelivery.error.message}</div>;
  }

  if (resCustomerEmail.isError) {
    return <div>Error! {resCustomerEmail.error.message}</div>;
  }

  if (resDelivererEmail.isError) {
    return <div>Error! {resDelivererEmail.error.message}</div>;
  }

  if (resPickupBoxNames.isError) {
    return <div>Error! {resPickupBoxNames.error.message}</div>;
  }

  const customerEmails = [];
  resCustomerEmail.data.map((customer) =>
    customerEmails.push({ value: customer.id, label: customer.email })
  );

  const delivererEmails = [];
  resDelivererEmail.data.map((deliverer) =>
    delivererEmails.push({ value: deliverer.id, label: deliverer.email })
  );

  const pickupNames = [];
  resPickupBoxNames.data.map((pickupBox) =>
    pickupNames.push({ value: pickupBox.id, label: pickupBox.name })
  );

  const deliveries = resDelivery.data;

  const handleDeleteModalButtonClick = (item) => {
    delivery.setValues(item);
    setDeleteOpened(true);
  };

  const handleUpdateModalButtonClick = (item) => {
    delivery.setValues(item);

    setUpdateOpened(true);
  };

  const handleGenerateQRCodeButtonClick = (item) => {
    delivery.setValues(item);
    setQRCodeOpened(true);
  };

  const handleDownloadQRCodeButtonClick = () => {
    const canvas = document.getElementById("qr-gen");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${delivery.values.id}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const rows = deliveries.map((item) => {
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
              color={"red"}
              fw={700}
              className={classes.multilineEllipsis}
            >
              {item.status.replace("_", " ")}
            </Text>
          </Group>
        </td>
        <td>
          <Text
            size="sm"
            weight={500}
            color={"teal"}
            fw={700}
            className={classes.multilineEllipsis}
          >
            {item.trackingCode}
          </Text>
        </td>
        <td>
          <Text
            size="sm"
            weight={500}
            className={classes.multilineEllipsis}
            fw={700}
          >
            {item.pickupBox?.name}
          </Text>
        </td>
        <td>
          <Stack spacing="sm">
            <Text size="sm" weight={500} className={classes.multilineEllipsis}>
              {item.delivererEmail}
            </Text>
          </Stack>
        </td>
        <td>
          <Text size="sm" weight={500} className={classes.multilineEllipsis}>
            {new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }).format(item.createdAt)}
          </Text>
        </td>
        <td>
          <Button
            color="pink"
            size="xs"
            radius="sm"
            onClick={() => handleGenerateQRCodeButtonClick(item)}
          >
            Generate
            <br />
            QR Code
          </Button>
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
          Deliveries
        </Title>
        <Button
          color="pink"
          radius="xl"
          mx={50}
          onClick={() => {
            delivery.reset();
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
              <th>Customer</th>
              <th>Status</th>
              <th>Tracking Code</th>
              <th>Box</th>
              <th>Deliverer</th>
              <th>Created At</th>
              <th>QR Code</th>
              <th>Operations</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
      <Modal
        opened={createOpened}
        withCloseButton={false}
        trapFocus={false}
        onClose={() => setCreateOpened(false)}
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
        <Box
          component="form"
          maw={400}
          mx="auto"
          onSubmit={delivery.onSubmit(() => {
            handleCreateDeliveryButtonClick();
          })}
        >
          <Stack align="left">
            <Title size={24} color="pink">
              Create Delivery
            </Title>
            <Select
              label="Customer"
              placeholder="Select Customer"
              searchable
              withAsterisk
              nothingFound="No options"
              maxDropdownHeight={280}
              data={customerEmails}
              {...delivery.getInputProps("customerId")}
            />
            <Select
              label="Box"
              placeholder="Select Box"
              searchable
              withAsterisk
              nothingFound="No options"
              maxDropdownHeight={280}
              data={pickupNames}
              {...delivery.getInputProps("pickupBoxId")}
            />
            <Select
              label="Deliverer"
              placeholder="Select Deliverer"
              searchable
              withAsterisk
              nothingFound="No options"
              maxDropdownHeight={280}
              data={delivererEmails}
              {...delivery.getInputProps("delivererId")}
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
        trapFocus={false}
        centered
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
          onSubmit={delivery.onSubmit(() => {
            handleUpdateDeliveryButtonClick();
          })}
        >
          <Stack align="left">
            <Title size={24} color="pink">
              Update Delivery
            </Title>
            <Select
              label="Customer"
              placeholder="Select Customer"
              searchable
              withAsterisk
              nothingFound="No options"
              defaultValue={
                customerEmails.find(
                  (el) => el.value === delivery.values.customerId
                )?.value
              }
              data={customerEmails}
              {...delivery.getInputProps("customerId")}
            />
            <Select
              label="Box"
              placeholder="Select Box"
              searchable
              withAsterisk
              nothingFound="No options"
              maxDropdownHeight={280}
              defaultValue={
                pickupNames.find(
                  (el) => el.value === delivery.values.pickupBoxId
                )?.value
              }
              data={pickupNames}
              {...delivery.getInputProps("pickupBoxId")}
            />
            <Select
              label="Deliverer"
              placeholder="Select Deliverer"
              searchable
              withAsterisk
              nothingFound="No options"
              maxDropdownHeight={280}
              defaultValue={
                delivererEmails.find(
                  (el) => el.value === delivery.values.delivererId
                )?.value
              }
              data={delivererEmails}
              {...delivery.getInputProps("delivererId")}
            />
            <Select
              label="Delivery Status"
              placeholder="Select Delivery Status"
              searchable
              withAsterisk
              nothingFound="No options"
              maxDropdownHeight={280}
              defaultValue={
                deliveryStatuses.find(
                  (el) => el.value === delivery.values.status
                )?.value
              }
              data={deliveryStatuses}
              {...delivery.getInputProps("status")}
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
            Delete Delivery
          </Title>
          <Text>Are you sure to delete delivery?</Text>
        </Stack>
        <Group position="right">
          <Button
            color="pink"
            radius="sm"
            size="sm"
            onClick={handleDeleteDeliveryButtonClick}
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
      <Modal
        opened={qrCodeOpened}
        withCloseButton={false}
        onClose={() => setQRCodeOpened(false)}
        size="xs"
        centered
        overlayColor={
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : theme.colors.gray[2]
        }
        overlayOpacity={0.55}
        overlayBlur={3}
      >
        <Stack align="center">
          <Title size={24} color="pink">
            Generate QR Code
          </Title>
          <QRCodeCanvas
            id="qr-gen"
            value={delivery.values.id}
            size={250}
            level={"H"}
            includeMargin={true}
          />
        </Stack>
        <Group position="center">
          <Button
            color="pink"
            radius="sm"
            size="sm"
            onClick={handleDownloadQRCodeButtonClick}
            mt={20}
          >
            Download
          </Button>
          <Button
            color="blue"
            radius="sm"
            size="sm"
            onClick={() => setQRCodeOpened(false)}
            mt={20}
          >
            Cancel
          </Button>
        </Group>
      </Modal>
    </>
  );
}

export default Deliveries;
