import {
  Button,
  Card,
  Col,
  Row,
  Statistic,
  Table,
  Typography,
  message,
  Progress,
} from "antd";
import { useState, useEffect } from "react";
import {
  getAgentList,
  getPlayerListFromAgents,
  AgentData,
  PlayerData,
} from "../services/dashboardService";
import axios from "axios";
import dayjs from "dayjs";
import "./DashboardPage.css";
import { useDispatch, UseDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const [agents, setAgents] = useState<AgentData[]>([]);
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [totalAgentWallet, setTotalAgentWallet] = useState(0);
  const [agentNegativeWallet, setAgentNegativeWallet] = useState(0);
  const [agentCredit, setAgentCredit] = useState(0);
  const [totalPlayerWallet, setTotalPlayerWallet] = useState(0);

  const [totalAgentCount, setTotalAgentCount] = useState<number | null>(null);
  const [totalPlayerCount, setTotalPlayerCount] = useState<number | null>(null);

  const [agentProgress, setAgentProgress] = useState(0);
  const [playerProgress, setPlayerProgress] = useState(0);

  const [agentLoading, setAgentLoading] = useState(false);
  const [playerLoading, setPlayerLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchStatistics = async () => {
    try {
      const today = dayjs().format("YYYY-MM-DD");
      const last7Days = dayjs().subtract(6, "day").format("YYYY-MM-DD");

      const params = new URLSearchParams({
        "params[username]": last7Days,
        "params[password]": today,
      });

      const response = await axios.post("/statistics/company-self", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
      });

      setTotalAgentCount(response.data.data.totalAgent);
      setTotalPlayerCount(response.data.data.totalMember);
      message.success("Statistics loaded!");
    } catch (error) {
      console.error("Failed to fetch statistics", error);
      message.error("Failed to load statistics.");
    }
  };

  const logOut = () => {};

  const fetchAgents = async () => {
    setAgentLoading(true);
    try {
      const data = await getAgentList((currentCount: number) => {
        if (totalAgentCount) {
          const progress = (currentCount / totalAgentCount) * 100;
          setAgentProgress(Math.min(progress, 100));
        }
      });
      setAgents(data);

      // Correct calculation here
      const positiveWallet = data.reduce(
        (sum, agent) => sum + (agent.cash > 0 ? agent.cash : 0),
        0
      );
      const negativeWallet = data.reduce(
        (sum, agent) => sum + (agent.cash < 0 ? agent.cash : 0),
        0
      );
      const creditAmount = data.reduce((sum, agent) => sum + agent.credit, 0);

      setTotalAgentWallet(positiveWallet);
      setAgentNegativeWallet(negativeWallet);
      setAgentCredit(creditAmount);

      message.success("Agent data loaded!");
    } catch (error) {
      console.error(error);
      message.error("Failed to load agent data.");
    } finally {
      setAgentLoading(false);
    }
  };

  const fetchPlayers = async () => {
    setPlayerLoading(true);
    try {
      const data = await getPlayerListFromAgents(
        agents,
        (currentCount: number) => {
          if (totalPlayerCount) {
            const progress = (currentCount / totalPlayerCount) * 100;
            setPlayerProgress(Math.min(progress, 100));
          }
        }
      );
      setPlayers(data);

      const walletAmount = data.reduce((sum, player) => sum + player.cash, 0);
      setTotalPlayerWallet(walletAmount);

      message.success("Player data loaded!");
    } catch (error) {
      console.error(error);
      message.error("Failed to load player data.");
    } finally {
      setPlayerLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  const agentColumns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Cash",
      dataIndex: "cash",
      key: "cash",
      sorter: (a: any, b: any) => a.cash - b.cash,
      render: (cash: number) =>
        typeof cash === "number" ? cash.toFixed(2) : "0.00",
    },
  ];

  const playerColumns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Cash",
      dataIndex: "cash",
      key: "cash",
      sorter: (a: any, b: any) => a.cash - b.cash,
      render: (cash: number) =>
        typeof cash === "number" ? cash.toFixed(2) : "0.00",
    },
    {
      title: "Total Deposit",
      dataIndex: "totalD",
      key: "totalD",
      sorter: (a: any, b: any) => a.totalD - b.totalD,
    },
    { title: "vID", dataIndex: "vId", key: "vId" },
  ];

  const todayFormatted = dayjs().format("DD/MM/YYYY");

  return (
    <div className="dashboard-container">
      <Typography.Title level={2}>Dashboard</Typography.Title>
      <Button
        type="primary"
        danger
        onClick={() => {
          dispatch(logout());
          navigate("/");
        }}
      >
        Logout
      </Button>

      {/* Statistics Cards */}
      <Row gutter={16} className="dashboard-button-row">
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Agents (Server)"
              value={totalAgentCount ?? "-"}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Players (Server)"
              value={totalPlayerCount ?? "-"}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Agent Wallet (+)"
              value={totalAgentWallet.toFixed(2)}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Player Wallet"
              value={totalPlayerWallet.toFixed(2)}
            />
          </Card>
        </Col>
      </Row>

      {/* Action Buttons */}
      <Row gutter={16} className="dashboard-button-row">
        <Col>
          <Button type="primary" onClick={fetchAgents}>
            Get Agents
          </Button>
        </Col>
        <Col>
          <Button
            type="primary"
            onClick={fetchPlayers}
            disabled={agents.length === 0}
          >
            Get Players
          </Button>
        </Col>
      </Row>

      {/* Progress Bars */}
      <Row gutter={16} className="dashboard-progress-row">
        <Col span={12}>
          <Typography.Title level={5}>Agent Loading Progress</Typography.Title>
          <Progress percent={Math.floor(agentProgress)} />
        </Col>
        <Col span={12}>
          <Typography.Title level={5}>Player Loading Progress</Typography.Title>
          <Progress percent={Math.floor(playerProgress)} />
        </Col>
      </Row>

      {/* Summary Message */}
      <div className="dashboard-summary">
        <Typography.Title level={4} className="dashboard-summary-title">
          Summary Message - {todayFormatted}
        </Typography.Title>

        {totalAgentWallet !== 0 && (
          <div>Agent Wallet Positive Amount: {totalAgentWallet.toFixed(2)}</div>
        )}
        {agentNegativeWallet !== 0 && (
          <div>
            Agent Wallet Negative Amount: {agentNegativeWallet.toFixed(2)}
          </div>
        )}
        {agentCredit !== 0 && (
          <div>Agent Credit Amount: {agentCredit.toFixed(2)}</div>
        )}
        {totalPlayerWallet !== 0 && (
          <div>Member Wallet Amount: {totalPlayerWallet.toFixed(2)}</div>
        )}
      </div>

      {/* Agent Table */}
      <Typography.Title level={4}>Agent List</Typography.Title>
      <Table
        dataSource={agents}
        columns={agentColumns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        loading={agentLoading}
      />

      {/* Player Table */}
      <Typography.Title level={4}>Player List</Typography.Title>
      <Table
        dataSource={players}
        columns={playerColumns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        loading={playerLoading}
      />
    </div>
  );
}

export default DashboardPage;
