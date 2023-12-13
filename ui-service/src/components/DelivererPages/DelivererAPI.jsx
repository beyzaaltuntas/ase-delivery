import { useAuth } from "../../AuthProvider";

import { useQuery, useMutation } from "react-query";
import { showNotification } from "@mantine/notifications";
import { IconX, IconCheck } from "@tabler/icons";

function useGetDelivererBoxes() {
  const { axios } = useAuth();
  return useQuery("getDelivererBoxes", async () => {
    const { data } = await axios.get(
      "/delivery-service/pickupbox/assigned-boxes"
    );
    return data;
  });
}

function useGetDelivererDeliveries(boxId) {
  const { axios } = useAuth();
  return useQuery(["getDelivererDeliveries", boxId], async () => {
    const { data } = await axios.get(
      "/delivery-service/delivery/assigned-deliveries/" + boxId
    );
    return data;
  });
}

function useUpdateDeliveryStatus() {
  const { axios } = useAuth();
  const updateDeliveryStatus = async (deliveryId) => {
    const { data } = await axios.patch(
      "/delivery-service/delivery/qr-verification/" + deliveryId.deliveryId,
      {}
    );
    return data;
  };

  return useMutation(updateDeliveryStatus, {
    onSuccess: () => {
      showNotification({
        id: "success-notification-qr",
        autoClose: 5000,
        title: "Success",
        message: "Successfully assigned.",
        icon: <IconCheck />,
        className: "my-notification-class",
        loading: false,
      });
    },
    onError: (error) => {
      showNotification({
        id: "error-notification-qr",
        autoClose: 5000,
        title: "Error",
        message: error.response?.data,
        color: "red",
        icon: <IconX />,
        className: "my-notification-class",
        loading: false,
      });
    },
  });
}

export {
  useGetDelivererBoxes,
  useGetDelivererDeliveries,
  useUpdateDeliveryStatus,
};
