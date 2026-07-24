import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import RightPanel from "../components/RightPanel";

const MainLayout = ({ children }) => {
  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        <div className="grid-layout">
          <aside className="grid-sidebar-left">
            <Sidebar />
          </aside>

          <section>
            {children}
          </section>

          <aside className="grid-sidebar-right">
            <RightPanel />
          </aside>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;