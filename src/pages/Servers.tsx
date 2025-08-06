import { ServerList } from "@/components/ServerList";

const Servers = () => {
  const handleServerSelect = (server: any) => {
    console.log("Server selected:", server);
    // Navigation will be handled by the component or parent
  };

  return <ServerList onServerSelect={handleServerSelect} />;
};

export default Servers;