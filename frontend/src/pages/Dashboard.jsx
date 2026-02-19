import Card from "../components/Card";

const Dashboard = () => (
  <div className="grid grid-cols-3 gap-4">
    <Card title="Employees" value="10" />
    <Card title="Present Today" value="8" />
    <Card title="Absent" value="2" />
  </div>
);

export default Dashboard;
