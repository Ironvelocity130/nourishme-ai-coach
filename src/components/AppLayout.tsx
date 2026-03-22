import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";
import AiCoachButton from "./AiCoachButton";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Outlet />
      <AiCoachButton />
      <BottomNav />
    </div>
  );
};

export default AppLayout;
