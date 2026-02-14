# MetaOrcha Integration Plan

**Repository**: notion-agent-mcp  
**Integration Target**: metaorcha-emerge Gateway  
**Status**: 🔒 **BLOCKED** - MVP must be complete before integration

---

## Integration Status: NOT APPROVED

**Current Decision**: Develop Notion agent in **COMPLETE ISOLATION** until proven functional.

### Approval Requirements
Before this agent can be integrated into MetaOrcha:

1. ✅ **All 5 tools implemented and tested**
   - ⏳ create_page (✅ implemented, ⏳ tested)
   - ⏳ update_page
   - ⏳ query_database
   - ⏳ search
   - ⏳ add_chart

2. ✅ **Test coverage ≥ 80%**
   - ⏳ Unit tests
   - ⏳ Integration tests
   - ⏳ E2E tests

3. ✅ **Claude Desktop integration proven**
   - ⏳ Connect to Claude Desktop
   - ⏳ Execute all tools via chat
   - ⏳ Verify error handling

4. ✅ **Railway deployment successful**
   - ⏳ Deploy standalone agent
   - ⏳ 24-hour uptime monitoring
   - ⏳ Performance benchmarks met

5. ✅ **Spec document reviewed and approved**
   - ⏳ Update SPEC.md in metaorcha-emerge
   - ⏳ Technical review
   - ⏳ User approval

6. ✅ **Documentation complete**
   - ✅ README.md
   - ⏳ API documentation
   - ⏳ Troubleshooting guide

---

## Architecture Overview

### Current State (Isolated Development)

```
┌─────────────────────────────────────────┐
│  Claude Desktop / LLM Client            │
│  (MCP Protocol)                          │
└───────────────┬─────────────────────────┘
                │ stdio/SSE
                ▼
┌─────────────────────────────────────────┐
│  Notion Agent MCP Server                │
│  - create_page                           │
│  - update_page                           │
│  - query_database                        │
│  - search                                │
│  - add_chart                             │
└───────────────┬─────────────────────────┘
                │ HTTP/REST
                ▼
┌─────────────────────────────────────────┐
│  Notion API                              │
│  (workspace data)                        │
└─────────────────────────────────────────┘
```

### Future State (MetaOrcha Integration)

```
┌─────────────────────────────────────────┐
│  Frontend (Lovable)                      │
│  - NotionResearch.tsx                    │
└───────────────┬─────────────────────────┘
                │ HTTP/REST
                ▼
┌─────────────────────────────────────────┐
│  MetaOrcha Gateway (FastAPI)             │
│  - Workflow orchestration                │
│  - Authentication                        │
│  - Rate limiting                         │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  LangGraph + OpenRouter                  │
│  - Planning (Claude 3.5 Sonnet)          │
│  - Decision making                       │
│  - Agent coordination                    │
└───────────────┬─────────────────────────┘
                │ MCP Protocol
                ▼
┌─────────────────────────────────────────┐
│  Notion Agent MCP Server (THIS REPO)     │
│  - Tool execution                        │
│  - Notion API calls                      │
│  - Error handling                        │
└───────────────┬─────────────────────────┘
                │ HTTP/REST
                ▼
┌─────────────────────────────────────────┐
│  Notion API                              │
└─────────────────────────────────────────┘
```

---

## Integration Components

### 1. Gateway Integration

**File**: `metaorcha-emerge/services/gateway/src/agents/notion_agent.py`

**Purpose**: Gateway connector to Notion MCP server

**Implementation** (Post-MVP):
```python
from src.agents.base import BaseAgent
import httpx

class NotionAgent(BaseAgent):
    """Notion MCP Agent connector"""
    
    def __init__(self):
        super().__init__(
            name="notion-researcher",
            description="Research agent with Notion integration"
        )
        self.mcp_url = os.getenv("NOTION_AGENT_URL")
    
    async def execute_tool(self, tool_name: str, params: dict):
        """Call Notion MCP server via HTTP"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.mcp_url}/tools/{tool_name}",
                json=params
            )
            return response.json()
```

**Status**: 📋 Not implemented (blocked until MVP complete)

---

### 2. LangGraph Workflow Integration

**File**: `metaorcha-emerge/mvp/services/gateway/src/runtime/orchestrator.py`

**Current State**: LangGraph orchestrator exists but doesn't know about Notion agent

**Integration** (Post-MVP):
```python
from langgraph.graph import StateGraph
from src.agents.notion_agent import NotionAgent

# Add Notion agent to workflow graph
notion_agent = NotionAgent()

workflow = StateGraph()
workflow.add_node("planner", planner_node)
workflow.add_node("notion_researcher", notion_agent.execute)
workflow.add_edge("planner", "notion_researcher")
```

**Status**: 📋 Not implemented

---

### 3. Frontend Integration

**Files**: 
- ✅ `metaorcha-control/src/lib/notion-agent-api.ts` (already created with mock mode)
- ✅ `metaorcha-control/src/pages/NotionResearch.tsx` (already created)

**Current State**: Frontend uses mock data

**Integration** (Post-Gateway deployment):
- Update `IS_MOCK_MODE` detection to check Gateway health
- Point API calls to Gateway endpoint (`/api/v1/agents/notion/workflows`)
- Gateway routes to LangGraph, which calls Notion MCP server

**Status**: ✅ Frontend ready, ⏳ Backend not deployed

---

### 4. Authentication & Authorization

**Current State**: Notion agent uses API key directly

**Integration Requirements**:
- Gateway handles user authentication (JWT)
- Gateway stores user's Notion API key securely (encrypted)
- Gateway passes Notion API key to agent per request
- Agent validates key before Notion API calls

**Implementation**:
```python
# Gateway
async def call_notion_agent(user_id: str, workflow: dict):
    user = await get_user(user_id)
    notion_key = decrypt(user.notion_api_key)
    
    return await notion_agent.execute_tool(
        tool_name=workflow["tool"],
        params={**workflow["params"], "api_key": notion_key}
    )
```

**Status**: 📋 Not implemented

---

## Environment Configuration

### Development (Current)
```bash
# notion-agent-mcp/.env
NOTION_API_KEY=secret_xxx  # Direct API key for testing
PORT=3000
LOG_LEVEL=debug
```

### Production (Post-Integration)
```bash
# Gateway passes API key per request
# Agent doesn't need static NOTION_API_KEY
PORT=3000
LOG_LEVEL=info
GATEWAY_URL=https://gateway.metaorcha.com  # For health checks
```

---

## Testing Strategy

### Phase 1: Isolated Testing ✅ (CURRENT)
**Environment**: Local + Claude Desktop
- Test each tool individually
- Verify MCP protocol compliance
- Test error handling

### Phase 2: Standalone Deployment ⏳
**Environment**: Railway (agent only)
- Deploy Notion agent without Gateway
- Test with Claude Desktop (remote)
- Monitor performance for 24 hours

### Phase 3: Integration Testing 🔒 (BLOCKED)
**Environment**: Full MetaOrcha stack
- Deploy Gateway + Agent
- Test Frontend → Gateway → LangGraph → Agent flow
- Verify authentication works
- Load testing

---

## Deployment Order

**DO NOT PROCEED TO NEXT PHASE UNTIL PREVIOUS IS COMPLETE**

### Phase 1: Notion Agent Only ✅
1. ✅ Local development
2. ⏳ Deploy to Railway (standalone)
3. ⏳ Test with Claude Desktop
4. ⏳ Performance validation

**Blocked on**: Tools 2-5 implementation, testing

### Phase 2: Gateway Core 🔒
1. ⏳ Deploy PostgreSQL (Railway)
2. ⏳ Deploy Redis (Railway)
3. ⏳ Deploy Kafka (Railway or managed)
4. ⏳ Deploy Gateway service (Railway)
5. ⏳ Test Gateway health endpoints

**Blocked on**: Phase 1 complete

### Phase 3: Full Integration 🔒
1. ⏳ Connect Gateway to Notion agent
2. ⏳ Configure LangGraph workflows
3. ⏳ Update Frontend to use real Backend
4. ⏳ End-to-end testing
5. ⏳ Production deployment

**Blocked on**: Phase 2 complete + Spec approval

---

## Communication Protocols

### Between Frontend and Gateway
**Protocol**: HTTP/REST  
**Format**: JSON  
**Authentication**: JWT tokens

### Between Gateway and LangGraph
**Protocol**: In-process (same service)  
**Format**: Python function calls

### Between LangGraph and Notion Agent
**Protocol**: MCP over HTTP (or stdio if same machine)  
**Format**: JSON-RPC  
**Schema**: MCP 1.0 specification

### Between Notion Agent and Notion API
**Protocol**: HTTP/REST  
**Format**: JSON  
**Authentication**: Bearer token (Notion API key)

---

## Data Flow Example

**User Request**: "Research Bitcoin and create a Notion page with findings"

```
1. Frontend → Gateway
   POST /api/v1/agents/notion/workflows
   {
     "workflow": "research",
     "topic": "Bitcoin",
     "instructions": "Create research page in Notion"
   }

2. Gateway → Database
   - Store workflow record
   - Get user's Notion API key (encrypted)

3. Gateway → LangGraph (Orchestrator)
   - Decrypt Notion API key
   - Pass to LangGraph for planning

4. LangGraph → OpenRouter (Planning)
   - "I need to research Bitcoin and create a Notion page"
   - LLM response: "Use search tool, then create_page tool"

5. LangGraph → Notion Agent (via MCP)
   {
     "method": "tools/call",
     "params": {
       "name": "search",
       "arguments": {"query": "Bitcoin"}
     }
   }

6. Notion Agent → Notion API
   - Search workspace for "Bitcoin"
   - Return relevant pages

7. Notion Agent → LangGraph (response)
   {"success": true, "data": [...results]}

8. LangGraph → OpenRouter (decision)
   - "Here are search results, now create page"

9. LangGraph → Notion Agent (via MCP)
   {
     "method": "tools/call",
     "params": {
       "name": "create_page",
       "arguments": {
         "parentId": "database_id",
         "title": "Bitcoin Research",
         "content": [...formatted_content]
       }
     }
   }

10. Notion Agent → Notion API
    - Create page with content
    - Return page URL

11. Gateway → Frontend (SSE stream)
    {
      "event": "complete",
      "data": {
        "pageUrl": "https://notion.so/...",
        "summary": "Created research page with 5 sections"
      }
    }
```

---

## Breaking Changes to Watch

### If MetaOrcha Gateway Changes:
- Authentication mechanism
- Workflow schema
- Error response format
- Rate limiting behavior

**Action**: Ensure agent adapts or document incompatibilities

### If Notion API Changes:
- API version updates
- Breaking changes to endpoints
- Deprecations

**Action**: Update agent and test thoroughly

### If MCP Protocol Changes:
- Schema updates
- New capabilities
- Transport changes

**Action**: Update MCP SDK dependency and regenerate types

---

## Rollback Plan

If integration fails:

1. **Keep agent deployed independently**
   - Users can still use via Claude Desktop
   - No MetaOrcha dependency

2. **Frontend reverts to mock mode**
   - Set `IS_MOCK_MODE=true`
   - User sees "Backend temporarily unavailable"

3. **Debug without production impact**
   - Test fixes in staging environment
   - Don't rush integration

---

## Success Criteria

Integration is considered successful when:

1. ✅ **All tools work via MetaOrcha frontend**
   - User can create pages through UI
   - Search works
   - Charts embed correctly

2. ✅ **Performance meets targets**
   - < 5s per workflow
   - 99.9% uptime
   - No memory leaks

3. ✅ **Error handling works**
   - Invalid Notion API keys show clear error
   - Network failures retry gracefully
   - User sees helpful error messages

4. ✅ **Authentication is secure**
   - Notion API keys encrypted at rest
   - No keys logged
   - Proper key rotation support

5. ✅ **Monitoring in place**
   - Tool execution metrics
   - Error rate tracking
   - Usage analytics

---

## Open Questions

1. **Tool discovery**: How does Gateway know which tools Notion agent offers?
   - Option A: Static configuration in Gateway
   - Option B: Dynamic via MCP ListTools
   - **Decision**: ⏳ Pending

2. **Scaling**: What if Notion agent needs multiple instances?
   - Option A: Load balancer in front of agents
   - Option B: Gateway routes to multiple agents
   - **Decision**: ⏳ Pending (not needed for MVP)

3. **Caching**: Should Gateway cache Notion data?
   - Option A: No caching (always fresh)
   - Option B: Cache search results for 5 minutes
   - **Decision**: ⏳ Pending

4. **Rate limiting**: Notion API has rate limits, how to handle?
   - Option A: Agent implements backoff/retry
   - Option B: Gateway implements rate limiting
   - **Decision**: ⏳ Agent handles retries (already implemented in create_page)

---

## Last Updated
**Date**: 2026-02-14  
**Status**: 🔒 Integration blocked until MVP complete  
**Next Review**: After all 5 tools implemented and tested

---

## Contact / Approvals

**Technical Review**: ⏳ Required before integration  
**Spec Approval**: ⏳ Required before integration  
**User Approval**: ⏳ Required before merging to develop

**Repository Owners**:
- metaorcha-emerge: AHA-orcha
- notion-agent-mcp: azank1
- metaorcha-control: AHA-orcha
