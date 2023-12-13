import { useState } from "react";
import TrackDeliveryImg from "../../assets/TrackDeliveryImg.png";
import {
  Group,
  Text,
  Button,
  Title,
  TextInput,
  Stack,
  Card,
  Image,
  Stepper,
  Modal,
  useMantineTheme,
  Loader,
  Center,
} from "@mantine/core";
import {
  IconBuildingWarehouse,
  IconTruckDelivery,
  IconPackgeExport,
  IconBoxSeam,
  IconX,
} from "@tabler/icons";
import { showNotification } from "@mantine/notifications";
import { useTrackDelivery } from "./CustomerAPI";

function TrackDelivery() {
  const theme = useMantineTheme();
  const [trackOpened, setTrackOpened] = useState(false);
  const [trackCode, setTrackCode] = useState("");

  const { data, isLoading, refetch } = useTrackDelivery(
    trackCode,
    setTrackOpened
  );

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

  const activeCount = () => {
    let count = 1;

    if (data?.pickedUpAt !== null) {
      count++;
    }
    if (data?.depositedAt !== null) {
      count++;
    }
    if (data?.collectedAt !== null) {
      count++;
    }
    return count;
  };

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

  const handleTrackDeliveryButtonClick = () => {
    if (trackCode === "") {
      showNotification({
        id: "error-notification-empty-code",
        autoClose: 5000,
        title: "Error",
        message: "You must fill input field!",
        color: "red",
        icon: <IconX />,
        className: "my-notification-class",
        loading: false,
      });
    } else {
      refetch();
    }
  };

  return (
    <>
      <Group position="apart" mb={30} mt={10}>
        <Title order={2} mx={50}>
          Track Delivery
        </Title>
      </Group>
      <Card shadow="sm" p="lg" radius="md" mx={80} withBorder>
        <Card.Section>
          <Image src={TrackDeliveryImg} height={160} alt="Norway" />
        </Card.Section>
        <Group position="apart" mt="md" mb="xs">
          <Text weight={500}>Track a Delivery From Code</Text>
        </Group>
        <Stack>
          <Text size="sm" color="dimmed">
            Enter tracking code of a delivery to see detailed information about
            delivery steps.
          </Text>
          <TextInput
            onChange={(e) => {
              setTrackCode(e.target.value);
            }}
            withAsterisk
            value={trackCode}
          ></TextInput>
        </Stack>
        <Stack align="center" mt="md" mb="xs">
          <Button
            variant="light"
            color="blue"
            radius="md"
            onClick={handleTrackDeliveryButtonClick}
          >
            Track Delivery
          </Button>
        </Stack>
      </Card>
      <Modal
        opened={trackOpened}
        withCloseButton={false}
        onClose={() => setTrackOpened(false)}
        size={"70%"}
        centered
        overlayColor={
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : theme.colors.gray[2]
        }
        overlayOpacity={0.55}
        overlayBlur={3}
      >
        <Stack align="center" mb="md">
          <Title size={24} color="pink" mb="md">
            Track Delivery
          </Title>
        </Stack>
        <Stepper active={activeCount()}>
          <Stepper.Step
            completedIcon={<IconBuildingWarehouse />}
            icon={<IconBuildingWarehouse size={18} />}
            label="IN WAREHOUSE"
            description={timeFormat(data?.createdAt)}
          />
          <Stepper.Step
            completedIcon={<IconTruckDelivery />}
            icon={<IconTruckDelivery size={18} />}
            label="IN DELIVERY"
            description={timeFormat(data?.pickedUpAt)}
          />
          <Stepper.Step
            completedIcon={<IconBoxSeam />}
            icon={<IconBoxSeam size={18} />}
            label="IN PICKUPBOX"
            description={timeFormat(data?.depositedAt)}
          />
          <Stepper.Step
            completedIcon={<IconPackgeExport />}
            icon={<IconPackgeExport size={18} />}
            label="DELIVERED"
            description={timeFormat(data?.collectedAt)}
          />
        </Stepper>
      </Modal>
    </>
  );
}

export default TrackDelivery;
