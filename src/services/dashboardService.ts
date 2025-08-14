import axios from "axios";

// Define types
export interface AgentData {
  id: string;
  name: string;
  cash: number;
  credit: number;
}

export interface PlayerData {
  id: string;
  name: string;
  cash: number;
  vId?: string;
}

// Recursive fetch for ALL agents (tree structure) with Promise.all
export async function getAgentList(
  onProgressUpdate?: (count: number) => void
): Promise<AgentData[]> {
  let allAgents: AgentData[] = [];

  const fetchAgentsByParent = async (parentId: string): Promise<void> => {
    try {
      const response = await axios.post(
        "/list/agent",
        {
          pageindex: 1,
          rowperpage: 300,
          parent: parentId,
          username: "",
          contact: "",
          ucreated: "",
          status: "",
        },
        {
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
        }
      );

      const tempData = response.data.data;

      if (tempData && tempData.length > 0) {
        const cleanData: AgentData[] = tempData.map((item: any) => {
          const itemStr = item[1];
          const startIndex = 60;
          const endIndex = itemStr.indexOf('"', startIndex);

          return {
            id: itemStr.slice(startIndex, endIndex),
            name: item[0],
            cash: Number(item[3]) || 0,
            credit: Number(item[4]) || 0,
          };
        });

        allAgents = allAgents.concat(cleanData);

        if (onProgressUpdate) {
          onProgressUpdate(allAgents.length);
        }

        await Promise.all(
          cleanData.map((agent: AgentData) => fetchAgentsByParent(agent.id))
        );
      }
    } catch (error) {
      console.error("Error fetching agent under parent", parentId, error);
    }
  };

  await fetchAgentsByParent("NjRiMGMyZGFlZjY0ZjUyZDgzM2I0MTlj"); // starting parentId

  return allAgents;
}

// Fetch ALL players under all agents
export async function getPlayerListFromAgents(
  agentList: AgentData[],
  onProgressUpdate?: (count: number) => void
): Promise<PlayerData[]> {
  let allPlayers: PlayerData[] = [];

  const fetchPlayersByAgentId = async (agentId: string) => {
    let currentPage = 1;
    let hasMore = true;

    while (hasMore) {
      try {
        const response = await axios.post(
          "/list/member",
          {
            pageindex: currentPage,
            rowperpage: 300,
            parent: agentId,
            username: "",
            contact: "",
            ucreated: "",
            status: "",
          },
          {
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
            },
          }
        );

        const tempData = response.data.data;

        if (tempData && tempData.length > 0) {
          const cleanData: PlayerData[] = tempData.map((item: any) => {
            const itemStr = item[1];
            const startIndex = itemStr.indexOf("gameid('") + 8;
            const endIndex = itemStr.indexOf("')", startIndex);

            return {
              id: item[0],
              name: itemStr.substring(0, startIndex - 8),
              cash: Number(item[3]) || 0,
              vId: itemStr.slice(startIndex, endIndex),
            };
          });

          allPlayers = allPlayers.concat(cleanData);

          if (onProgressUpdate) {
            onProgressUpdate(allPlayers.length);
          }

          if (currentPage >= response.data.totalPage) {
            hasMore = false;
          } else {
            currentPage++;
          }
        } else {
          hasMore = false;
        }
      } catch (error) {
        console.error("Error fetching players under agent", agentId, error);
        hasMore = false;
      }
    }
  };

  await Promise.all(
    agentList.map((agent: AgentData) => fetchPlayersByAgentId(agent.id))
  );

  return allPlayers;
}
