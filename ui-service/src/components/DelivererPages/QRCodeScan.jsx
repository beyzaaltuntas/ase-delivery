import { useState } from "react";
import {
  Group,
  Button,
  Title,
  Modal,
  useMantineTheme,
  Stack,
  Card,
  Text,
  Image,
} from "@mantine/core";
import { QrReader } from "react-qr-reader";
import { useUpdateDeliveryStatus } from "./DelivererAPI";
import ScanQRCodeImg from "../../assets/ScanQRCodeImg.png";

function Dispatchers() {
  const theme = useMantineTheme();

  const [qrScanOpened, setQRScanOpened] = useState(false);
  const [data, setData] = useState("NoResult");
  const mutationUpdateStatus = useUpdateDeliveryStatus();

  const handleCheckDeliveryButtonClick = () => {
    mutationUpdateStatus.mutate(
      { deliveryId: data },
      {
        onSuccess: () => {
          setQRScanOpened(false);
        },
      }
    );
  };

  return (
    <>
      <Stack align="flex-start" mb={30} mt={10}>
        <Title order={2} mx={50}>
          Scan QR Code
        </Title>
        <Title order={5} mx={50}></Title>
      </Stack>
      <Card shadow="sm" p="lg" radius="md" mx={80} withBorder>
        <Card.Section>
          <Image src={ScanQRCodeImg} height={160} alt="Norway" />
        </Card.Section>
        <Group position="apart" mt="md" mb="xs">
          <Text weight={500}> Scan QR Code</Text>
        </Group>
        <Stack>
          <Text size="sm" color="dimmed">
            For scanning QR code, click the button below.
          </Text>
        </Stack>
        <Stack align="center" mt="xs" mb="xs">
          <Button
            color="pink"
            radius="xl"
            mx={50}
            onClick={() => setQRScanOpened(true)}
          >
            Scan QR Code
          </Button>
        </Stack>
      </Card>
      <Modal
        opened={qrScanOpened}
        withCloseButton={false}
        onClose={() => setQRScanOpened(false)}
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
        <Stack align="center">
          <Title size={24} color="pink">
            Scan QR Code
          </Title>
        </Stack>
        <QrReader
          onResult={(result, error) => {
            if (!!result) {
              setData(result?.text);
            } else {
              setData("NoResult");
            }
          }}
          style={{ width: "100%" }}
        />
        <Group position="center">
          <Button
            color="pink"
            radius="sm"
            size="sm"
            onClick={handleCheckDeliveryButtonClick}
            mt={20}
          >
            Check Delivery
          </Button>
          <Button
            color="blue"
            radius="sm"
            size="sm"
            onClick={() => setQRScanOpened(false)}
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
