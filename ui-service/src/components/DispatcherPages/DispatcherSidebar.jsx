import { useState } from "react";
import { Navbar, Loader } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import {
  IconPencil,
  IconUsers,
  IconBoxSeam,
  IconLogout,
  IconInbox,
  IconBox,
  IconTrashX,
} from "@tabler/icons";
import { useStyles } from "../SidebarStyle";
import { useAuth } from "../../AuthProvider";

const data = [
  {
    link: "/dispatcher/dispatchers",
    label: "Dispatchers",
    icon: IconPencil,
  },
  {
    link: "/dispatcher/deliverers",
    label: "Deliverers",
    icon: IconBoxSeam,
  },
  {
    link: "/dispatcher/customers",
    label: "Customers",
    icon: IconUsers,
  },
  {
    link: "/dispatcher/boxes",
    label: "Boxes",
    icon: IconInbox,
  },
  {
    link: "/dispatcher/deliveries",
    label: "Deliveries",
    icon: IconBox,
  },
  {
    link: "/dispatcher/deleted-deliveries",
    label: "Deleted Deliveries",
    icon: IconTrashX,
  },
];
function DispatcherSidebar(props) {
  const navigate = useNavigate();
  const { classes, cx } = useStyles();
  const [active, setActive] = useState(props.label);
  const { isLoading, isAuthenticated } = useAuth();

  if (!isAuthenticated && isLoading) {
    return;
  }

  const links = data.map((item) => (
    <a
      className={cx(classes.link, {
        [classes.linkActive]: item.label === active,
      })}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        navigate(item.link);
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <Navbar p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
      <Navbar.Section grow>{links}</Navbar.Section>
      <Navbar.Section className={classes.footer}>
        <a
          href="#"
          className={classes.link}
          onClick={() => {
            localStorage.clear();
            navigate("/dispatcher/login");
          }}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </Navbar.Section>
    </Navbar>
  );
}

export default DispatcherSidebar;
