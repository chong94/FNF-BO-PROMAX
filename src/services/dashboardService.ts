import axios from "axios";

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

export async function getAgentList(
  onProgressUpdate?: (count: number) => void
): Promise<AgentData[]> {
  const allAgents: AgentData[] = [];

  const STARTING_ID =
    import.meta.env.VITE_STARTING_PARENT_ID ||
    "NjRiMGMyZGFlZjY0ZjUyZDgzM2I0MTlj";

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
        { headers: { "Content-Type": "application/json; charset=UTF-8" } }
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

        allAgents.push(...cleanData);
        if (onProgressUpdate) onProgressUpdate(allAgents.length);

        for (const agent of cleanData) {
          await fetchAgentsByParent(agent.id);
        }
      }
    } catch (error) {
      console.error(`Error fetching parent ${parentId}:`, error);
    }
  };

  await fetchAgentsByParent(STARTING_ID);
  return allAgents;
}

export async function getPlayerListFromAgents(
  agentList: AgentData[],
  onProgressUpdate?: (count: number) => void
): Promise<PlayerData[]> {
  const allPlayers: PlayerData[] = [];

  const fetchWithConcurrencyLimit = async (agentId: string) => {
    let currentPage = 1;
    let hasMore = true;

    while (hasMore) {
      try {
        const response = await axios.post("/list/member", {
          pageindex: currentPage,
          rowperpage: 300,
          parent: agentId,
        });

        const tempData = response.data.data;
        if (tempData && tempData.length > 0) {
          const cleanData = tempData.map((item: any) => {
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

          allPlayers.push(...cleanData);
          if (onProgressUpdate) onProgressUpdate(allPlayers.length);

          if (currentPage >= response.data.totalPage) hasMore = false;
          else currentPage++;
        } else {
          hasMore = false;
        }
      } catch (error) {
        hasMore = false;
      }
    }
  };

  for (const agent of agentList) {
    await fetchWithConcurrencyLimit(agent.id);
  }

  return allPlayers;
}
