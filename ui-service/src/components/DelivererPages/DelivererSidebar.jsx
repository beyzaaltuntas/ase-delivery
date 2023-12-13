import { useState } from "react";
import { Navbar, Loader } from "@mantine/core";
import { useStyles } from "../SidebarStyle";
import { useNavigate } from "react-router-dom";
import { IconBoxSeam, IconQrcode, IconLogout } from "@tabler/icons";
import { useAuth } from "../../AuthProvider";

function DelivererSidebar(props) {
  const data = [
    {
      link: "/deliverer/boxes",
      label: "Boxes",
      icon: IconBoxSeam,
    },
    {
      link: "/deliverer/scan-qr-code",
      label: "QR Code",
      icon: IconQrcode,
    },
  ];
  const { classes, cx } = useStyles();
  const [active, setActive] = useState(props.label);
  const navigate = useNavigate();
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
            navigate("/deliverer/login");
          }}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </Navbar.Section>
    </Navbar>
  );
}

export default DelivererSidebar;
