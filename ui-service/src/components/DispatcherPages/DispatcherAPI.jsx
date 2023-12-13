import { useAuth } from "../../AuthProvider";

import { useQuery, useMutation, useQueryClient } from "react-query";
import { showNotification } from "@mantine/notifications";
import { IconX, IconCheck } from "@tabler/icons";

//Delivery API
function useGetDeliveries() {
  const { axios } = useAuth();
  return useQuery("getDeliveries", async () => {
    const { data } = await axios.get("/delivery-service/delivery");
    return data;
  });
}

function useGetCustomerEmails() {
  const { axios } = useAuth();
  return useQuery("getCustomerEmails", async () => {
    const { data } = await axios.get(
      "/authentication-service/user/customer/emails"
    );
    return data;
  });
}

function useGetPickupboxNames() {
  const { axios } = useAuth();
  return useQuery("getPickupNames", async () => {
    const { data } = await axios.get("/delivery-service/pickupbox/names");
    return data;
  });
}

function useGetDelivererEmails() {
  const { axios } = useAuth();
  return useQuery("getDelivererEmails", async () => {
    const { data } = await axios.get(
      "/authentication-service/user/deliverer/emails"
    );
    return data;
  });
}
function useGetDeletedDeliveries() {
  const { axios } = useAuth();
  return useQuery("getDeletedDeliveries", async () => {
    const { data } = await axios.get(
      "/delivery-service/delivery/deleted-deliveries"
    );
    return data;
  });
}

function useCreateDelivery() {
  const { axios } = useAuth();
  const queryClient = useQueryClient();

  const createDelivery = async (delivery) => {
    const { data } = await axios.post("/delivery-service/delivery", delivery);
    return data;
  };

  return useMutation(createDelivery, {
    onSuccess: () => {
      queryClient.invalidateQueries("getDeliveries");
      showNotification({
        id: "success-notification-create-delivery",
        autoClose: 5000,
        title: "Success",
        message: "Successfully created delivery.",
        icon: <IconCheck />,
        className: "my-notification-class",
        loading: false,
      });
    },
    onError: (error) => {
      showNotification({
        id: "error-notification-create-delivery",
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

function useUpdateDelivery() {
  const { axios } = useAuth();
  const queryClient = useQueryClient();

  const updateDelivery = async (delivery) => {
    const { data } = await axios.put(
      "/delivery-service/delivery/" + delivery.id,
      delivery
    );
    return data;
  };

  return useMutation(updateDelivery, {
    onSuccess: () => {
      queryClient.invalidateQueries("getDeliveries");
      showNotification({
        id: "success-notification-update-delivery",
        autoClose: 5000,
        title: "Success",
        message: "Successfully updated delivery.",
        icon: <IconCheck />,
        className: "my-notification-class",
        loading: false,
      });
    },
    onError: (error) => {
      showNotification({
        id: "error-notification-update-delivery",
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

function useDeleteDelivery() {
  const { axios } = useAuth();
  const queryClient = useQueryClient();

  const deleteDelivery = async (deliveryId) => {
    const { data } = await axios.delete(
      "/delivery-service/delivery/" + deliveryId
    );
    return data;
  };

  return useMutation(deleteDelivery, {
    onSuccess: () => {
      queryClient.invalidateQueries("getDeliveries");
      showNotification({
        id: "success-notification-delete-delivery",
        autoClose: 5000,
        title: "Success",
        message: "Successfully deleted delivery.",
        icon: <IconCheck />,
        className: "my-notification-class",
        loading: false,
      });
    },
    onError: (error) => {
      showNotification({
        id: "error-notification-delete-delivery",
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

//Box API
function useGetDispatcherBoxes() {
  const { axios } = useAuth();
  return useQuery("getBoxes", async () => {
    const { data } = await axios.get("/delivery-service/pickupbox");
    return data;
  });
}

function useCreateBox() {
  const { axios } = useAuth();
  const queryClient = useQueryClient();

  const createBox = async (box) => {
    const { data } = await axios.post("/delivery-service/pickupbox", box);
    return data;
  };

  return useMutation(createBox, {
    onSuccess: () => {
      queryClient.invalidateQueries("getBoxes");
      showNotification({
        id: "success-notification-create-box",
        autoClose: 5000,
        title: "Success",
        message: "Successfully created box.",
        icon: <IconCheck />,
        className: "my-notification-class",
        loading: false,
      });
    },
    onError: (error) => {
      showNotification({
        id: "error-notification-create-box",
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

function useUpdateBox() {
  const { axios } = useAuth();
  const queryClient = useQueryClient();

  const updateBox = async (box) => {
    const { data } = await axios.put(
      "/delivery-service/pickupbox/" + box.id,
      box
    );
    return data;
  };

  return useMutation(updateBox, {
    onSuccess: () => {
      queryClient.invalidateQueries("getBoxes");
      showNotification({
        id: "success-notification-create-update",
        autoClose: 5000,
        title: "Success",
        message: "Successfully updated box.",
        icon: <IconCheck />,
        className: "my-notification-class",
        loading: false,
      });
    },
    onError: (error) => {
      showNotification({
        id: "error-notification-update-box",
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

function useDeleteBox() {
  const { axios } = useAuth();
  const queryClient = useQueryClient();

  const deleteBox = async (boxId) => {
    const { data } = await axios.delete("/delivery-service/pickupbox/" + boxId);
    return data;
  };

  return useMutation(deleteBox, {
    onSuccess: () => {
      queryClient.invalidateQueries("getBoxes");
      showNotification({
        id: "success-notification-delete-box",
        autoClose: 5000,
        title: "Success",
        message: "Successfully deleted box.",
        icon: <IconCheck />,
        className: "my-notification-class",
        loading: false,
      });
    },
    onError: (error) => {
      showNotification({
        id: "error-notification-delete-box",
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

//User API
function useGetCustomers() {
  const { axios } = useAuth();

  return useQuery("getCustomers", async () => {
    const { data } = await axios.get("/authentication-service/user/customer");
    return data;
  });
}

function useGetDeliverers() {
  const { axios } = useAuth();

  return useQuery("getDeliverers", async () => {
    const { data } = await axios.get("/authentication-service/user/deliverer");
    return data;
  });
}

function useGetDispatchers() {
  const { axios } = useAuth();

  return useQuery("getDispatchers", async () => {
    const { data } = await axios.get("/authentication-service/user/dispatcher");
    return data;
  });
}

function useCreateUser(userType) {
  const { axios } = useAuth();
  const queryClient = useQueryClient();

  const createUser = async (user) => {
    const { data } = await axios.post("/authentication-service/user", user);
    return data;
  };

  return useMutation(createUser, {
    onSuccess: () => {
      if (userType === "CUSTOMER") {
        queryClient.invalidateQueries("getCustomers");
      } else if (userType == "DELIVERER") {
        queryClient.invalidateQueries("getDeliverers");
      } else {
        queryClient.invalidateQueries("getDispatchers");
      }
      showNotification({
        id: "success-notification-create-user",
        autoClose: 5000,
        title: "Success",
        message: "Successfully created.",
        icon: <IconCheck />,
        className: "my-notification-class",
        loading: false,
      });
    },
    onError: (error) => {
      showNotification({
        id: "error-notification-create-user",
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

function useUpdateUser(userType) {
  const { axios } = useAuth();
  const queryClient = useQueryClient();

  const updateUser = async (user) => {
    const { data } = await axios.put(
      "/authentication-service/user/" + user.id,
      user
    );
    return data;
  };

  return useMutation(updateUser, {
    onSuccess: () => {
      if (userType === "CUSTOMER") {
        queryClient.invalidateQueries("getCustomers");
      } else if (userType == "DELIVERER") {
        queryClient.invalidateQueries("getDeliverers");
      } else {
        queryClient.invalidateQueries("getDispatchers");
      }
      showNotification({
        id: "success-notification-update-user",
        autoClose: 5000,
        title: "Success",
        message: "Successfully updated.",
        icon: <IconCheck />,
        className: "my-notification-class",
        loading: false,
      });
    },
    onError: (error) => {
      showNotification({
        id: "error-notification-update-user",
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

function useDeleteUser(userType) {
  const { axios } = useAuth();
  const queryClient = useQueryClient();

  const deleteUser = async (userId) => {
    const { data } = await axios.delete(
      "/authentication-service/user/" + userId
    );
    return data;
  };

  return useMutation(deleteUser, {
    onSuccess: () => {
      if (userType === "CUSTOMER") {
        queryClient.invalidateQueries("getCustomers");
      } else if (userType == "DELIVERER") {
        queryClient.invalidateQueries("getDeliverers");
      } else {
        queryClient.invalidateQueries("getDispatchers");
      }
      showNotification({
        id: "success-notification-delete-user",
        autoClose: 5000,
        title: "Success",
        message: "Successfully deleted.",
        icon: <IconCheck />,
        className: "my-notification-class",
        loading: false,
      });
    },
    onError: (error) => {
      showNotification({
        id: "error-notification-delete-user",
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
  useGetDeliveries,
  useGetCustomerEmails,
  useGetPickupboxNames,
  useGetDelivererEmails,
  useCreateDelivery,
  useDeleteDelivery,
  useUpdateDelivery,
  useGetDispatcherBoxes,
  useCreateBox,
  useDeleteBox,
  useUpdateBox,
  useGetCustomers,
  useGetDeliverers,
  useGetDispatchers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useGetDeletedDeliveries,
};
